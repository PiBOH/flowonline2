import React from 'react';
import { useFlow } from '../context/FlowContext';
import { IconPlay, IconStep, IconPause, IconStop } from '../components/EmojiIcons';

export const MobileRunView: React.FC = () => {
  const { executionStatus, startRun, stepRun, pauseRun, stopRun, speed, setSpeed, statements } = useFlow();
  const status = executionStatus || 'idle';
  const active = ['running', 'paused', 'input_pause'].includes(status);
  const hasBlocks = Array.isArray(statements) && statements.length > 0;
  const speedValue = typeof speed === 'number' ? speed : 100;
  return (
    <section className="m2-view m2-scroll" aria-label="Run flowchart">
      <div className="m2-card"><div className="m2-card__title">Execution status</div><div className="m2-list-item"><span className={`m2-status ${status === 'running' ? 'is-running' : ''}`} /><span className="m2-list-item__label">{status === 'idle' ? 'Ready' : status}</span><span className="m2-list-item__secondary">{speedValue}% speed</span></div></div>
      <div className="m2-action-grid">
        <button type="button" className="m2-action-card m2-action-card--run" disabled={!hasBlocks || active} onClick={() => startRun?.()}><IconPlay size={28} /><span>Run</span></button>
        <button type="button" className="m2-action-card" disabled={!hasBlocks || status === 'running'} onClick={() => stepRun?.()}><IconStep size={28} /><span>Step</span></button>
        <button type="button" className="m2-action-card m2-action-card--pause" disabled={status !== 'running'} onClick={() => pauseRun?.()}><IconPause size={28} /><span>Pause</span></button>
        <button type="button" className="m2-action-card m2-action-card--stop" disabled={!active} onClick={() => stopRun?.()}><IconStop size={28} /><span>Stop</span></button>
      </div>
      <div className="m2-speed"><label htmlFor="m2-speed">Speed</label><input id="m2-speed" type="range" min="1" max="100" value={speedValue} onChange={(event) => setSpeed?.(Number(event.target.value))} /><span className="m2-speed__value">{speedValue}%</span></div>
      <div className="m2-card"><div className="m2-card__title">How it works</div><div style={{ padding: '8px 16px 16px', color: 'var(--m2-muted)' }}>Use Step for instruction-by-instruction debugging. Pause and Stop remain available while the program is running.</div></div>
    </section>
  );
};
