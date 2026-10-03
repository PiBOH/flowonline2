import { describe, it, expect } from 'vitest';
import { Statement } from '../types/flow';
import {
  buildDiagram,
  ListLayout,
  NODE_H,
  NODE_W,
  V_GAP,
  MAIN_H,
  IF_H,
  IF_W,
  LOOP_H,
  LOOP_W,
  BRANCH_STUB,
  computeConnectorPlan,
  countControlStatements,
  loopTrueClearance
} from './flowchartLayout';

let counter = 0;
const id = () => `n${++counter}`;

const declare = (name = 'x'): Statement => ({
  id: id(),
  type: 'declare',
  variableName: name,
  variableType: 'Integer',
  isArray: false,
  arraySize: ''
});

const output = (): Statement => ({ id: id(), type: 'output', expression: '"hi"', newline: true });

const ifStmt = (thenBranch: Statement[], elseBranch: Statement[]): Statement => ({
  id: id(),
  type: 'if',
  condition: 'x > 0',
  thenBranch,
  elseBranch
});

const whileStmt = (body: Statement[]): Statement => ({
  id: id(),
  type: 'while',
  condition: 'x < 10',
  body
});

/**
 * Walks the whole tree the same way the renderer does and asserts the
 * invariants that used to be violated (backwards connectors, elbows landing
 * on the wrong row, branches overlapping the main spine...).
 */
function checkInvariants(layout: ListLayout, startY: number, endY: number): void {
  let cursor = startY;

  for (const node of layout.nodes) {
    // The incoming arrow must never be drawn backwards
    expect(node.top).toBeGreaterThanOrEqual(cursor);
    expect(node.bottom).toBeGreaterThanOrEqual(node.top);
    // Exactly one source of truth: the merge line IS where the flow leaves
    if (node.type === 'if') {
      expect(node.mergeY).toBe(node.bottom);
      expect(node.leftX!).toBeLessThan(node.x);
      expect(node.rightX!).toBeGreaterThan(node.x);
      expect(node.childTop).toBe(node.y + V_GAP / 2);
      // The diamond must not overlap its own branch content
      for (const child of [...node.elseLayout!.nodes, ...node.thenLayout!.nodes]) {
        expect(child.top).toBeGreaterThanOrEqual(node.y);
      }
      checkInvariants(node.elseLayout!, node.y, node.bottom);
      checkInvariants(node.thenLayout!, node.y, node.bottom);
    } else if (node.type === 'while' || node.type === 'for' || node.type === 'do') {
      expect(node.mergeY).toBe(node.bottom);
      expect(node.returnX!).toBeLessThan(node.x);
      expect(node.bodyX!).toBeGreaterThan(node.x);
      expect(node.childTop).toBe(node.y + V_GAP / 2);
      checkInvariants(node.bodyLayout!, node.y, node.bottom);
    }

    cursor = node.bottom;
  }

  // The list must always deliver the flow at (or before) the requested row
  expect(endY).toBeGreaterThanOrEqual(cursor);
}

describe('flowchartLayout / buildDiagram', () => {
  it('handles an empty program', () => {
    const d = buildDiagram([]);
    expect(d.listLayout.nodes).toHaveLength(0);
    expect(d.listLayout.height).toBe(0);
    expect(d.flowStartY).toBe(MAIN_H);
    // start oval -> one full connector -> end oval
    expect(d.flowEndY - d.flowStartY).toBe(V_GAP + V_GAP);
    expect(d.endOvalY).toBe(d.flowEndY + MAIN_H / 2);
    checkInvariants(d.listLayout, d.flowStartY, d.flowEndY);
  });

  it('stacks plain statements V_GAP apart', () => {
    const d = buildDiagram([declare(), declare('y'), output()]);
    const [a, b, c] = d.listLayout.nodes;

    expect(a.top).toBe(MAIN_H + V_GAP);
    expect(b.top - a.bottom).toBe(V_GAP);
    expect(c.top - b.bottom).toBe(V_GAP);
    expect(a.bottom - a.top).toBe(NODE_H);
    expect(d.listLayout.height).toBe(3 * NODE_H + 2 * V_GAP);
    checkInvariants(d.listLayout, d.flowStartY, d.flowEndY);
  });

  it('centres the spine and keeps the drawing inside the canvas bounds', () => {
    const d = buildDiagram([declare(), output()]);
    for (const node of d.listLayout.nodes) expect(node.x).toBe(0);
    expect(d.minX).toBeLessThan(0);
    expect(d.maxX).toBeGreaterThan(0);
    // symmetric drawing => symmetric padding around the spine
    expect(d.minX).toBe(-d.maxX);
  });

  it('routes both IF branches to the same merge line', () => {
    const d = buildDiagram([ifStmt([output(), output()], [declare('a')])]);
    const node = d.listLayout.nodes[0];

    // Geometry of the diamond matches the SVG shape
    expect(node.top).toBe(MAIN_H + V_GAP);
    expect(node.y).toBe(node.top + IF_H / 2);
    expect(node.bottom - node.top).toBe(
      IF_H / 2 + V_GAP / 2 + 2 * NODE_H + V_GAP + V_GAP / 2
    );

    // Children start one half gap below the branch-out line
    expect(node.childTop).toBe(node.y + V_GAP / 2);
    expect(node.elseLayout!.nodes[0].top).toBe(node.childTop);
    expect(node.thenLayout!.nodes[0].top).toBe(node.childTop);

    // ...and the merge line is right below the tallest branch
    expect(node.mergeY).toBe(node.bottom);
    expect(node.mergeY).toBe(node.thenLayout!.nodes[1].bottom + V_GAP / 2);

    // Branch columns are pushed out by the stub, never on the spine
    expect(node.elseLayout!.nodes[0].x).toBeLessThan(0);
    expect(node.thenLayout!.nodes[0].x).toBeGreaterThan(0);
    expect(node.leftX).toBe(-(IF_W / 2 + BRANCH_STUB + NODE_W / 2));
    expect(node.rightX).toBe(-node.leftX!);
    checkInvariants(d.listLayout, d.flowStartY, d.flowEndY);
  });

  it('keeps empty IF branches as simple elbows', () => {
    const d = buildDiagram([ifStmt([], [])]);
    const node = d.listLayout.nodes[0];

    expect(node.elseLayout!.nodes).toHaveLength(0);
    expect(node.thenLayout!.nodes).toHaveLength(0);
    // Empty branches do not reserve a phantom node-width column: their
    // elbows stay close to the diamond, like Flowgorithm's layout.
    expect(node.elseLayout!.width).toBe(0);
    expect(node.thenLayout!.width).toBe(0);
    expect(node.leftX).toBe(-(IF_W / 2 + BRANCH_STUB));
    expect(node.rightX).toBe(IF_W / 2 + BRANCH_STUB);
    // Both elbows still land on the merge line, which is where the flow resumes
    expect(node.mergeY).toBe(node.y + V_GAP);
    expect(node.bottom).toBe(node.mergeY);
    checkInvariants(d.listLayout, d.flowStartY, d.flowEndY);
  });

  it('continues the main spine from the IF merge line', () => {
    const d = buildDiagram([ifStmt([output()], []), output()]);
    const [first, second] = d.listLayout.nodes;

    expect(first.type).toBe('if');
    // The statement after the IF starts exactly V_GAP below the merge line
    expect(second.top).toBe(first.mergeY! + V_GAP);
    checkInvariants(d.listLayout, d.flowStartY, d.flowEndY);
  });

  it('hides nested IFs inside their branch column', () => {
    const nested = ifStmt([output()], [output()]);
    const d = buildDiagram([ifStmt([nested], [output()])]);
    const outer = d.listLayout.nodes[0];
    const inner = outer.thenLayout!.nodes[0];

    expect(inner.type).toBe('if');
    // The nested diamond sits on its own branch column, not on the main spine
    expect(inner.x).toBe(outer.thenLayout!.nodes[0].x);
    expect(inner.x).not.toBe(outer.x);
    // ...and it merges back inside its own branch before rejoining the outer line
    expect(inner.bottom).toBeLessThanOrEqual(outer.mergeY!);
    checkInvariants(d.listLayout, d.flowStartY, d.flowEndY);
  });

  it('places the loop body on the right and the return wire on the left', () => {
    const d = buildDiagram([whileStmt([output(), output()])]);
    const node = d.listLayout.nodes[0];

    expect(node.bodyLayout!.nodes[0].top).toBe(node.y + V_GAP / 2);
    expect(node.bodyLayout!.nodes[0].x).toBeGreaterThan(node.x);
    expect(node.returnX).toBe(-(LOOP_W / 2 + BRANCH_STUB));
    // The flow resumes from the merge line, below everything
    expect(node.mergeY).toBe(node.bodyLayout!.nodes[1].bottom + V_GAP / 2);
    expect(node.bottom).toBe(node.mergeY);
    expect(node.bottom).toBeGreaterThan(node.y + LOOP_H / 2);
    checkInvariants(d.listLayout, d.flowStartY, d.flowEndY);
  });

  it('handles an empty loop body', () => {
    const d = buildDiagram([whileStmt([])]);
    const node = d.listLayout.nodes[0];

    expect(node.mergeY).toBe(node.y + V_GAP);
    checkInvariants(d.listLayout, d.flowStartY, d.flowEndY);
  });

  it('never produces a backwards connector on deeply nested programs', () => {
    const program: Statement[] = [
      declare('i'),
      ifStmt(
        [whileStmt([output(), ifStmt([output()], [output()])]), output()],
        [ifStmt([], [output(), output()])]
      ),
      output(),
      whileStmt([ifStmt([output()], [])]),
      output()
    ];
    const d = buildDiagram(program);
    checkInvariants(d.listLayout, d.flowStartY, d.flowEndY);
    expect(d.listLayout.height).toBeGreaterThan(0);
  });
});


describe('loop TRUE clearance', () => {
  it('adds 100px for every nested IF or loop recursively', () => {
    const nested = ifStmt([whileStmt([ifStmt([output()], [])])], [output()]);
    expect(countControlStatements([nested])).toBe(3);
    const d = buildDiagram([whileStmt([nested])]);
    const body = d.listLayout.nodes[0].bodyLayout!;
    expect(loopTrueClearance(body)).toBe(140 + 3 * 100);
  });
});

describe('connector plan / geometry oracle', () => {
  it('contains only forward incoming arrows and exact shape endpoints', () => {
    const d = buildDiagram([ifStmt([output()], [whileStmt([output()])]), output()]);
    const plan = computeConnectorPlan(d);
    expect(plan.segments.length).toBeGreaterThan(10);

    for (const wire of plan.segments) {
      // Vertical flow must never run backwards. Horizontal elbows are allowed
      // to point either way, but their endpoints must remain finite numbers.
      expect(Number.isFinite(wire.x1)).toBe(true);
      expect(Number.isFinite(wire.y1)).toBe(true);
      expect(Number.isFinite(wire.x2)).toBe(true);
      expect(Number.isFinite(wire.y2)).toBe(true);
      if (wire.x1 === wire.x2 && wire.id.startsWith('in-')) {
        expect(wire.y2).toBeGreaterThanOrEqual(wire.y1);
      }
    }

    const ifNode = d.listLayout.nodes[0];
    const incoming = plan.segments.find((wire) => wire.id === `in-${ifNode.id}`)!;
    expect(incoming.arrow).toBe(true);
    expect(incoming.x2).toBe(ifNode.x);
    expect(incoming.y2).toBe(ifNode.top);
    expect(plan.segments.find((wire) => wire.id === `false-merge-${ifNode.id}`)?.arrow).toBeFalsy();
    expect(plan.segments.find((wire) => wire.id === `true-merge-${ifNode.id}`)?.arrow).toBeFalsy();
    expect(plan.segments.find((wire) => wire.id === `if-spine-${ifNode.id}`)).toBeUndefined();
  });

  it('starts the post-merge arrow at the merge row, not below the shape', () => {
    const d = buildDiagram([ifStmt([output()], []), output(), whileStmt([output()]), output()]);
    const plan = computeConnectorPlan(d);
    const first = d.listLayout.nodes[0];
    const second = d.listLayout.nodes[1];
    const afterIf = plan.segments.find((wire) => wire.id === `in-${second.id}`)!;
    expect(afterIf.arrow).toBe(true);
    expect(afterIf.y1).toBe(first.bottom);
    expect(plan.segments.find((wire) => wire.id === `if-spine-${first.id}`)).toBeUndefined();

    const loop = d.listLayout.nodes[2];
    expect(plan.segments.find((wire) => wire.id === `loop-true-return-${loop.id}`)?.arrow).toBe(true);
    expect(plan.segments.find((wire) => wire.id === `loop-false-merge-${loop.id}`)?.arrow).toBeFalsy();
    expect(plan.segments.find((wire) => wire.id === `in-${d.listLayout.nodes[3].id}`)?.y1).toBe(loop.bottom);
  });

  it('uses the real FOR and WHILE outline edges for loop arrows', () => {
    const d = buildDiagram([{ id: id(), type: 'for', variableName: 'i', startValue: '1', endValue: '3', direction: 'inc', stepValue: '1', body: [output()] }]);
    const node = d.listLayout.nodes[0];
    const plan = computeConnectorPlan(d);
    const back = plan.segments.find((wire) => wire.id === `loop-true-return-${node.id}`)!;
    expect(back.arrow).toBe(true);
    expect(back.x1).toBe(node.x);
    expect(back.x2).toBe(node.x);
    expect(back.y2).toBe(node.y + 25);
  });
});
