import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import type { Language } from '../types/flow';
import type { AppLayout } from '../context/FlowContext';
import { exportToPNG, exportToPDF } from '../utils/exportUtils';
import { MobileLanguageSheet } from './MobileLanguageSheet';
import { translations } from '../utils/translations';
import { WinUIDialog } from '../components/WinUIDialog';

const COLOR_SCHEMES = ['classic', 'pastel', 'vibrant', 'retro', 'twilight', 'blackwhite'] as const;
const LAYOUTS: { value: AppLayout; label: string }[] = [
  { value: 'flowchart_only', label: 'Canvas only' },
  { value: 'flow_console', label: 'Canvas + Console' },
  { value: 'flow_variables', label: 'Canvas + Variables' },
  { value: 'triple_split', label: 'Triple split' },
  { value: 'flow_code', label: 'Canvas + Source code' },
];

/**
 * Mobile tools view — settings list.
 * Tapping a row opens the appropriate sheet/dialog (language picker, etc.)
 * or triggers a FlowContext mutation directly (color scheme, layout, etc.).
 */
export const MobileToolsView: React.FC = () => {
  const {
    language,
    setLanguage,
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
  const [licenseText, setLicenseText] = useState('Loading license…');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualText, setManualText] = useState('Loading manual…');
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [changelogText, setChangelogText] = useState('Loading changelog…');

  const t = translations[language as Language];

  const openLicense = async () => {
    setAboutOpen(true);
    try {
      const r = await fetch('./LICENSE');
      if (r.ok) setLicenseText(await r.text());
      else setLicenseText(t.gplLicenseTextFallback || 'GNU GPL v3 license text not available.');
    } catch {
      setLicenseText(t.gplLicenseTextFallback || 'GNU GPL v3 license text not available.');
    }
  };
  const openManual = async () => {
    setManualOpen(true);
    try {
      const r = await fetch('./MANUAL.md');
      if (r.ok) setManualText(await r.text());
      else setManualText(t.manualTextFallback || 'User manual not available offline.');
    } catch {
      setManualText(t.manualTextFallback || 'User manual not available offline.');
    }
  };
  const openChangelog = async () => {
    setChangelogOpen(true);
    try {
      const r = await fetch('./CHANGELOG.md');
      if (r.ok) setChangelogText(await r.text());
      else setChangelogText('Changelog not available offline.');
    } catch {
      setChangelogText('Changelog not available offline.');
    }
  };

  const handleExport = async (fmt: 'svg' | 'png' | 'pdf') => {
    setExportSheetOpen(false);
    try {
      let result;
      if (fmt === 'png') result = await exportToPNG(programTitle || 'diagram');
      else if (fmt === 'pdf') result = await exportToPDF(programTitle || 'diagram');
      else {
        // SVG export: serialise current visible flowchart DOM (best-effort)
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
        setExportStatus({ msg: 'SVG exported ✓', type: 'success' });
        return;
      }
      setExportStatus({ msg: `${fmt.toUpperCase()} exported ✓`, type: result?.ok ? 'success' : 'error' });
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
      <button type="button" className="m-row" onClick={openLicense}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>ℹ</span>
        <span style={{ flex: 1 }}>About &amp; License</span>
      </button>
      <button type="button" className="m-row" onClick={openManual}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>📖</span>
        <span style={{ flex: 1 }}>User manual</span>
      </button>
      <button type="button" className="m-row" onClick={openChangelog}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>📝</span>
        <span style={{ flex: 1 }}>Changelog</span>
      </button>
      <button
        type="button"
        className="m-row"
        onClick={() =>
          (typeof window !== 'undefined' ? window : {open:()=>{}} as any).open(
            'https://github.com/PiBOH/flowonline2/issues/new/choose',
            '_blank',
            'noopener,noreferrer'
          )
        }
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>🐞</span>
        <span style={{ flex: 1 }}>Report a bug / Request a feature</span>
      </button>
      <button
        type="button"
        className="m-row"
        onClick={() =>
          (typeof window !== 'undefined' ? window : {open:()=>{}} as any).open(
            'https://github.com/PiBOH/flowonline2/fork',
            '_blank',
            'noopener,noreferrer'
          )
        }
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
        <div className="m-sheet-backdrop open" onClick={() => setExportSheetOpen(false)} aria-hidden="true" />
      )}
      {exportSheetOpen && (
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
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title={t.aboutTitle || 'About Flowonline2'}
        defaultWidth={420}
        defaultHeight={320}
        closeOnOutsideClick
      >
        <div style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 13, color: '#0f172a', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}>
          {licenseText}
        </div>
      </WinUIDialog>

      <WinUIDialog
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        title={t.manualTitle || 'User Manual'}
        defaultWidth={420}
        defaultHeight={320}
        closeOnOutsideClick
      >
        <div style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 13, color: '#0f172a', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}>
          {manualText}
        </div>
      </WinUIDialog>

      <WinUIDialog
        open={changelogOpen}
        onClose={() => setChangelogOpen(false)}
        title={t.changelogTitle || 'Changelog'}
        defaultWidth={420}
        defaultHeight={320}
        closeOnOutsideClick
      >
        <div style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 12, color: '#0f172a', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}>
          {changelogText}
        </div>
      </WinUIDialog>

      {/* Auto-dismiss the export status toast after 2.4s */}
      {exportStatus && (
        <ExportStatusAutoDismiss stateRef={[exportStatus, setExportStatus]} />
      )}
    </div>
  );
};

/**
 * No-op fallback that fires after a delay via setTimeout to clear
 * `exportStatus` after a few seconds. Re-implemented as a tiny helper
 * so the main component stays tidy.
 */
const ExportStatusAutoDismiss: React.FC<{ stateRef: [any, (v: any) => void] }> = ({ stateRef }) => {
  const [, setStatus] = stateRef;
  React.useEffect(() => {
    const id = window.setTimeout(() => setStatus(null), 2400);
    return () => window.clearTimeout(id);
  }, [setStatus]);
  return null;
};
