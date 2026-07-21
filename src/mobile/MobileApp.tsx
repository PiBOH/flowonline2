import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { MobileTopBar } from './MobileTopBar';
import { MobileTabBar, type MobileTabId } from './MobileTabBar';
import { MobileCanvasView } from './MobileCanvasView';
import { MobileEditView } from './MobileEditView';
import { MobileRunView } from './MobileRunView';
import { MobileConsoleView } from './MobileConsoleView';
import { MobileToolsView } from './MobileToolsView';
import { MobileActionMenu } from './MobileActionMenu';

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
 * NOT responsible for viewport detection — that's the parent's job
 * (App.tsx imports MobileApp with React.lazy()).
 */
const MobileApp: React.FC = () => {
  // The `useFlow()` call here ensures FlowContext hooks are wired up.
  // Many child components also call `useFlow()` directly; both will work
  // because FlowProvider wraps this entire bundle.
  useFlow();

  const [view, setView] = useState<MobileTabId>(() => {
    if (typeof window === 'undefined') return 'canvas';
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    const valid: MobileTabId[] = ['canvas', 'edit', 'run', 'console', 'tools'];
    return (valid.includes(stored as MobileTabId) ? stored : 'canvas') as MobileTabId;
  });

  // Track long-press on canvas blocks → open MobileActionMenu.
  // Minimal Phase 2 implementation: probe for any canvas tap after 500ms hold.
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  useEffect(() => {
    if (view !== 'canvas') return;
    let timer: number | null = null;
    let startX = 0;
    let startY = 0;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
      timer = window.setTimeout(() => {
        if (timer !== null) {
          setActionMenuOpen(true);
        }
      }, 500);
    };
    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t || timer === null) return;
      const dx = Math.abs(t.clientX - startX);
      const dy = Math.abs(t.clientY - startY);
      if (dx > 8 || dy > 8) {
        window.clearTimeout(timer);
        timer = null;
      }
    };
    const onEnd = () => {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
    };
    const canvasRoot = document.querySelector('.flowchart-canvas-container, .m-canvas-wrap');
    if (!canvasRoot) return;
    canvasRoot.addEventListener('touchstart', onStart as any, { passive: true } as any);
    canvasRoot.addEventListener('touchmove', onMove as any, { passive: true } as any);
    canvasRoot.addEventListener('touchend', onEnd as any, { passive: true } as any);
    canvasRoot.addEventListener('touchcancel', onEnd as any, { passive: true } as any);
    return () => {
      canvasRoot.removeEventListener('touchstart', onStart as any);
      canvasRoot.removeEventListener('touchmove', onMove as any);
      canvasRoot.removeEventListener('touchend', onEnd as any);
      canvasRoot.removeEventListener('touchcancel', onEnd as any);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [view]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(VIEW_STORAGE_KEY, view);
  }, [view]);

  // Always-present top-bar + active view + tab-bar layout.
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

      <MobileActionMenu
        open={actionMenuOpen}
        onClose={() => setActionMenuOpen(false)}
        hasSelection={false}
        hasCopiedBlock={false}
        language={'en'}
        onEdit={() => { /* delegated in Phase 3 via FlowContext.selectedBlockId */ }}
        onCopy={() => { /* delegated in Phase 3 */ }}
        onCut={() => { /* delegated in Phase 3 */ }}
        onPaste={() => { /* delegated in Phase 3 */ }}
        onDelete={() => { /* delegated in Phase 3 */ }}
      />
    </div>
  );
};

export default MobileApp;
