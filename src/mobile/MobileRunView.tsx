import React from 'react';
import { useFlow } from '../context/FlowContext';

/**
 * Mobile run view — big touch-friendly buttons: Run / Step / Pause / Stop,
 * plus execution-speed slider and status pill.
 */
export const MobileRunView: React.FC = () => {
  const {
    executionStatus,
    startRun,
    stepRun,
    pauseRun,
    stopRun,
    speed,
    setSpeed,
    statements,
  } = useFlow() as any;

  const status = (executionStatus as string) ?? 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isStarted = isRunning || isPaused;
  const hasStatements = Array.isArray(statements) && statements.length > 0;
  const speedValue = typeof speed === 'number' ? speed : 100;

  const statusClass =
    status === 'running' ? 'running' : status === 'paused' ? 'paused' : status === 'done' ? 'done' : '';
  const statusLabel =
    status === 'running'
      ? 'Running'
      : status === 'paused'
      ? 'Paused'
      : status === 'done'
      ? 'Done'
      : 'Ready';

  return (
    <div className="m-view">
      <div
        style={{
          padding: '16px 16px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span className={`m-pill ${statusClass}`} aria-label={`status: ${status}`}>
          ● {statusLabel}
        </span>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
          {speedValue}% speed
        </span>
      </div>

      <div className="m-action-grid">
        <button
          type="button"
          className="m-action run"
          disabled={!startRun || !hasStatements || isStarted}
          onClick={() => { if (startRun && !isStarted) startRun(); }}
          aria-label="Run flowchart"
        >
          <span style={{ fontSize: 34, lineHeight: 1 }}>▶</span>
          <span>Run</span>
        </button>
        <button
          type="button"
          className="m-action step"
          disabled={!stepRun || !hasStatements || isRunning}
          onClick={() => { if (stepRun && !isRunning) stepRun(); }}
          aria-label="Step through flowchart one block at a time"
        >
          <span style={{ fontSize: 34, lineHeight: 1 }}>⏭</span>
          <span>Step</span>
        </button>
        <button
          type="button"
          className="m-action pause"
          disabled={!pauseRun || !isRunning}
          onClick={() => { if (pauseRun && isRunning) pauseRun(); }}
          aria-label="Pause execution"
        >
          <span style={{ fontSize: 34, lineHeight: 1 }}>⏸</span>
          <span>Pause</span>
        </button>
        <button
          type="button"
          className="m-action stop"
          disabled={!stopRun || !isStarted}
          onClick={() => { if (stopRun && isStarted) stopRun(); }}
          aria-label="Stop execution"
        >
          <span style={{ fontSize: 34, lineHeight: 1 }}>⏹</span>
          <span>Stop</span>
        </button>
      </div>

      <div className="m-speed">
        <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Speed</span>
        <input
          type="range"
          min={1}
          max={600}
          value={speedValue}
          onChange={(e) => setSpeed && setSpeed(parseInt(e.target.value, 10))}
          aria-label="Execution speed"
        />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', minWidth: 44, textAlign: 'right' }}>
          {speedValue}%
        </span>
      </div>

      <div className="m-section-title">Notes</div>
      <div className="m-row subtitle" style={{ borderBottom: 'none' }}>
        Use <strong>Step</strong> for slow instruction-by-instruction debugging.
        Pause/Stop take effect immediately so they never block the main thread.
      </div>
    </div>
  );
};
