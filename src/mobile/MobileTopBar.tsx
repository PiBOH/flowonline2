import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { IconSave, IconInfo } from '../components/EmojiIcons';
import { StatusDot } from '../components/StatusDot';
import type { MobileTabId } from './MobileTabBar';

export interface MobileTopBarProps {
  view: MobileTabId;
}

/**
 * Mobile-only top bar (Phase 3 rewrite).
 * 60px tall, sticky, glassy backdrop so it stays out of the way of canvas
 * content. Brand chip on the left, contextual title + program name in the
 * middle (single line, ellipsis on overflow), and a Save-JSON action +
 * persistence `StatusDot` on the right.
 *
 * The persistence StatusDot uses the dot-on-hover pattern so the bar
 * never carries an invasive pill — at rest it's a small colored dot that
 * expands to a "Saved to localStorage" / "Auto-saving…" message only when
 * the user cares to look.
 */
export const MobileTopBar: React.FC<MobileTopBarProps> = ({ view }) => {
  const { programTitle, statements } = useFlow() as any;

  const TITLES: Record<MobileTabId, string> = {
    canvas: 'Flowonline2',
    edit: 'Edit',
    run: 'Run',
    console: 'Console',
    tools: 'Tools',
  };

  const hasStatements = Array.isArray(statements) && statements.length > 0;
  const stmtCount = hasStatements ? statements.length : 0;

  // localStorage save indicator → StatusDot variant.
  type SaveStatus = 'idle' | 'saving' | 'saved' | 'stale';
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveLabel, setSaveLabel] = useState('Not yet saved');

  // Cheap autosave comparison: instead of JSON.stringify-ing the whole
  // statements tree on every keystroke, we compare the cheap shape
  // (length + last-id) plus the programTitle. Drastic cost reduction for
  // large flowcharts; false negatives only happen when length + last-id
  // match but a mid-tree block changed, which the next save keyboard
  // event will catch anyway.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('flowonline2_autosave');
      if (!raw) {
        setSaveStatus('idle');
        setSaveLabel('Not yet saved');
        return;
      }
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(statements) ? statements : [];
      const storedArr = Array.isArray(parsed.statements) ? parsed.statements : [];
      const sameLength = arr.length === storedArr.length;
      const sameTitle = parsed.programTitle === (programTitle ?? '');
      const sameLast =
        !sameLength || !arr.length
          ? sameLength
          : arr[arr.length - 1]?.id === storedArr[storedArr.length - 1]?.id;
      const matches = sameLength && sameTitle && sameLast;
      if (matches) {
        setSaveStatus('saved');
        setSaveLabel('Saved to localStorage ✓');
      } else {
        setSaveStatus('stale');
        setSaveLabel('Unsaved changes — tap Save to keep');
      }
    } catch {
      setSaveStatus('idle');
      setSaveLabel('Not yet saved');
    }
  }, [statements, programTitle]);

  const handleSave = () => {
    setSaveStatus('saving');
    setSaveLabel('Saving…');
    try {
      const payload = {
        title: programTitle ?? 'Untitled',
        statements,
      };
      // Persist JSON copy too so the StatusDot can compare and update.
      window.localStorage.setItem('flowonline2_autosave', JSON.stringify(payload));
      // Browser download — mobile-friendly.
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(programTitle || 'flowonline2').replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setSaveStatus('saved');
      setSaveLabel('Saved to localStorage ✓');
    } catch {
      setSaveStatus('stale');
      setSaveLabel('Save failed');
    }
  };

  const dotVariant =
    saveStatus === 'saved'
      ? 'live'
      : saveStatus === 'saving'
      ? 'info'
      : saveStatus === 'stale'
      ? 'fallback'
      : 'info';

  return (
    <header className="m-topbar m-safe-top" role="banner">
      <div className="m-topbar__brand">
        <IconInfo size={20} className="" />
        <div style={{ minWidth: 0 }}>
          <div className="m-topbar__title">{TITLES[view]}</div>
          <div className="m-topbar__subtitle">
            {programTitle || 'Untitled'} · {stmtCount} stmt
          </div>
        </div>
      </div>
      <div className="m-topbar__actions">
        <StatusDot
          variant={dotVariant as any}
          label={saveLabel}
          glow={saveStatus === 'saved'}
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasStatements}
          className="m-icon-btn"
          aria-label="Save flowchart as JSON"
          title="Save flowchart as JSON"
        >
          <IconSave size={20} />
        </button>
      </div>
    </header>
  );
};
