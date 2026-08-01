import React from 'react';
import { useFlow } from '../context/FlowContext';
import { IconPlay, IconStep, IconPause, IconStop } from '../components/EmojiIcons';
import { StatusDot } from '../components/StatusDot';

/**
 * Mobile run view (Phase 3 rewrite).
 *
 * Layout (top → bottom):
 *   1. Status row — StatusDot for execution state + current speed %.
 *      The StatusDot honors the dot-on-hover pattern: at rest it's a tiny
 *      colored dot, hovering or tapping shows the human label.
 *   2. Action grid — 2×2 of colorful SVG-iconed buttons: Run / Step / Pause / Stop.
 *   3. Speed slider — sticky, granular 1–600%.
 *   4. Notes — explains when Pause/Stop take effect.
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

  const dotVariant =
    status === 'running'
      ? 'live'
      : status === 'paused'
      ? 'fallback'
      : status === 'done'
      ? 'done'
      : 'info';
  const dotLabel =
    status === 'running'
      ? 'Running'
      : status === 'paused'
      ? 'Paused'
      : status === 'done'
      ? 'Done — ready to clear console'
      : isStarted
      ? status
      : 'Ready';

  return (
    <div className="m-view" style={{ background: 'var(--m-bg)' }}>
      <div
        style={{
          padding: '14px 16px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <StatusDot variant={dotVariant as any} label={dotLabel} glow={status === 'running'} size={10} />
        <span className="m-caption">{speedValue}% speed</span>
      </div>

      <div className="m-action-grid">
        <button
          type="button"
          className="m-action run"
          disabled={!startRun || !hasStatements || isStarted}
          onClick={() => !isStarted && startRun && startRun()}
          aria-label="Run flowchart"
        >
          <span className="m-action__icon"><IconPlay size={28} /></span>
          <span>Run</span>
        </button>
        <button
          type="button"
          className="m-action step"
          disabled={!stepRun || !hasStatements || isRunning}
          onClick={() => !isRunning && stepRun && stepRun()}
          aria-label="Step one block at a time"
        >
          <span className="m-action__icon"><IconStep size={28} /></span>
          <span>Step</span>
        </button>
        <button
          type="button"
          className="m-action pause"
          disabled={!pauseRun || !isRunning}
          onClick={() => isRunning && pauseRun && pauseRun()}
          aria-label="Pause execution"
        >
          <span className="m-action__icon"><IconPause size={28} /></span>
          <span>Pause</span>
        </button>
        <button
          type="button"
          className="m-action stop"
          disabled={!stopRun || !isStarted}
          onClick={() => isStarted && stopRun && stopRun()}
          aria-label="Stop execution"
        >
          <span className="m-action__icon"><IconStop size={28} /></span>
          <span>Stop</span>
        </button>
      </div>

      <div className="m-speed" style={{ marginTop: 12 }}>
        <span className="m-h3">Speed</span>
        <input
          type="range"
          min={1}
          max={600}
          value={speedValue}
          onChange={(e) => setSpeed && setSpeed(parseInt(e.target.value, 10))}
          aria-label="Execution speed — 1% to 600%"
        />
        <span className="m-speed__value">{speedValue}%</span>
      </div>

      <div className="m-section" style={{ marginTop: 16 }}>
        <div className="m-section-title">Notes</div>
        <div className="m-row subtitle" style={{ borderBottom: 'none' }}>
          <span>
            Use <strong>Step</strong> for slow instruction-by-instruction debugging.
            Pause/Stop take effect immediately so they never block the main thread.
          </span>
        </div>
      </div>
    </div>
  );
};
