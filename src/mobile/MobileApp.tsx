import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MobileTopBar } from './MobileTopBar';
import { MobileSidebar, type MobileViewId } from './MobileSidebar';
import { MobileCanvasView } from './MobileCanvasView';
import { MobileEditView } from './MobileEditView';
import { MobileRunView } from './MobileRunView';
import { MobileConsoleView } from './MobileConsoleView';
import { MobileToolsView } from './MobileToolsView';
import { MobileLanguageSheet } from './MobileLanguageSheet';
import { WinUIDialog } from '../components/WinUIDialog';
import { useFlow } from '../context/FlowContext';
import { translations as catalogs } from '../utils/translations';
import { FprgParser } from '../utils/fprgParser';
import { exportToPNG, exportToPDF } from '../utils/exportUtils';
import { IconInfo } from '../components/EmojiIcons';

const VIEW_STORAGE_KEY = 'flowonline2_mobile_view';
const RTL_LANGS = new Set<string>(['ar', 'he', 'fa']);

/**
 * Mobile orchestrator (Phase 5 + 5.1 sidebar-action wiring).
 *
 *  - Owns hidden file-input ref for .fprg loading.
 *  - Owns local state for About / Manual / Changelog / Language-picker
 *    dialogs. Each opens via `WinUIDialog` overlays rendered at the
 *    bottom of the JSX.
 *  - All sidebar action handlers are wired here (Path C: duplicate the
 *    desktop UI logic instead of lifting state to App.tsx — see the
 *    Phase-5 design note for the rationale).
 *  - Export functions (`exportToPNG`, `exportToPDF`) and the SVG export
 *    query `document.querySelector('svg.flowchart-canvas, svg[id*=flow]')`
 *    directly, no prop threading required by the export utils.
 */
const MobileApp: React.FC = () => {
  const flow = useFlow() as any;
  const dir: 'ltr' | 'rtl' = RTL_LANGS.has(flow.language) ? 'rtl' : 'ltr';

  const initialView = useMemo<MobileViewId>(() => {
    if (typeof window === 'undefined') return 'canvas';
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    const valid: MobileViewId[] = ['canvas', 'edit', 'run', 'console', 'tools'];
    return valid.includes(stored as MobileViewId) ? (stored as MobileViewId) : 'canvas';
  }, []);
  const [view, setView] = useState<MobileViewId>(initialView);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sidebar-opened dialog state (each opens a WinUIDialog overlay).
  const [showAbout, setShowAbout] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showLangSheet, setShowLangSheet] = useState(false);

  // Markdown lazy-load for Man/Changelog overlays.
  const [manualText, setManualText] = useState<string>('Loading user manual…');
  const [changelogText, setChangelogText] = useState<string>('Loading changelog…');

  // Hidden file input — referenced by `handleOpenFile`.
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(VIEW_STORAGE_KEY, view);
  }, [view]);

  useEffect(() => {
    if (!showManual) return;
    let cancelled = false;
    fetch('https://raw.githubusercontent.com/PiBOH/flowonline2/main/MANUAL.md')
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((txt) => { if (!cancelled) setManualText(txt); })
      .catch(() => { if (!cancelled) setManualText('Unable to load MANUAL.md from GitHub. Please check your connection.'); });
    return () => { cancelled = true; };
  }, [showManual]);

  useEffect(() => {
    if (!showChangelog) return;
    let cancelled = false;
    fetch('https://raw.githubusercontent.com/PiBOH/flowonline2/main/CHANGELOG.md')
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((txt) => { if (!cancelled) setChangelogText(txt); })
      .catch(() => { if (!cancelled) setChangelogText('Unable to load CHANGELOG.md from GitHub. Please check your connection.'); });
    return () => { cancelled = true; };
  }, [showChangelog]);

  // Localized dialog titles — read from the shared `translations` catalog.
  // `flow.language` is `any` (mobile deliberately opts out of full TS surface)
  // so we cast the catalog to `any` first; the resulting `c` is also `any`
  // which TypeScript allows indexing without further casts.
  const mt = useMemo<Record<string, string>>(() => {
    const cAny = catalogs as any;
    const c = cAny?.[flow.language] ?? cAny?.en ?? {};
    return {
      aboutTitle: c.aboutTitle ?? 'About Flowonline2',
      manualTitle: c.manualTitle ?? 'User Manual',
      changelogTitle: c.changelogTitle ?? 'Changelog',
    };
  }, [flow.language]);

  const safe = (fn: () => void) => { try { fn(); } catch { /* noop */ } };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const handleNew = () => safe(() => flow.clearAll?.());
  const handleClearLocalStorage = () =>
    safe(() => flow.clearLocalStorage?.({ alsoClearCurrentWork: true }));

  const handleOpenFile = () => {
    // Click the hidden file input — onChange is wired below.
    fileInputRef.current?.click();
  };

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      // .fprg is XML; .json is the backup format used by MobileTopBar.
      if (file.name.toLowerCase().endsWith('.json')) {
        const parsed = JSON.parse(text);
        safe(() => flow.loadProgram?.(parsed));
        return;
      }
      // Default: parse as Flowgorithm XML.
      safe(() => flow.loadProgram?.(FprgParser.parse(text)));
    } catch (err) {
      // Surface error via console (no WinUI error dialog — keep mobile simple).
      console.warn('[MobileApp] Open file failed:', err);
    }
  };

  const handleSave = () => {
    const statements = Array.isArray(flow.statements) ? flow.statements : [];
    const title = (flow.programTitle || 'Untitled Program') as string;
    const author = (flow.programAuthor ?? '') as string;
    safe(() => {
      const xml = FprgParser.serialize(statements, title, author);
      downloadBlob(new Blob([xml], { type: 'application/xml' }), `${title}.fprg`);
    });
  };

  const handleBackupJson = () => {
    const payload = {
      title: flow.programTitle ?? 'Untitled',
      statements: Array.isArray(flow.statements) ? flow.statements : [],
    };
    downloadBlob(
      new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
      `${(flow.programTitle || 'flowonline2').replace(/\s+/g, '_')}.json`,
    );
  };

  const handleExportSvg = () => {
    safe(() => {
      const svgEl = document.querySelector('svg.flowchart-canvas, [data-export-svg]') as SVGElement | null;
      if (!svgEl) return;
      const xml = new XMLSerializer().serializeToString(svgEl);
      downloadBlob(
        new Blob([xml], { type: 'image/svg+xml' }),
        `${(flow.programTitle || 'flowonline2').replace(/\s+/g, '_')}.svg`,
      );
    });
  };

  const handleExportPng = () => {
    safe(() => exportToPNG((flow.programTitle || 'flowonline2') as string));
  };

  const handleExportPdf = () => {
    safe(() => exportToPDF((flow.programTitle || 'flowonline2') as string));
  };

  const handleBugReport = () => {
    window.open('https://github.com/PiBOH/flowonline2/issues/new/choose', '_blank', 'noopener,noreferrer');
  };
  const handleFeatureRequest = () => {
    window.open('https://github.com/PiBOH/flowonline2/issues/new/choose', '_blank', 'noopener,noreferrer');
  };
  const handleForkContribute = () => {
    window.open('https://github.com/PiBOH/flowonline2/fork', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="m-root"
      dir={dir}
      style={{ height: '100dvh', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <MobileTopBar onOpenSidebar={() => setSidebarOpen(true)} />

      <main style={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        {view === 'canvas' && <MobileCanvasView />}
        {view === 'edit' && <MobileEditView />}
        {view === 'run' && <MobileRunView />}
        {view === 'console' && <MobileConsoleView />}
        {view === 'tools' && <MobileToolsView />}
      </main>

      {/* Hidden file input — driven by `handleOpenFile`. */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".fprg,.json,application/json,text/xml,application/xml"
        onChange={handleFileChosen}
        style={{ display: 'none' }}
        tabIndex={-1}
        aria-hidden="true"
      />

      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        view={view}
        onSelectView={setView}
        language={(flow.language as any) ?? 'en'}
        canUndo={!!flow.canUndo}
        canRedo={!!flow.canRedo}
        onNew={handleNew}
        onOpenFile={handleOpenFile}
        onSave={handleSave}
        onBackupJson={handleBackupJson}
        onExportSvg={handleExportSvg}
        onExportPng={handleExportPng}
        onExportPdf={handleExportPdf}
        onClearLocalStorage={handleClearLocalStorage}
        onShowAbout={() => setShowAbout(true)}
        onShowManual={() => setShowManual(true)}
        onShowChangelog={() => setShowChangelog(true)}
        onBugReport={handleBugReport}
        onFeatureRequest={handleFeatureRequest}
        onForkContribute={handleForkContribute}
        onPickLanguage={() => setShowLangSheet(true)}
      />

      {/* About overlay */}
      <WinUIDialog
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title={mt.aboutTitle || 'About Flowonline2'}
        message=""
        defaultWidth={420}
        defaultHeight={360}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 4px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconInfo size={36} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Flowonline2</div>
              <div style={{ fontSize: 12, color: '#475569' }}>
                {(import.meta as any).env?.VITE_APP_VERSION || '0.0.0-UNKNOWN'}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: '#1f2937' }}>
            A web replica of <strong>Flowgorithm</strong> for Windows, built in React + Vite. Licensed under the{' '}
            <strong>GNU GPL v3</strong>.
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Source:&nbsp;
            <a href="https://github.com/PiBOH/flowonline2" target="_blank" rel="noopener noreferrer">
              github.com/PiBOH/flowonline2
            </a>
          </div>
        </div>
      </WinUIDialog>

      {/* Manual overlay */}
      <WinUIDialog
        isOpen={showManual}
        onClose={() => setShowManual(false)}
        title={mt.manualTitle || 'Flowonline2 User Manual'}
        message=""
        defaultWidth={520}
        defaultHeight={460}
      >
        <pre style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '60vh',
          overflowY: 'auto',
          padding: '0 4px',
          color: '#1f2937',
        }}>
          {manualText}
        </pre>
      </WinUIDialog>

      {/* Changelog overlay */}
      <WinUIDialog
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
        title={mt.changelogTitle || 'Flowonline2 Changelog'}
        message=""
        defaultWidth={520}
        defaultHeight={460}
      >
        <pre style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '60vh',
          overflowY: 'auto',
          padding: '0 4px',
          color: '#1f2937',
        }}>
          {changelogText}
        </pre>
      </WinUIDialog>

      {/* Language picker sheet (the component reads language itself from useFlow). */}
      <MobileLanguageSheet
        open={showLangSheet}
        onClose={() => setShowLangSheet(false)}
      />

    </div>
  );
};

export default MobileApp;
