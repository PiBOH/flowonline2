import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import type { AppLayout } from '../context/FlowContext';
import { exportToPNG, exportToPDF } from '../utils/exportUtils';
import { translations } from '../utils/translations';
import { MobileLanguageSheet } from './MobileLanguageSheet';
import { WinUIDialog } from '../components/WinUIDialog';
import { StatusDot } from '../components/StatusDot';
import {
  IconTools,
  IconGlobe,
  IconPalette,
  IconDocument,
  IconBooks,
  IconChangelog,
  IconInbox,
  IconCode,
  IconTrash,
  IconChart,
  IconPencil,
} from '../components/EmojiIcons';

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
 * Mobile tools view (Phase 3 rewrite).
 *
 * Card-based sections:
 *   1. Program — title + author
 *   2. Settings — language, color scheme, layout
 *   3. Export — opens the export sheet
 *   4. Help — about/license, manual, changelog, bug-feature-fork
 *   5. Storage — clear localStorage
 *
 * The about / manual / changelog dialogs load LICENSE / MANUAL.md /
 * CHANGELOG.md from the repo; instead of an invasive badge saying
 * "loaded from X", we surface that info as a tiny `StatusDot` next to
 * the row — same dot-on-hover pattern used everywhere else.
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

  const t = translations[language as keyof typeof translations] ?? translations.en;
  const isRtl = RTL_LANGS.includes(language as (typeof RTL_LANGS)[number]);

  const [langSheetOpen, setLangSheetOpen] = useState(false);
  const [clearSheetOpen, setClearSheetOpen] = useState(false);

  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutStatus, setAboutStatus] = useState<'live' | 'fallback' | 'idle'>('idle');
  const [aboutText, setAboutText] = useState(t.gplLicenseTextFallback);

  const [manualOpen, setManualOpen] = useState(false);
  const [manualStatus, setManualStatus] = useState<'live' | 'fallback' | 'idle'>('idle');
  const [manualText, setManualText] = useState(t.manualTextFallback);

  const [changelogOpen, setChangelogOpen] = useState(false);
  const [changelogStatus, setChangelogStatus] = useState<'live' | 'fallback' | 'idle'>('idle');
  const [changelogText, setChangelogText] = useState(t.changelogTextFallback);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 2400);
  };

  // When language changes, reset the dialog texts to the new locale's fallback.
  useEffect(() => {
    const tCur = translations[language as keyof typeof translations] ?? translations.en;
    setAboutText(tCur.gplLicenseTextFallback);
    setManualText(tCur.manualTextFallback);
    setChangelogText(tCur.changelogTextFallback);
  }, [language]);

  // Fetch LICENSE / MANUAL.md / CHANGELOG.md only when the user opens them.
  // Each effect uses a `cancelled` flag hoisted OUTSIDE the async IIFE so the
  // cleanup correctly runs on unmount or language change, preventing stale
  // state writes from an in-flight fetch.
  useEffect(() => {
    if (!aboutOpen) return;
    let cancelled = false;
    setAboutStatus('idle');
    (async () => {
      try {
        const r = await fetch('./LICENSE');
        if (cancelled) return;
        if (r.ok) {
          setAboutText(await r.text());
          if (!cancelled) setAboutStatus('live');
        } else {
          setAboutStatus('fallback');
        }
      } catch {
        if (!cancelled) setAboutStatus('fallback');
      }
    })();
    return () => { cancelled = true; };
  }, [aboutOpen, language]);

  useEffect(() => {
    if (!manualOpen) return;
    let cancelled = false;
    setManualStatus('idle');
    (async () => {
      try {
        const r = await fetch('./MANUAL.md');
        if (cancelled) return;
        if (r.ok) {
          setManualText(await r.text());
          if (!cancelled) setManualStatus('live');
        } else {
          setManualStatus('fallback');
        }
      } catch {
        if (!cancelled) setManualStatus('fallback');
      }
    })();
    return () => { cancelled = true; };
  }, [manualOpen, language]);

  useEffect(() => {
    if (!changelogOpen) return;
    let cancelled = false;
    setChangelogStatus('idle');
    (async () => {
      try {
        const r = await fetch('./CHANGELOG.md');
        if (cancelled) return;
        if (r.ok) {
          setChangelogText(await r.text());
          if (!cancelled) setChangelogStatus('live');
        } else {
          setChangelogStatus('fallback');
        }
      } catch {
        if (!cancelled) setChangelogStatus('fallback');
      }
    })();
    return () => { cancelled = true; };
  }, [changelogOpen, language]);

  const handleExport = async (fmt: 'svg' | 'png' | 'pdf') => {
    setLangSheetOpen(false);
    setClearSheetOpen(false);
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
      showToast(`${fmt.toUpperCase()} ${message}`, success ? 'success' : 'error');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      showToast(`Export failed: ${msg}`, 'error');
    }
  };

  const handleClearLocalStorage = () => {
    setClearSheetOpen(false);
    try {
      if (clearLocalStorage) clearLocalStorage();
      window.localStorage.removeItem('flowonline2_autosave');
      showToast('localStorage cleared ✓', 'success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      showToast(`Failed: ${msg}`, 'error');
    }
  };

  const openExternal = (url: string) => {
    if (typeof window === 'undefined') return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="m-view m-scroll" style={{ background: 'var(--m-bg)' }}>
      <div className="m-section">
        <div className="m-section-title">Program</div>
        <div className="m-row subtitle" style={{ alignItems: 'center' }}>
          <span className="m-row__icon"><IconDocument size={18} /></span>
          <span className="m-row__label" style={{ flex: 0, width: 60 }}>Title</span>
          <input
            className="m-input"
            type="text"
            value={programTitle || ''}
            onChange={(e) => setProgramTitle && setProgramTitle(e.target.value)}
            placeholder="Untitled"
            aria-label="Program title"
          />
        </div>
        <div className="m-row subtitle" style={{ alignItems: 'center' }}>
          <span className="m-row__icon"><IconPencil size={18} /></span>
          <span className="m-row__label" style={{ flex: 0, width: 60 }}>Author</span>
          <input
            className="m-input"
            type="text"
            value={programAuthor || ''}
            onChange={(e) => setProgramAuthor && setProgramAuthor(e.target.value)}
            placeholder="Author"
            aria-label="Program author"
          />
        </div>
      </div>

      <div className="m-section">
        <div className="m-section-title">Settings</div>
        <button type="button" className="m-row" onClick={() => setLangSheetOpen(true)} aria-label="Change language">
          <span className="m-row__icon"><IconGlobe size={18} /></span>
          <span className="m-row__label">Language</span>
          <span className="m-row__value">{language}</span>
        </button>
        <div className="m-row subtitle" style={{ alignItems: 'center' }}>
          <span className="m-row__icon"><IconPalette size={18} /></span>
          <span className="m-row__label">Color scheme</span>
          <select
            className="m-select"
            value={colorScheme || 'classic'}
            onChange={(e) => setColorScheme && setColorScheme(e.target.value)}
            aria-label="Color scheme"
          >
            {COLOR_SCHEMES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="m-row subtitle" style={{ alignItems: 'center' }}>
          <span className="m-row__icon"><IconTools size={18} /></span>
          <span className="m-row__label">Layout</span>
          <select
            className="m-select"
            value={layout || 'triple_split'}
            onChange={(e) => setLayout && setLayout(e.target.value as AppLayout)}
            aria-label="Layout"
          >
            {LAYOUTS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="m-section">
        <div className="m-section-title">Export</div>
        <button type="button" className="m-row" onClick={() => handleExport('svg')} aria-label="Export as SVG">
          <span className="m-row__icon"><IconChart size={18} /></span>
          <span className="m-row__label">Export SVG</span>
        </button>
        <button type="button" className="m-row" onClick={() => handleExport('png')} aria-label="Export as PNG (HiDPI)">
          <span className="m-row__icon"><IconInbox size={18} /></span>
          <span className="m-row__label">Export PNG (HiDPI)</span>
        </button>
        <button type="button" className="m-row" onClick={() => handleExport('pdf')} aria-label="Export as PDF">
          <span className="m-row__icon"><IconDocument size={18} /></span>
          <span className="m-row__label">Export PDF</span>
        </button>
      </div>

      <div className="m-section">
        <div className="m-section-title">Help</div>
        <button type="button" className="m-row" onClick={() => setAboutOpen(true)}>
          <span className="m-row__icon"><IconBooks size={18} /></span>
          <span className="m-row__label">About &amp; License</span>
          <StatusDot
            variant={aboutStatus === 'live' ? 'live' : aboutStatus === 'fallback' ? 'fallback' : 'info'}
            label={
              aboutStatus === 'live'
                ? 'Loaded live from repo'
                : aboutStatus === 'fallback'
                ? 'Loaded from local fallback'
                : 'Open to load LICENSE'
            }
          />
        </button>
        <button type="button" className="m-row" onClick={() => setManualOpen(true)}>
          <span className="m-row__icon"><IconBooks size={18} /></span>
          <span className="m-row__label">User manual</span>
          <StatusDot
            variant={manualStatus === 'live' ? 'live' : manualStatus === 'fallback' ? 'fallback' : 'info'}
            label={
              manualStatus === 'live'
                ? 'Loaded live from repo'
                : manualStatus === 'fallback'
                ? 'Loaded from local fallback'
                : 'Open to load MANUAL.md'
            }
          />
        </button>
        <button type="button" className="m-row" onClick={() => setChangelogOpen(true)}>
          <span className="m-row__icon"><IconChangelog size={18} /></span>
          <span className="m-row__label">Changelog</span>
          <StatusDot
            variant={changelogStatus === 'live' ? 'live' : changelogStatus === 'fallback' ? 'fallback' : 'info'}
            label={
              changelogStatus === 'live'
                ? 'Loaded live from repo'
                : changelogStatus === 'fallback'
                ? 'Loaded from local fallback'
                : 'Open to load CHANGELOG.md'
            }
          />
        </button>
        <button
          type="button"
          className="m-row"
          onClick={() => openExternal('https://github.com/PiBOH/flowonline2/issues/new/choose')}
        >
          <span className="m-row__icon"><IconInbox size={18} /></span>
          <span className="m-row__label">Report a bug / Request a feature</span>
        </button>
        <button
          type="button"
          className="m-row"
          onClick={() => openExternal('https://github.com/PiBOH/flowonline2/fork')}
        >
          <span className="m-row__icon"><IconCode size={18} /></span>
          <span className="m-row__label">Fork repository</span>
        </button>
      </div>

      <div className="m-section">
        <div className="m-section-title">Storage</div>
        <button type="button" className="m-row danger" onClick={() => setClearSheetOpen(true)}>
          <span className="m-row__icon"><IconTrash size={18} /></span>
          <span className="m-row__label">Clear localStorage</span>
        </button>
      </div>

      {/* Sheets & dialogs */}
      <MobileLanguageSheet open={langSheetOpen} onClose={() => setLangSheetOpen(false)} />

      <WinUIDialog
        isOpen={clearSheetOpen}
        onClose={() => setClearSheetOpen(false)}
        onOk={handleClearLocalStorage}
        title="Clear localStorage?"
        message="This will remove your saved flowchart backup and language preference. This cannot be undone."
        type="confirm"
        defaultWidth={360}
        defaultHeight={220}
        okLabel="Clear"
      />

      <WinUIDialog
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        onOk={() => setAboutOpen(false)}
        title={t.aboutTitle}
        message=""
        type="info"
        defaultWidth={380}
        defaultHeight={320}
      >
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--m-text)', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}
        >
          {aboutText}
        </div>
      </WinUIDialog>

      <WinUIDialog
        isOpen={manualOpen}
        onClose={() => setManualOpen(false)}
        onOk={() => setManualOpen(false)}
        title={t.manualTitle}
        message=""
        type="info"
        defaultWidth={380}
        defaultHeight={320}
      >
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--m-text)', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}
        >
          {manualText}
        </div>
      </WinUIDialog>

      <WinUIDialog
        isOpen={changelogOpen}
        onClose={() => setChangelogOpen(false)}
        onOk={() => setChangelogOpen(false)}
        title={t.changelogTitle}
        message=""
        type="info"
        defaultWidth={380}
        defaultHeight={320}
      >
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{ padding: 12, whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--m-text)', overflow: 'auto', maxHeight: 240, userSelect: 'text' }}
        >
          {changelogText}
        </div>
      </WinUIDialog>

      {toast && (
        <div
          className={`m-toast ${toast.type === 'success' ? 'm-toast--success' : 'm-toast--error'}`}
          role="status"
          aria-live="polite"
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
};
