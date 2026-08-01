import React, { useEffect, useMemo, useState } from 'react';
import { MobileTopBar } from './MobileTopBar';
import { MobileTabBar, type MobileTabId } from './MobileTabBar';
import { MobileCanvasView } from './MobileCanvasView';
import { MobileEditView } from './MobileEditView';
import { MobileRunView } from './MobileRunView';
import { MobileConsoleView } from './MobileConsoleView';
import { MobileToolsView } from './MobileToolsView';
import { useFlow } from '../context/FlowContext';

const VIEW_STORAGE_KEY = 'flowonline2_mobile_view';
const RTL_LANGS = new Set<string>(['ar', 'he', 'fa']);

/**
 * Mobile orchestrator (Phase 3 rewrite).
 *
 * Responsibilities:
 *   1. Mount `.m-root` so the rest of the mobile CSS scopes cleanly.
 *   2. Restore the last tab the user was on (localStorage, validated).
 *   3. Render TopBar + active view + TabBar.
 *
 * Architecture invariants:
 *   - Never modifies the desktop bundle.
 *   - Never adds state to FlowContext.
 *   - `useFlow()` is consumed `as any` because Phase 3 deliberately avoids
 *     signing up the mobile bundle to the desktop TypeScript surface area.
 */
const MobileApp: React.FC = () => {
  // Check expected touch viewport; for a Phase 3 hardening pass we let
  // the desktop bundle degrade gracefully on touch desktops (rare).
  const { language } = useFlow() as any;
  const dir: 'ltr' | 'rtl' = RTL_LANGS.has(language) ? 'rtl' : 'ltr';

  const initialView = useMemo<MobileTabId>(() => {
    if (typeof window === 'undefined') return 'canvas';
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    const valid: MobileTabId[] = ['canvas', 'edit', 'run', 'console', 'tools'];
    return valid.includes(stored as MobileTabId) ? (stored as MobileTabId) : 'canvas';
  }, []);
  const [view, setView] = useState<MobileTabId>(initialView);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(VIEW_STORAGE_KEY, view);
  }, [view]);

  return (
    <div className="m-root" dir={dir} style={{ height: '100dvh', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <MobileTopBar view={view} />
      <main style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        {view === 'canvas' && <MobileCanvasView />}
        {view === 'edit' && <MobileEditView />}
        {view === 'run' && <MobileRunView />}
        {view === 'console' && <MobileConsoleView />}
        {view === 'tools' && <MobileToolsView />}
      </main>
      <MobileTabBar active={view} onChange={setView} />
    </div>
  );
};

export default MobileApp;
