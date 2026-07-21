import React from 'react';
import { useFlow } from '../context/FlowContext';
import type { MobileTabId } from './MobileTabBar';

export interface MobileTopBarProps {
  view?: MobileTabId;
}

/**
 * Mobile-only top bar.
 * Renders brand + current view title + a save button + status pill.
 * Sticky, 56px tall, safe-area top inset.
 */
export const MobileTopBar: React.FC<MobileTopBarProps> = ({ view }) => {
  const { programTitle, executionStatus, speed, loadProgram, statements } = useFlow() as any;

  const VIEW_TITLES: Record<MobileTabId, string> = {
    canvas: 'Flowonline2',
    edit: 'Edit',
    run: 'Run',
    console: 'Console',
    tools: 'Tools',
  };

  const statusKey = (executionStatus as string) ?? 'idle';
  const statusClass =
    statusKey === 'running'
      ? 'running'
      : statusKey === 'paused'
      ? 'paused'
      : statusKey === 'done'
      ? 'done'
      : '';

  // Best-effort: detect hasStatements via try/catch on state
  const hasStatements = Array.isArray(statements) && statements.length > 0;

  const handleSave = () => {
    // Serialize current state to JSON and trigger a download (mobile-safe).
    try {
      const payload = {
        title: programTitle ?? 'Untitled',
        statements,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(programTitle || 'flowonline2').replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch {
      // ignore — state shape varies across versions
    }
  };

  return (
    <header className="m-topbar m-safe-top">
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: '#0f172a',
        }}
        aria-label="app title"
      >
        {VIEW_TITLES[view ?? 'canvas']}
        <span
          style={{
            fontWeight: 500,
            fontSize: 13,
            color: '#64748b',
            marginLeft: 6,
          }}
        >
          · {programTitle || 'Untitled'}
        </span>
      </div>

      <span
        className={`m-pill dot ${statusClass}`}
        aria-label={`execution status: ${statusKey}`}
        style={{ marginRight: 8 }}
      >
        {statusKey}
      </span>

      <button
        type="button"
        onClick={handleSave}
        disabled={!hasStatements}
        style={{
          background: '#2563eb',
          color: '#ffffff',
          border: 'none',
          padding: '8px 14px',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          cursor: hasStatements ? 'pointer' : 'not-allowed',
          opacity: hasStatements ? 1 : 0.4,
        }}
        aria-label="Save flowonline2 flowchart as JSON"
      >
        Save
      </button>
    </header>
  );
};
