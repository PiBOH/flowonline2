import React from 'react';
import { useFlow } from '../context/FlowContext';
import { IconPlay, IconStep, IconPause, IconStop } from '../components/EmojiIcons';

export interface MobileTopBarProps {
  /**
   * Called when the user taps the hamburger button.
   * Parent (MobileApp) opens the sidebar drawer.
   */
  onOpenSidebar: () => void;
}

/**
 * Mobile-only top bar (Phase 5 — slim execution bar).
 *
 * ONE row, fixed height, glassy backdrop. The layout is intentionally
 * minimal so the user has the smallest possible surface to mis-tap:
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │ [☰]                 [▶ Run] [⏭ Step] [⏸ Pause] [⏹ Stop] │
 *   └──────────────────────────────────────────────────┘
 *
 * The hamburger on the LEFT opens the sidebar drawer (all file/edit/
 * tools/help options live there). The execution buttons on the RIGHT
 * are functional from ANY view — the user doesn't have to switch to
 * the Run tab first to start the algorithm.
 *
 * Architecture invariants:
 *   - Never reads/writes localStorage (sidebar handles autosave/save).
 *   - Never shows the brand chip / program title (sidebar handles it).
 *   - Reads only `executionStatus`, `startRun`, `stepRun`, `pauseRun`,
 *     `stopRun` from `useFlow()` so it stays cheap.
 */
export const MobileTopBar: React.FC<MobileTopBarProps> = ({ onOpenSidebar }) => {
  const { executionStatus, startRun, stepRun, pauseRun, stopRun } = useFlow() as any;

  // Normalize status — tolerate both `'running'` and `'running' | 'paused' | ...`.
  const status: string = typeof executionStatus === 'string' ? executionStatus : 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';

  // Safe wrappers so a thrown start/step/pause/stop never crashes the UI.
  const safeRun = () => {
    if (isRunning) return;
    try { (startRun as any)?.(); } catch { /* noop */ }
  };
  const safeStep = () => {
    if (isRunning) return;
    try { (stepRun as any)?.(); } catch { /* noop */ }
  };
  const safePause = () => {
    if (!isRunning) return;
    try { (pauseRun as any)?.(); } catch { /* noop */ }
  };
  const safeStop = () => {
    if (!isRunning && !isPaused) return;
    try { (stopRun as any)?.(); } catch { /* noop */ }
  };

  return (
    <header className="m-topbar m-safe-top" role="banner">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="m-icon-btn m-icon-btn--menu"
        aria-label="Open menu"
        title="Menu"
      >
        {/* Inline 3-line hamburger SVG (zero-dep, identical across browsers). */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
      </button>

      <div className="m-topbar__actions" role="toolbar" aria-label="Execution controls">
        <button
          type="button"
          onClick={safeRun}
          disabled={isRunning}
          className="m-icon-btn"
          aria-label="Run"
          title="Run"
        >
          <IconPlay size={20} />
        </button>
        <button
          type="button"
          onClick={safeStep}
          disabled={isRunning}
          className="m-icon-btn"
          aria-label="Step"
          title="Step"
        >
          <IconStep size={20} />
        </button>
        <button
          type="button"
          onClick={safePause}
          disabled={!isRunning}
          className="m-icon-btn"
          aria-label="Pause"
          title="Pause"
        >
          <IconPause size={20} />
        </button>
        <button
          type="button"
          onClick={safeStop}
          disabled={!isRunning && !isPaused}
          className="m-icon-btn"
          aria-label="Stop"
          title="Stop"
        >
          <IconStop size={20} />
        </button>
      </div>
    </header>
  );
};
