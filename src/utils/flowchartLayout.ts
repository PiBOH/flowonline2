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
export const NODE_W = 180; // declare/assign/call rectangles:  x=-90 → 180
export const NODE_H = 50;
export const MAIN_H = 40; // start/end ovals: y=-19 → 38 (+2 stroke)
export const IF_W = 160; // diamond:  "0,-32 80,0 0,32 -80,0"
export const IF_H = 64;
export const LOOP_W = 160; // hexagon:  "-65,-25 65,-25 80,0 65,25 -65,25 -80,0"
export const LOOP_H = 50;

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

export const shapeHalfW = (t: string): number =>
  t === 'if' ? IF_W / 2 : isLoopType(t) ? LOOP_W / 2 : NODE_W / 2;

export const shapeHalfH = (t: string): number =>
  t === 'if' ? IF_H / 2 : isLoopType(t) ? LOOP_H / 2 : NODE_H / 2;

/**
 * MEASURE PASS — bottom-up. Computes the bounding size of every statement,
 * including the vertical space taken by its nested branches.
 */
export function computeListLayout(list: Statement[]): ListLayout {
  const nodes: LayoutNode[] = [];
  let currentY = 0;
  let maxWidth = NODE_W;

  for (const stmt of list) {
    let width = NODE_W;
    let height = NODE_H;
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
      width = LOOP_W + 2 * BRANCH_STUB + bodyLayout.width;
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
      node.bodyX = centerX + LOOP_W / 2 + BRANCH_STUB + node.bodyLayout.width / 2;
      node.returnX = centerX - (LOOP_W / 2 + BRANCH_STUB);
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
    const halfW = shapeHalfW(node.type);
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
