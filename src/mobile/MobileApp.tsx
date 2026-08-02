import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MobileTopBar } from './MobileTopBar';
import { MobileSidebar, type MobileViewId } from './MobileSidebar';
import { MobileCanvasView, MobileExportSvg } from './MobileCanvasView';
import { MobileBlockEditor } from './MobileBlockEditor';
import { MobileEditView } from './MobileEditView';
import { MobileRunView } from './MobileRunView';
import { MobileConsoleView } from './MobileConsoleView';
import { MobileToolsView } from './MobileToolsView';
import { MobileLanguageSheet } from './MobileLanguageSheet';
import { M2BottomNav, M2Button, M2Dialog, M2Snackbar } from './Material2';
import { useFlow } from '../context/FlowContext';
import { FprgParser } from '../utils/fprgParser';
import { exportToPNG, exportToPDF } from '../utils/exportUtils';
import { IconChart, IconPencil, IconPlay, IconChatBubble, IconTools, IconInfo } from '../components/EmojiIcons';

const VIEW_KEY = 'flowonline2_mobile_view';
const VALID_VIEWS: MobileViewId[] = ['canvas', 'edit', 'run', 'console', 'tools'];
const RTL_LANGS = new Set(['ar', 'he', 'fa']);
const ISSUE_URL = 'https://github.com/PiBOH/flowonline2/issues/new/choose';

const MobileApp: React.FC = () => {
  const flow = useFlow();
  const dir = RTL_LANGS.has(flow.language) ? 'rtl' : 'ltr';
  const initialView = useMemo<MobileViewId>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(VIEW_KEY) : null;
    return VALID_VIEWS.includes(stored as MobileViewId) ? stored as MobileViewId : 'canvas';
  }, []);
  const [view, setView] = useState<MobileViewId>(initialView);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [dialog, setDialog] = useState<'about' | 'manual' | 'changelog' | 'clear' | null>(null);
  const [manual, setManual] = useState('Loading MANUAL.md...');
  const [changelog, setChangelog] = useState('Loading CHANGELOG.md...');
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'error' } | null>(null);
  const [clearCurrentWork, setClearCurrentWork] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.localStorage.setItem(VIEW_KEY, view);
  }, [view]);

  useEffect(() => {
    if (dialog !== 'manual' && dialog !== 'changelog') return;
    const controller = new AbortController();
    const path = dialog === 'manual' ? './MANUAL.md' : './CHANGELOG.md';
    fetch(path, { signal: controller.signal })
      .then((response) => response.ok ? response.text() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((text) => dialog === 'manual' ? setManual(text) : setChangelog(text))
      .catch((error: unknown) => {
        if ((error as Error).name === 'AbortError') return;
        if (dialog === 'manual') setManual('Unable to load MANUAL.md.');
        else setChangelog('Unable to load CHANGELOG.md.');
      });
    return () => controller.abort();
  }, [dialog]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [message]);

  const download = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  };

  const title = String(flow.programTitle || 'flowonline2').replace(/\s+/g, '_');
  const openExternal = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  const handleSave = () => {
    try {
      const xml = FprgParser.serialize(flow.statements, flow.programTitle || 'Untitled Program', flow.programAuthor || '');
      download(new Blob([xml], { type: 'application/xml' }), `${title}.fprg`);
      setMessage({ text: 'FPRG file saved.', tone: 'success' });
    } catch {
      setMessage({ text: 'Unable to save the FPRG file.', tone: 'error' });
    }
  };

  const handleBackup = () => {
    const backup = { title: flow.programTitle || 'Untitled Program', author: flow.programAuthor || '', statements: flow.statements };
    download(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }), `${title}.json`);
    setMessage({ text: 'JSON backup saved.', tone: 'success' });
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      if (file.name.toLowerCase().endsWith('.json')) {
        const data: unknown = JSON.parse(text);
        if (!data || typeof data !== 'object' || !Array.isArray((data as { statements?: unknown }).statements)) {
          throw new Error('Invalid JSON backup.');
        }
        const backup = data as { statements: Parameters<typeof flow.loadProgram>[0]; title?: string; author?: string };
        flow.loadProgram(backup.statements, backup.title || 'Untitled Program', backup.author || '');
      } else {
        const parsed = FprgParser.parse(text);
        flow.loadProgram(parsed.statements, parsed.title || file.name.replace(/\.fprg$/i, ''), parsed.author || '');
      }
      setMessage({ text: 'File opened.', tone: 'success' });
    } catch {
      setMessage({ text: 'Unable to open that file.', tone: 'error' });
    }
  };

  const handleSvg = () => {
    const svg = document.getElementById('flowchart-svg-export-target') || document.getElementById('mobile-svg-export-target');
    if (!svg) {
      setMessage({ text: 'No flowchart is available to export.', tone: 'error' });
      return;
    }
    download(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }), `${title}.svg`);
    setMessage({ text: 'SVG exported.', tone: 'success' });
  };

  const handlePng = async () => {
    const result = await exportToPNG(title);
    setMessage({ text: result.message, tone: result.success ? 'success' : 'error' });
  };

  const handlePdf = async () => {
    const result = await exportToPDF(title);
    setMessage({ text: result.message, tone: result.success ? 'success' : 'error' });
  };

  const clearStorage = () => {
    flow.clearLocalStorage({ alsoClearCurrentWork: clearCurrentWork });
    setClearCurrentWork(false);
    setDialog(null);
    setMessage({ text: clearCurrentWork ? 'Local storage and current work cleared.' : 'Saved local storage cleared; current work kept.', tone: 'success' });
  };

  const selectView = (next: string) => {
    if (!VALID_VIEWS.includes(next as MobileViewId)) return;
    setView(next as MobileViewId);
    setDrawerOpen(false);
  };

  const navItems = [
    { id: 'canvas', label: 'Canvas', icon: <IconChart size={20} /> },
    { id: 'edit', label: 'Edit', icon: <IconPencil size={20} /> },
    { id: 'run', label: 'Run', icon: <IconPlay size={20} /> },
    { id: 'console', label: 'Console', icon: <IconChatBubble size={20} /> },
    { id: 'tools', label: 'Tools', icon: <IconTools size={20} /> },
  ];

  return (
    <div className="m2-root" dir={dir}>
      <div className="m2-app">
        <MobileTopBar onOpenDrawer={() => setDrawerOpen(true)} />
        <main className="m2-main">
          {view === 'canvas' && <MobileCanvasView />}
          {view === 'edit' && <MobileEditView />}
          {view === 'run' && <MobileRunView />}
          {view === 'console' && <MobileConsoleView />}
          {view === 'tools' && <MobileToolsView
            onLanguage={() => setLanguageOpen(true)} onAbout={() => setDialog('about')} onManual={() => setDialog('manual')}
            onChangelog={() => setDialog('changelog')} onClearStorage={() => setDialog('clear')}
            onExportSvg={handleSvg} onExportPng={handlePng} onExportPdf={handlePdf}
            onBugReport={() => openExternal(ISSUE_URL)} onFeatureRequest={() => openExternal(ISSUE_URL)}
            onForkContribute={() => openExternal('https://github.com/PiBOH/flowonline2/fork')}
          />}
        </main>
        <M2BottomNav value={view} items={navItems} onChange={selectView} />
      </div>

      <input ref={inputRef} type="file" accept=".fprg,.json,application/json,text/xml,application/xml" onChange={handleFile} hidden />
      <MobileExportSvg statements={flow.statements} />
      <MobileSidebar
        open={drawerOpen} onClose={() => setDrawerOpen(false)} view={view} onSelectView={selectView}
        onNew={() => { flow.clearAll(); setDrawerOpen(false); }} onOpenFile={() => inputRef.current?.click()}
        onSave={handleSave} onBackupJson={handleBackup} onExportSvg={handleSvg} onExportPng={handlePng} onExportPdf={handlePdf}
        onClearLocalStorage={() => setDialog('clear')} onShowAbout={() => setDialog('about')} onShowManual={() => setDialog('manual')}
        onShowChangelog={() => setDialog('changelog')} onBugReport={() => openExternal(ISSUE_URL)}
        onFeatureRequest={() => openExternal(ISSUE_URL)} onForkContribute={() => openExternal('https://github.com/PiBOH/flowonline2/fork')}
        onPickLanguage={() => setLanguageOpen(true)} canUndo={flow.canUndo} canRedo={flow.canRedo}
      />
      <MobileLanguageSheet open={languageOpen} onClose={() => setLanguageOpen(false)} />
      <MobileBlockEditor block={flow.editingBlock} open={flow.editingBlock !== null} onClose={flow.closeEditor} />

      <M2Dialog open={dialog === 'about'} onClose={() => setDialog(null)} title="About Flowonline2" actions={<M2Button onClick={() => setDialog(null)}>Close</M2Button>}>
        <div className="m2-about"><IconInfo size={40} /><strong>Flowonline2</strong><span>{import.meta.env.VITE_APP_VERSION || '0.0.0-UNKNOWN'}</span><p>A web-based Flowgorithm-inspired flowchart editor built with React and Vite. Licensed under GNU AGPL v3.</p></div>
      </M2Dialog>
      <M2Dialog open={dialog === 'manual'} onClose={() => setDialog(null)} title="User Manual" actions={<M2Button onClick={() => setDialog(null)}>Close</M2Button>}><pre>{manual}</pre></M2Dialog>
      <M2Dialog open={dialog === 'changelog'} onClose={() => setDialog(null)} title="Changelog" actions={<M2Button onClick={() => setDialog(null)}>Close</M2Button>}><pre>{changelog}</pre></M2Dialog>
      <M2Dialog open={dialog === 'clear'} onClose={() => { setClearCurrentWork(false); setDialog(null); }} title="Clear localStorage" actions={<><M2Button onClick={() => { setClearCurrentWork(false); setDialog(null); }}>Cancel</M2Button><M2Button variant="contained" onClick={clearStorage}>Clear</M2Button></>}>
        <p>This removes the saved program. Current work stays open unless the optional Flag is enabled.</p>
        <label className="m2-flag-toggle"><input type="checkbox" checked={clearCurrentWork} onChange={(event) => setClearCurrentWork(event.target.checked)} /><span>Flag: also clear the current work</span></label>
      </M2Dialog>
      {message && <M2Snackbar message={message.text} tone={message.tone} />}
    </div>
  );
};

export default MobileApp;
