import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import type { AppLayout } from '../context/FlowContext';
import { exportToPNG, exportToPDF } from '../utils/exportUtils';
import { MobileLanguageSheet } from './MobileLanguageSheet';
import { WinUIDialog } from '../components/WinUIDialog';

const COLOR_SCHEMES = ['classic', 'pastel', 'vibrant', 'retro', 'twilight', 'blackwhite'] as const;
const LAYOUTS: { value: AppLayout; label: string }[] = [
  { value: 'flowchart_only', label: 'Canvas only' },
  { value: 'flow_console', label: 'Canvas + Console' },
  { value: 'flow_variables', label: 'Canvas + Variables' },
  { value: 'triple_split', label: 'Triple split' },
  { value: 'flow_code', label: 'Canvas + Source code' },
];

const ABOUT_TITLE = 'About Flowonline2';
const MANUAL_TITLE = 'Flowonline2 User Manual';
const CHANGELOG_TITLE = 'Flowonline2 Changelog';
const LICENSE_FALLBACK = '# GNU GENERAL PUBLIC LICENSE\n# Version 3, 29 June 2007\n#\n# Copyright (C) 2026 Flowonline2 contributors\n# Full license text available at https://www.gnu.org/licenses/gpl-3.0.txt';
const MANUAL_FALLBACK = '# Flowonline2 User Manual\n\n> Translations of MANUAL.md may not be 100% accurate.\n\nFlowonline2 is a web-based replica of Flowgorithm (Windows version 2.0.3).\n\nSee the in-app Help → User Manual menu for the full text.';
const CHANGELOG_FALLBACK = '# Flowonline2 Changelog\n\n> Changelog not available offline. See CHANGELOG.md in the repository.';

/**
 * Mobile tools view — settings list.
 */
export const MobileToolsView: React.FC = () => {
  const {
    language,
    colorScheme,
    setColorScheme,
    layout,
    setLayout,
    programTitle,
    setProgramTitle,
    programAuthor,
    setProgramAuthor,
    clearLocalStorage,
  } = useFlow() as any;

  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [exportSheetOpen, setExportSheetOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [licenseText, setLicenseText] = useState(LICENSE_FALLBACK);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualText, setManualText] = useState(MANUAL_FALLBACK);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [changelogText, setChangelogText] = useState(CHANGELOG_FALLBACK);

  // Auto-dismiss the export status toast after 2.4s.
  useEffect(() => {
    if (!exportStatus) return;
    const id = window.setTimeout(() => setExportStatus(null), 2400);
    return () => window.clearTimeout(id);
  }, [exportStatus]);

  useEffect(() => {
    if (!aboutOpen) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('./LICENSE');
        if (!cancelled && r.ok) setLicenseText(await r.text());
      } catch {
        /* keep fallback */
      }
    })();
    return () => { cancelled = true; };
  }, [aboutOpen]);

  useEffect(() => {
    if (!manualOpen) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('./MANUAL.md');
        if (!cancelled && r.ok) setManualText(await r.text());
      } catch {
        /* keep fallback */
      }
    })();
    return () => { cancelled = true; };
  }, [manualOpen]);

  useEffect(() => {
    if (!changelogOpen) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('./CHANGELOG.md');
        if (!cancelled && r.ok) setChangelogText(await r.text());
      } catch {
        /* keep fallback */
      }
    })();
    return () => { cancelled = true; };
  }, [changelogOpen]);

  const handleExport = async (fmt: 'svg' | 'png' | 'pdf') => {
    setExportSheetOpen(false);
    try {
      let success = false;
      let message = '';
      if (fmt === 'svg') {
        const svg = document.querySelector('svg.flowchart-canvas, svg');
        if (!svg) throw new Error('No flowchart SVG found.');
        const xml = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([xml], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(programTitle || 'diagram').replace(/\s+/g, '_')}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        success = true;
        message = 'SVG exported ✓';
      } else if (fmt === 'png') {
        const r = await exportToPNG(programTitle || 'diagram');
        success = r.success;
        message = r.message;
      } else {
        const r = await exportToPDF(programTitle || 'diagram');
        success = r.success;
        message = r.message;
      }
      setExportStatus({ msg: success ? `${fmt.toUpperCase()} ${message}` : `Export failed: ${message}`, type: success ? 'success' : 'error' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setExportStatus({ msg: `Export failed: ${msg}`, type: 'error' });
    }
  };

  const handleClearLocalStorage = () => {
    if (typeof window === 'undefined') return;
    if (!window.confirm('Clear localStorage? This removes your saved flowchart backup.')) return;
    try {
      if (clearLocalStorage) clearLocalStorage();
      setExportStatus({ msg: 'localStorage cleared ✓', type: 'success' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setExportStatus({ msg: `Failed: ${msg}`, type: 'error' });
    }
  };

  const openExternal = (url: string) => {
    if (typeof window === 'undefined') return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="m-view m-scroll">
      <div className="m-section-title">Program</div>
      <div className="m-row">
        <span style={{ flex: 1, color: '#64748b', fontWeight: 600, fontSize: 12 }}>Title</span>
        <input
          type="text"
          value={programTitle || ''}
          onChange={(e) => setProgramTitle && setProgramTitle(e.target.value)}
          placeholder="Untitled"
          style={{
            flex: 2,
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 14,
            background: '#ffffff',
            color: '#0f172a',
          }}
          aria-label="Program title"
        />
      </div>
      <div className="m-row">
        <span style={{ flex: 1, color: '#64748b', fontWeight: 600, fontSize: 12 }}>Author</span>
        <input
          type="text"
          value={programAuthor || ''}
          onChange={(e) => setProgramAuthor && setProgramAuthor(e.target.value)}
          placeholder="Author"
          style={{
            flex: 2,
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 14,
            background: '#ffffff',
            color: '#0f172a',
          }}
          aria-label="Program author"
        />
      </div>

      <div className="m-section-title">Settings</div>
      <button type="button" className="m-row" onClick={() => setLangSheetOpen(true)} aria-label="Change language">
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>🌐</span>
        <span style={{ flex: 1 }}>Language</span>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>{language}</span>
      </button>
      <div className="m-row subtitle">
        <span style={{ flex: 1 }}>Color scheme</span>
        <select
          value={colorScheme || 'classic'}
          onChange={(e) => setColorScheme && setColorScheme(e.target.value)}
          style={{
            padding: '6px 10px',
            fontSize: 14,
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            background: '#ffffff',
          }}
          aria-label="Color scheme"
        >
          {COLOR_SCHEMES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="m-row subtitle">
        <span style={{ flex: 1 }}>Layout</span>
        <select
          value={layout || 'triple_split'}
          onChange={(e) => setLayout && setLayout(e.target.value as AppLayout)}
          style={{
            padding: '6px 10px',
            fontSize: 14,
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            background: '#ffffff',
          }}
          aria-label="Layout"
        >
          {LAYOUTS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      <div className="m-section-title">Export</div>
      <button type="button" className="m-row" onClick={() => setExportSheetOpen(true)} aria-label="Export diagram">
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>📤</span>
        <span style={{ flex: 1 }}>Export diagram</span>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>SVG · PNG · PDF</span>
      </button>

      <div className="m-section-title">Help</div>
      <button type="button" className="m-row" onClick={() => setAboutOpen(true)}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>ℹ</span>
        <span style={{ flex: 1 }}>About &amp; License</span>
      </button>
      <button type="button" className="m-row" onClick={() => setManualOpen(true)}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>📖</span>
        <span style={{ flex: 1 }}>User manual</span>
      </button>
      <button type="button" className="m-row" onClick={() => setChangelogOpen(true)}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>📝</span>
        <span style={{ flex: 1 }}>Changelog</span>
      </button>
      <button
        type="button"
        className="m-row"
        onClick={() => openExternal('https://github.com/PiBOH/flowonline2/issues/new/choose')}
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>🐞</span>
        <span style={{ flex: 1 }}>Report a bug / Request a feature</span>
      </button>
      <button
        type="button"
        className="m-row"
        onClick={() => openExternal('https://github.com/PiBOH/flowonline2/fork')}
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>🔱</span>
        <span style={{ flex: 1 }}>Fork repository</span>
      </button>

      <div className="m-section-title">Storage</div>
      <button type="button" className="m-row danger" onClick={handleClearLocalStorage}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>🗑</span>
        <span style={{ flex: 1 }}>Clear localStorage</span>
      </button>

      {/* Sheets & dialogs */}
      <MobileLanguageSheet open={langSheetOpen} onClose={() => setLangSheetOpen(false)} />

      {exportSheetOpen && (
        <>
          <div className="m-sheet-backdrop open" onClick={() => setExportSheetOpen(false)} aria-hidden="true" />
          <div className="m-sheet" style={{ transform: 'translateY(calc(100% - 40%))' }} role="dialog" aria-label="Export">
            <div className="m-sheet-handle" />
            <div className="m-sheet-header">
              <span>📤 Export</span>
              <button
                type="button"
                onClick={() => setExportSheetOpen(false)}
                style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="m-sheet-body">
              <button type="button" className="m-row" onClick={() => handleExport('svg')}>
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>📐</span>
                <span style={{ flex: 1 }}>SVG</span>
              </button>
              <button type="button" className="m-row" onClick={() => handleExport('png')}>
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>🖼</span>
                <span style={{ flex: 1 }}>PNG (HiDPI)</span>
              </button>
              <button type="button" className="m-row" onClick={() => handleExport('pdf')}>
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>📄</span>
                <span style={{ flex: 1 }}>PDF</span>
              </button>
            </div>
          </div>
        </>
      )}

      {exportStatus && (
        <div
          style={{
            position: 'fixed',
            bottom: 84,
            left: 16,
            right: 16,
            padding: '12px 16px',
            background: exportStatus.type === 'success' ? '#10b981' : '#ef4444',
            color: '#ffffff',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 200,
            textAlign: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          }}
          role="status"
          aria-live="polite"
        >
          {exportStatus.msg}
        </div>
      )}

      <WinUIDialog
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title={ABOUT_TITLE}
        message=""
        type="info"
        defaultWidth={420}
        defaultHeight={320}
      >
        <div style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 13, color: '#0f172a', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}>
          {licenseText}
        </div>
      </WinUIDialog>

      <WinUIDialog
        isOpen={manualOpen}
        onClose={() => setManualOpen(false)}
        title={MANUAL_TITLE}
        message=""
        type="info"
        defaultWidth={420}
        defaultHeight={320}
      >
        <div style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 13, color: '#0f172a', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}>
          {manualText}
        </div>
      </WinUIDialog>

      <WinUIDialog
        isOpen={changelogOpen}
        onClose={() => setChangelogOpen(false)}
        title={CHANGELOG_TITLE}
        message=""
        type="info"
        defaultWidth={420}
        defaultHeight={320}
      >
        <div style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 12, color: '#0f172a', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}>
          {changelogText}
        </div>
      </WinUIDialog>
    </div>
  );
};
