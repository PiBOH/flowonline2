import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import type { AppLayout } from '../context/FlowContext';
import { exportToPNG, exportToPDF } from '../utils/exportUtils';
import { translations } from '../utils/translations';
import { MobileLanguageSheet } from './MobileLanguageSheet';
import { WinUIDialog } from '../components/WinUIDialog';

const COLOR_SCHEMES = ['classic', 'pastel', 'vibrant', 'retro', 'twilight', 'blackwhite'] as const;
const RTL_LANGS = ['ar', 'he', 'fa'] as const;
const LAYOUTS: { value: AppLayout; label: string }[] = [
  { value: 'flowchart_only', label: 'Canvas only' },
  { value: 'flow_console', label: 'Canvas + Console' },
  { value: 'flow_variables', label: 'Canvas + Variables' },
  { value: 'triple_split', label: 'Triple split' },
  { value: 'flow_code', label: 'Canvas + Source code' },
];

/**
 * Mobile tools view — settings list.
 *
 * Phase 2.5 i18n: titles and license/manual/changelog fallback text are pulled
 * from the shared `TranslationCatalog` via `translations[language]`. When the
 * language changes mid-session, the three dialog-body states reset to that
 * language's fallback AND the fetch effects re-run so the live content
 * (LICENSE / MANUAL.md / CHANGELOG.md) is also re-fetched in the new locale.
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

  // Resolve the catalog for the active language. `language` is `any` after
  // the `as any` cast above; index access is type-erased through `translations`.
  const t = translations[language as keyof typeof translations] ?? translations.en;
  // RTL only applies to the dialog body div; WinUIDialog's title bar chrome
  // intentionally stays LTR (matches Flowgorithm desktop convention).
  const isRtl = RTL_LANGS.includes(language as (typeof RTL_LANGS)[number]);

  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [exportSheetOpen, setExportSheetOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [licenseText, setLicenseText] = useState(t.gplLicenseTextFallback);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualText, setManualText] = useState(t.manualTextFallback);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [changelogText, setChangelogText] = useState(t.changelogTextFallback);

  // Auto-dismiss the export status toast after 2.4s.
  useEffect(() => {
    if (!exportStatus) return;
    const id = window.setTimeout(() => setExportStatus(null), 2400);
    return () => window.clearTimeout(id);
  }, [exportStatus]);

  // Watch the live `language` so dialogs opened in any locale get fresh fetches
  // (depend on `language`, not just `open`) AND fall back to the new locale's
  // text right after a switch (re-derive `t` inside the effect to avoid
  // listing the per-rendered `t` in deps and dropping the eslint-disable).
  useEffect(() => {
    const tCur = translations[language as keyof typeof translations] ?? translations.en;
    setLicenseText(tCur.gplLicenseTextFallback);
    setManualText(tCur.manualTextFallback);
    setChangelogText(tCur.changelogTextFallback);
  }, [language]);

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
  }, [aboutOpen, language]);

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
  }, [manualOpen, language]);

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
  }, [changelogOpen, language]);

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
        message = 'SVG exported \u2713';
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
      setExportStatus({ msg: 'localStorage cleared \u2713', type: 'success' });
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
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83c\udf10</span>
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
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83d\udce4</span>
        <span style={{ flex: 1 }}>Export diagram</span>
        <span style={{ color: '#94a3b8', fontSize: 13 }}>SVG \u00b7 PNG \u00b7 PDF</span>
      </button>

      <div className="m-section-title">Help</div>
      <button type="button" className="m-row" onClick={() => setAboutOpen(true)}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\u2139</span>
        <span style={{ flex: 1 }}>About &amp; License</span>
      </button>
      <button type="button" className="m-row" onClick={() => setManualOpen(true)}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83d\udcd6</span>
        <span style={{ flex: 1 }}>User manual</span>
      </button>
      <button type="button" className="m-row" onClick={() => setChangelogOpen(true)}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83d\udcdd</span>
        <span style={{ flex: 1 }}>Changelog</span>
      </button>
      <button
        type="button"
        className="m-row"
        onClick={() => openExternal('https://github.com/PiBOH/flowonline2/issues/new/choose')}
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83d\udc1e</span>
        <span style={{ flex: 1 }}>Report a bug / Request a feature</span>
      </button>
      <button
        type="button"
        className="m-row"
        onClick={() => openExternal('https://github.com/PiBOH/flowonline2/fork')}
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83d\udd31</span>
        <span style={{ flex: 1 }}>Fork repository</span>
      </button>

      <div className="m-section-title">Storage</div>
      <button type="button" className="m-row danger" onClick={handleClearLocalStorage}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83d\uddd1</span>
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
              <span>\ud83d\udce4 Export</span>
              <button
                type="button"
                onClick={() => setExportSheetOpen(false)}
                style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}
                aria-label="Close"
              >
                \u2715
              </button>
            </div>
            <div className="m-sheet-body">
              <button type="button" className="m-row" onClick={() => handleExport('svg')}>
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83d\udcd0</span>
                <span style={{ flex: 1 }}>SVG</span>
              </button>
              <button type="button" className="m-row" onClick={() => handleExport('png')}>
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83c\udfa8</span>
                <span style={{ flex: 1 }}>PNG (HiDPI)</span>
              </button>
              <button type="button" className="m-row" onClick={() => handleExport('pdf')}>
                <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>\ud83d\udcc4</span>
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

      {/* `message=""` is intentional: WinUIDialog's `message` prop is required
          to keep the desktop type-check happy, but `children` overrides the
          message render slot when provided. See WinUIDialog.tsx. */}
      <WinUIDialog
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title={t.aboutTitle}
        message=""
        type="info"
        defaultWidth={420}
        defaultHeight={320}
      >
        <div dir={isRtl ? 'rtl' : 'ltr'} style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 13, color: '#0f172a', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}>
          {licenseText}
        </div>
      </WinUIDialog>

      {/* `message=""` workaround — see WinUIDialog note above. */}
      <WinUIDialog
        isOpen={manualOpen}
        onClose={() => setManualOpen(false)}
        title={t.manualTitle}
        message=""
        type="info"
        defaultWidth={420}
        defaultHeight={320}
      >
        <div dir={isRtl ? 'rtl' : 'ltr'} style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 13, color: '#0f172a', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}>
          {manualText}
        </div>
      </WinUIDialog>

      {/* `message=""` workaround — see WinUIDialog note above. */}
      <WinUIDialog
        isOpen={changelogOpen}
        onClose={() => setChangelogOpen(false)}
        title={t.changelogTitle}
        message=""
        type="info"
        defaultWidth={420}
        defaultHeight={320}
      >
        <div dir={isRtl ? 'rtl' : 'ltr'} style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 12, color: '#0f172a', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}>
          {changelogText}
        </div>
      </WinUIDialog>
    </div>
  );
};
