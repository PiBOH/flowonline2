import React, { useEffect, useMemo, useState } from 'react';
import { MobileTopBar } from './MobileTopBar';
import { MobileTabBar, type MobileTabId } from './MobileTabBar';
import { MobileCanvasView } from './MobileCanvasView';
import { MobileEditView } from './MobileEditView';
import { MobileRunView } from './MobileRunView';
import { MobileConsoleView } from './MobileConsoleView';
import { MobileToolsView } from './MobileToolsView';

const VIEW_STORAGE_KEY = 'flowonline2_mobile_view';

/**
 * Mobile orchestrator.
 *
 * Responsibilities:
 *   1. Load `mobile.css` lazily at mount (single-import side-effect).
 *   2. Pick initial view from localStorage so a returning user lands on
 *      the last tab they visited.
 *   3. Render TopBar + active view + TabBar.
 *
 * NOT responsible for viewport detection — App.tsx imports MobileApp
 * with React.lazy() and routes here only on <=767px.
 *
 * Long-press block context menu is intentionally DEMOTED to Phase 2.5
 * (currently no block-pick wiring; `MobileActionMenu` is unused in this
 * view to avoid the “menu opens but everything disabled” UX trap).
 */
const MobileApp: React.FC = () => {
  // Read initial view from localStorage only once via lazy initializer.
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
    <div className="mobile-app-root" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', minHeight: '100vh' }}>
      <MobileTopBar view={view} />
      <main
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          overflow: 'hidden',
          position: 'relative',
          background: '#ffffff',
        }}
      >
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
