import { Statement } from '../types/flow';

/**
 * Pure layout engine of the flowchart canvas.
 *
 * It is intentionally free of any React/SVG code so that the geometry can be
 * unit-tested: every connector drawn by FlowchartCanvas.tsx is derived from the
 * coordinates computed here, and there is exactly ONE source of truth for them
 * (this is what used to be broken for IF branches and loops).
 */

// ── Shape metrics ────────────────────────────────────────────────────────────
// These MUST match the real SVG shapes drawn in BlockNode.tsx.
export const NODE_W = 180; // declare/assign/call rectangles:  x=-90 → 90
export const NODE_H = 50;
export const IO_W = 200; // input/output parallelogram:  -100 → 100
export const MAIN_H = 40; // start/end ovals: y=-19 → 19 (+2 stroke)
export const IF_W = 160; // diamond:  "0,-32 80,0 0,32 -80,0"
export const IF_H = 64;
export const LOOP_W = 160; // while/do hexagon:  "-65,-25 65,-25 80,0 65,25 -65,25 -80,0"
export const FOR_W = 190; // for hexagon is WIDER:  "-80,-25 80,-25 95,0 80,25 -80,25 -95,0"
export const LOOP_H = 50;
export const FOR_H = 50;

// Arrowhead drawn in user space (never scaled by the 2px stroke width).
export const ARROW_LEN = 10;

// ── Spacing ──────────────────────────────────────────────────────────────────
export const V_GAP = 40; // vertical distance between two stacked statements
export const H_GAP = 50; // horizontal distance between a shape and its branch column
export const BRANCH_STUB = H_GAP / 2; // run from the shape edge to the branch column
export const CANVAS_PAD = 100; // empty margin kept around the diagram

export interface LayoutNode {
  id: string;
  type: string;
  statement?: Statement;
  width: number;
  height: number;

  /** x of the shape centre (aka the spine of this sub-list) */
  x: number;
  /** y of the shape centre — where branches leave the shape */
  y: number;
  /** y of the top edge of the shape — where the incoming arrow lands */
  top: number;
  /** y from which the flow leaves this statement (merge line for IF/loops) */
  bottom: number;

  // Absolute connector geometry of nested branches
  leftX?: number;
  rightX?: number;
  bodyX?: number;
  returnX?: number;
  childTop?: number;
  mergeY?: number;

  thenLayout?: ListLayout;
  elseLayout?: ListLayout;
  bodyLayout?: ListLayout;
}

export interface ListLayout {
  nodes: LayoutNode[];
  width: number;
  height: number;
}

export interface DiagramLayout {
  listLayout: ListLayout;
  /** y where the flow leaves the start oval */
  flowStartY: number;
  /** y where the flow must reach the end oval */
  flowEndY: number;
  /** y of the centre of the end oval */
  endOvalY: number;
  minX: number;
  maxX: number;
  height: number;
}

export const isLoopType = (t: string): t is 'while' | 'for' | 'do' =>
  t === 'while' || t === 'for' || t === 'do';

/**
 * Real half width of a shape ON ITS CENTRE ROW — i.e. where the horizontal
 * branch wires and the loop-back arrow must stop to touch the outline.
 * The `for` hexagon is 15px wider per side than the while/do one, which is why
 * a single LOOP_W/2 constant used to make its loop-back arrow land INSIDE the
 * shape.
 */
export const shapeHalfW = (t: string): number =>
  t === 'if'
    ? IF_W / 2
    : t === 'for'
    ? FOR_W / 2
    : isLoopType(t)
    ? LOOP_W / 2
    : NODE_W / 2;

/**
 * Real half width of a shape on its CENTRE ROW, used to size the canvas: the
 * input/output parallelogram sticks out 10px past the nominal 180px column.
 */
export const shapeOutlineHalfW = (t: string): number =>
  t === 'input' || t === 'output' ? IO_W / 2 : shapeHalfW(t);

export const shapeHalfH = (t: string): number =>
  t === 'if' ? IF_H / 2 : isLoopType(t) ? LOOP_H / 2 : NODE_H / 2;

/**
 * y where a vertical wire running at `x` touches the TOP outline of a shape.
 *
 * This is the single fix for the arrowheads that used to float inside the
 * diamond: a diamond narrows towards its top vertex, so its real border at an
 * offset from the centre is LOWER than its bounding box top. A hexagon keeps a
 * flat top for most of its width and only narrows inside its pointed caps.
 */
export const shapeTopYAt = (node: LayoutNode, x: number): number => {
  const halfH = shapeHalfH(node.type);
  const offset = Math.abs(x - node.x);

  if (node.type === 'if') {
    const halfW = IF_W / 2;
    if (offset >= halfW) return node.y;
    return node.y - halfH * (1 - offset / halfW);
  }

  if (node.type === 'for') {
    const flat = 80; // the flat part of the for hexagon is 160px wide
    if (offset <= flat) return node.y - halfH;
    if (offset >= FOR_W / 2) return node.y;
    return node.y - halfH * ((FOR_W / 2 - offset) / (FOR_W / 2 - flat));
  }

  if (isLoopType(node.type)) {
    const flat = 65; // the flat part of the while/do hexagon is 130px wide
    if (offset <= flat) return node.y - halfH;
    if (offset >= LOOP_W / 2) return node.y;
    return node.y - halfH * ((LOOP_W / 2 - offset) / (LOOP_W / 2 - flat));
  }

  return node.y - halfH;
};

/**
 * x where a horizontal wire touches the LEFT/RIGHT outline of a shape on its
 * centre row. Branch stubs leave from here and the loop-back arrowhead stops
 * here, so both are glued to the shape instead of hovering near it.
 */
export const shapeEdgeX = (node: LayoutNode, side: 'left' | 'right'): number => {
  const halfW = shapeHalfW(node.type);
  return side === 'left' ? node.x - halfW : node.x + halfW;
};

/**
 * MEASURE PASS — bottom-up. Computes the bounding size of every statement,
 * including the vertical space taken by its nested branches.
 */
export function computeListLayout(list: Statement[]): ListLayout {
  const nodes: LayoutNode[] = [];
  let currentY = 0;
  let maxWidth = NODE_W;

  for (const stmt of list) {
    let width = shapeHalfW(stmt.type) * 2;
    let height = shapeHalfH(stmt.type) * 2;
    let thenLayout: ListLayout | undefined;
    let elseLayout: ListLayout | undefined;
    let bodyLayout: ListLayout | undefined;

    if (stmt.type === 'if') {
      thenLayout = computeListLayout(stmt.thenBranch);
      elseLayout = computeListLayout(stmt.elseBranch);
      // [FALSE column][stub][diamond][stub][TRUE column]
      width = IF_W + 2 * BRANCH_STUB + elseLayout.width + thenLayout.width;
      // half diamond + drop to the branches + tallest branch + drop to the merge line
      height = IF_H / 2 + V_GAP / 2 + Math.max(thenLayout.height, elseLayout.height) + V_GAP / 2;
    } else if (stmt.type === 'while' || stmt.type === 'for' || stmt.type === 'do') {
      bodyLayout = computeListLayout(stmt.body);
      // body column on the right + the loop-back wire on the left
      width = shapeHalfW(stmt.type) * 2 + 2 * BRANCH_STUB + bodyLayout.width;
      height = LOOP_H / 2 + V_GAP / 2 + bodyLayout.height + V_GAP / 2;
    }

    nodes.push({
      id: stmt.id,
      type: stmt.type,
      statement: stmt,
      width,
      height,
      x: 0,
      y: 0,
      top: 0,
      bottom: 0,
      thenLayout,
      elseLayout,
      bodyLayout
    });

    maxWidth = Math.max(maxWidth, width);
    currentY += height + V_GAP;
  }

  return {
    nodes,
    width: maxWidth,
    height: currentY > 0 ? currentY - V_GAP : 0
  };
}

/**
 * ALIGN PASS — top-down. Turns the relative sizes into absolute coordinates and
 * stores the branch/loop connector geometry on each node.
 *
 * Invariant guaranteed here: `node.bottom === node.mergeY` for IF and loops,
 * i.e. the elbows coming back from the branches join exactly the point from
 * which the main flow continues.
 */
export function alignCoordinates(layout: ListLayout, centerX: number, startY: number): void {
  let currentY = startY;

  for (const node of layout.nodes) {
    node.x = centerX;
    node.top = currentY;
    node.y = currentY + shapeHalfH(node.type);
    node.bottom = currentY + node.height;

    if (node.type === 'if' && node.thenLayout && node.elseLayout) {
      // FALSE column on the left, TRUE column on the right (Flowgorithm layout)
      node.leftX = centerX - (IF_W / 2 + BRANCH_STUB + node.elseLayout.width / 2);
      node.rightX = centerX + (IF_W / 2 + BRANCH_STUB + node.thenLayout.width / 2);
      // Branches leave the diamond from its horizontal vertices (node.y)
      node.childTop = node.y + V_GAP / 2;
      node.mergeY = node.childTop + Math.max(node.thenLayout.height, node.elseLayout.height) + V_GAP / 2;
      alignCoordinates(node.elseLayout, node.leftX, node.childTop);
      alignCoordinates(node.thenLayout, node.rightX, node.childTop);
    } else if (isLoopType(node.type) && node.bodyLayout) {
      // the loop body hangs from the right vertex of the loop header; the
      // loop-back wire runs up the left side of the shape.
      node.bodyX = centerX + shapeHalfW(node.type) + BRANCH_STUB + node.bodyLayout.width / 2;
      node.returnX = centerX - (shapeHalfW(node.type) + BRANCH_STUB);
      node.childTop = node.y + V_GAP / 2;
      node.mergeY = node.childTop + node.bodyLayout.height + V_GAP / 2;
      alignCoordinates(node.bodyLayout, node.bodyX, node.childTop);
    }

    currentY += node.height + V_GAP;
  }
}

/** Real horizontal extent of an aligned layout (used to centre the canvas). */
export function measureBounds(layout: ListLayout, bounds: { minX: number; maxX: number }): void {
  for (const node of layout.nodes) {
    const halfW = shapeOutlineHalfW(node.type);
    bounds.minX = Math.min(bounds.minX, node.x - halfW);
    bounds.maxX = Math.max(bounds.maxX, node.x + halfW);
    if (node.type === 'if' && node.thenLayout && node.elseLayout) {
      measureBounds(node.elseLayout, bounds);
      measureBounds(node.thenLayout, bounds);
    } else if (isLoopType(node.type) && node.bodyLayout) {
      measureBounds(node.bodyLayout, bounds);
    }
  }
}

/** Full layout of a program: sizes, absolute coordinates and canvas bounds. */
export function buildDiagram(statements: Statement[]): DiagramLayout {
  const listLayout = computeListLayout(statements);
  const contentTop = MAIN_H + V_GAP;
  alignCoordinates(listLayout, 0, contentTop);

  const contentBottom = contentTop + listLayout.height;
  const endOvalY = contentBottom + V_GAP + MAIN_H / 2;

  const bounds = { minX: -NODE_W / 2, maxX: NODE_W / 2 };
  measureBounds(listLayout, bounds);

  return {
    listLayout,
    flowStartY: MAIN_H,
    flowEndY: contentBottom + V_GAP,
    endOvalY,
    minX: bounds.minX - CANVAS_PAD,
    maxX: bounds.maxX + CANVAS_PAD,
    height: endOvalY + MAIN_H / 2 + 60
  };
}

// ── Connector plan ───────────────────────────────────────────────────────────
/**
 * One straight piece of wire. `arrow` marks the pieces that carry an arrowhead
 * at their (x2,y2) end — always the end that touches a block outline or a merge
 * point, so the tip is never hidden inside a shape.
 */
export interface WireSegment {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  arrow?: boolean;
}

/** Where a "+" inserter button sits, and what a click on it inserts into. */
export interface InserterSpot {
  id: string;
  x: number;
  y: number;
  parentId: string;
  index?: number;
}

export interface ConnectorPlan {
  segments: WireSegment[];
  inserters: InserterSpot[];
}

/**
 * Builds every wire of the diagram. The renderer only paints this list, so the
 * arrow tips can be asserted in unit tests.
 *
 * Conventions (matching Flowgorithm):
 *   - a wire entering a block from above ends with an arrowhead on its TOP edge;
 *   - the wire of a branch leaves the shape from its horizontal vertex and comes
 *     back to the merge point with an arrowhead pointing at the spine;
 *   - the loop-back wire climbs the left side and points at the left vertex.
 */
export function computeConnectorPlan(diagram: DiagramLayout): ConnectorPlan {
  const segments: WireSegment[] = [];
  const inserters: InserterSpot[] = [];

  const push = (
    id: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    arrow = false
  ) => {
    segments.push({ id, x1, y1, x2, y2, arrow });
  };

  const pushInserter = (
    id: string,
    x: number,
    y: number,
    parentId: string,
    index?: number
  ) => {
    inserters.push({ id, x, y, parentId, index });
  };

  /**
   * Wires of one list of statements. `startY` is where the incoming flow
   * arrives, `endY` where this list must hand the flow over (the next block,
   * the merge line of the enclosing branch, or the END oval).
   */
  const planList = (
    layout: ListLayout,
    centerX: number,
    startY: number,
    endY: number,
    parent?: { id: string; branch: string }
  ) => {
    let cursor = startY;

    layout.nodes.forEach((node, index) => {
      // Incoming wire: its arrowhead sits on the REAL outline of the shape,
      // which for a diamond is above its bounding box (slanted edge).
      const topOfShape = shapeTopYAt(node, centerX);
      push(`in-${node.id}`, centerX, cursor, centerX, topOfShape, true);
      pushInserter(`ins-in-${node.id}`, centerX, (cursor + topOfShape) / 2, node.id, index);

      if (node.type === 'if' && node.thenLayout && node.elseLayout) {
        planIf(node, centerX);
      } else if (isLoopType(node.type) && node.bodyLayout) {
        planLoop(node, centerX);
      }

      cursor = node.bottom;
    });

    const tailTarget = parent ? `branch_end:${parent.id}:${parent.branch}` : 'main_end';
    // Inside a branch this wire is a plain stub: the caller closes the elbow
    // back onto the merge line, so only the main flow carries an arrowhead.
    push(`tail-${tailTarget}`, centerX, cursor, centerX, endY, !parent);
    pushInserter(`ins-tail-${tailTarget}`, centerX, (cursor + endY) / 2, tailTarget);
  };

  /**
   * IF wires. Both branches leave the diamond from its horizontal vertices and
   * come back onto the SAME merge row, where the main spine resumes. Each stub
   * carries the arrowhead that lands on the merge point.
   */
  const planIf = (node: LayoutNode, centerX: number) => {
    const elseLayout = node.elseLayout as ListLayout;
    const thenLayout = node.thenLayout as ListLayout;
    const leftX = node.leftX as number;
    const rightX = node.rightX as number;
    const row = node.y;
    const mergeRow = node.mergeY as number;

    // FALSE branch: out of the left vertex, down its own column, back to the spine
    push(`false-edge-${node.id}`, shapeEdgeX(node, 'left'), row, leftX, row);
    planList(elseLayout, leftX, row, mergeRow, { id: node.id, branch: 'else' });
    push(`false-merge-${node.id}`, leftX, mergeRow, centerX, mergeRow);

    // TRUE branch: out of the right vertex, down its own column, back to the spine
    push(`true-edge-${node.id}`, shapeEdgeX(node, 'right'), row, rightX, row);
    planList(thenLayout, rightX, row, mergeRow, { id: node.id, branch: 'then' });
    push(`true-merge-${node.id}`, rightX, mergeRow, centerX, mergeRow);

    // Both branch elbows meet at one merge point. The only arrival arrow is
    // on the single vertical continuation below the diamond; putting arrows on
    // both horizontal elbows made them fan across the merge and overlap other
    // branch content in deeply nested diagrams.
    push(`if-spine-${node.id}`, centerX, node.y + IF_H / 2, centerX, mergeRow, true);
  };

  /**
   * Loop wires. The body hangs on the right; the loop-back wire climbs the left
   * side and its arrowhead stops exactly on the left vertex of the header.
   */
  const planLoop = (node: LayoutNode, centerX: number) => {
    const bodyLayout = node.bodyLayout as ListLayout;
    const bodyX = node.bodyX as number;
    const returnX = node.returnX as number;
    const row = node.y;
    const mergeRow = node.mergeY as number;

    // Out of the right vertex into the body column
    push(`loop-edge-${node.id}`, shapeEdgeX(node, 'right'), row, bodyX, row);
    planList(bodyLayout, bodyX, row, mergeRow, { id: node.id, branch: 'body' });

    // Loop-back wire: body -> left -> up -> arrow onto the left vertex
    push(`loop-back-1-${node.id}`, bodyX, mergeRow, returnX, mergeRow);
    push(`loop-back-2-${node.id}`, returnX, mergeRow, returnX, row);
    push(`loop-back-3-${node.id}`, returnX, row, shapeEdgeX(node, 'left'), row, true);

    // Exit: the header drops to the merge row where the main flow continues
    push(`loop-exit-${node.id}`, centerX, row + LOOP_H / 2, centerX, mergeRow, true);
  };

  planList(diagram.listLayout, 0, diagram.flowStartY, diagram.flowEndY);

  return { segments, inserters };
}
