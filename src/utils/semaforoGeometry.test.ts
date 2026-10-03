import { describe, expect, it } from 'vitest';
import semaforoXml from '../../.fprg-files/ITA/SEMAFORO LOOP_V1.1a.fprg?raw';
import { FprgParser } from './fprgParser';
import { buildDiagram, computeConnectorPlan } from './flowchartLayout';

describe('SEMAFORO real geometry oracle', () => {
  it('keeps every connector inside the computed drawing bounds', () => {
    const parsed = FprgParser.parse(semaforoXml);
    const diagram = buildDiagram(parsed.statements);
    const plan = computeConnectorPlan(diagram);
    const xs = plan.segments.flatMap((wire) => [wire.x1, wire.x2]);
    const ys = plan.segments.flatMap((wire) => [wire.y1, wire.y2]);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(diagram.minX);
    expect(Math.max(...xs)).toBeLessThanOrEqual(diagram.maxX);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(diagram.height);
    expect(plan.segments.some((wire) => wire.id.startsWith('loop-back-3-'))).toBe(true);
    expect(plan.segments.some((wire) => wire.id.startsWith('loop-exit-') && wire.arrow)).toBe(false);
    expect(plan.segments.some((wire) => wire.id.startsWith('if-spine-') && wire.arrow)).toBe(false);
  });
});
