import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { translations as catalogs } from '../utils/translations';
import type { Language } from '../types/flow';
import {
  IconChart, IconPencil, IconPlay, IconChatBubble, IconTools,
  IconInfo, IconBooks, IconGlobe,
  IconDocument, IconFolderOpen, IconSave, IconTrash,
  IconRefresh, IdeaLightbulb,
  IconInbox, IconMagnifier, IconPalette, IconWarning, IconClose,
} from '../components/EmojiIcons';

export type MobileViewId = 'canvas' | 'edit' | 'run' | 'console' | 'tools';
export type MobileTabId = MobileViewId; // back-compat alias

interface SubItem {
  id: string;
  label: string;
  Icon?: React.FC<{ size?: number; className?: string }>;
  onClick: () => void;
  disabled?: boolean;
}

interface Section {
  id: MobileViewId;
  label: string;
  Icon: React.FC<{ size?: number; className?: string }>;
  subItems: SubItem[];
}

export interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  view: MobileViewId;
  onSelectView: (v: MobileViewId) => void;
  language: Language;
  // Action helpers invoked by the parent (MobileApp.tsx wires them to
  // useFlow / exportUtils / window.open / FprgParser directly).
  onNew: () => void;
  onOpenFile: () => void;
  onSave: () => void;
  onBackupJson: () => void;
  onExportSvg: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onClearLocalStorage: () => void;
  onShowAbout: () => void;
  onShowManual: () => void;
  onShowChangelog: () => void;
  onBugReport: () => void;
  onFeatureRequest: () => void;
  onForkContribute: () => void;
  onPickLanguage: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Mobile-only sidebar drawer (Phase 5 + 5.1 accessibility patch).
 *
 *   - Slide-in from LEFT over a dimmed backdrop.
 *   - Tap backdrop / close-button / leaf-item to dismiss.
 *   - ESC closes; focus moves to close-button on open and back to the
 *     opener on close (a11y contract for modal-style dialogs).
 *   - Body scroll locked while open.
 *
 * Architecture invariants:
 *   - Reads only `undo` / `redo` / `clearConsole` from `useFlow()`.
 *   - All other side-effects are passed in by the parent.
 *   - i18n: reads from the shared `translations` catalog where keys exist,
 *     and uses hardcoded English fallbacks for menu-only keys (TODO:
 *     extract Header's `menuTranslations` map into a shared file in a
 *     future pass to remove the duplication).
 */
export const MobileSidebar: React.FC<MobileSidebarProps> = (props) => {
  // ----- Body-scroll lock + a11y focus + ESC handler -----
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!props.open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Remember which element opened the drawer so we can restore focus
    // when it closes.
    const opener = (document.activeElement as HTMLElement) ?? null;

    requestAnimationFrame(() => {
      try { closeBtnRef.current?.focus(); } catch { /* noop */ }
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        props.onClose();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      // Defer focus restore to next tick so React unmount doesn't fight it.
      requestAnimationFrame(() => {
        try { opener?.focus(); } catch { /* noop */ }
      });
    };
  }, [props.open, props.onClose]);

  const [expanded, setExpanded] = useState<MobileViewId | null>(null);
  const [helpExpanded, setHelpExpanded] = useState<boolean>(false);

  const { undo, redo, clearConsole } = useFlow() as any;

  /**
   * Per-language labels (`L`).
   *
   * Source priority (highest → lowest):
   *   1. Shared `translations` catalog (varies by language).
   *   2. Hardcoded English (TODO: populate in a future i18n pass).
   *
   * The keys we read from the shared catalog are the ones the desktop
   * already exposes (toolbar.*, aboutTitle, manualTitle, changelogTitle,
   * console.clearBtn). The desktop menu's `menuTranslations` map lives
   * INSIDE the Header function body so it cannot be exported without a
   * refactor; for now we mirror those strings as English fallbacks.
   */
  const L = useMemo<Record<string, string>>(() => {
    const c = ((catalogs[props.language] as any) ?? (catalogs.en as any) ?? {});
    const tb = c.toolbar ?? {};
    return {
      // Toolbar labels (shared)
      run: tb.run ?? 'Run',
      step: tb.step ?? 'Step',
      pause: tb.pause ?? 'Pause',
      stop: tb.stop ?? 'Stop',
      speed: tb.speed ?? 'Speed',
      undo: tb.undo ?? 'Undo',
      redo: tb.redo ?? 'Redo',
      // File ops (best-effort reuse of toolbar keys)
      open: tb.import ?? 'Open…',
      save: tb.export ?? 'Save',
      backup: tb.exportJson ?? 'Backup JSON',
      clearAll: tb.clear ?? 'Clear All',
      // Dialog titles (shared)
      aboutTitle: c.aboutTitle ?? 'About Flowonline2',
      manualTitle: c.manualTitle ?? 'User Manual',
      changelogTitle: c.changelogTitle ?? 'Changelog',
      clearConsole: c.console?.clearBtn ?? tb.clear ?? 'Clear',
      // Menu-only keys (TODO: translate all 23 languages)
      new: 'New',
      exportSvg: 'Export SVG',
      exportPng: 'Export PNG',
      exportPdf: 'Export PDF',
      clearStorage: 'Clear Local Storage',
      help: 'Help',
      manualMenuOption: 'User Manual',
      changelogMenuOption: 'Changelog',
      about: 'About Flowonline2',
      bugReport: 'Report Bug',
      featureRequest: 'Feature Request',
      forkContribute: 'Fork & Contribute',
      selectLanguage: 'Select Language',
      // Section labels (TODO: translate)
      canvasTab: 'Canvas',
      editTab: 'Edit',
      runTab: 'Run',
      consoleTab: 'Console',
      toolsTab: 'Tools',
    };
  }, [props.language]);

  // ----- Sections (each main item, with optional sub-list) -----
  const sections = useMemo<Section[]>(() => {
    const fileSubs: SubItem[] = [
      { id: 'sub-new', label: L.new, Icon: IconDocument, onClick: props.onNew },
      { id: 'sub-open', label: L.open, Icon: IconFolderOpen, onClick: props.onOpenFile },
      { id: 'sub-save', label: L.save, Icon: IconSave, onClick: props.onSave },
      { id: 'sub-backup', label: L.backup, Icon: IconInbox, onClick: props.onBackupJson },
      { id: 'sub-svg', label: L.exportSvg, Icon: IconPalette, onClick: props.onExportSvg },
      { id: 'sub-png', label: L.exportPng, Icon: IconMagnifier, onClick: props.onExportPng },
      { id: 'sub-pdf', label: L.exportPdf, Icon: IconBooks, onClick: props.onExportPdf },
      { id: 'sub-clearstorage', label: L.clearStorage, Icon: IconTrash, onClick: props.onClearLocalStorage },
    ];
    const editSubs: SubItem[] = [
      { id: 'sub-undo', label: L.undo, Icon: IconRefresh, onClick: () => { try { undo?.(); } catch {} }, disabled: !props.canUndo },
      { id: 'sub-redo', label: L.redo, Icon: IconRefresh, onClick: () => { try { redo?.(); } catch {} }, disabled: !props.canRedo },
    ];
    const consoleSubs: SubItem[] = [
      { id: 'sub-clearconsole', label: L.clearConsole, Icon: IconTrash, onClick: () => { try { clearConsole?.(); } catch {} } },
    ];

    return [
      { id: 'canvas',  label: L.canvasTab,  Icon: IconChart,      subItems: fileSubs },
      { id: 'edit',    label: L.editTab,    Icon: IconPencil,     subItems: editSubs },
      { id: 'run',     label: L.runTab,     Icon: IconPlay,       subItems: [] },
      { id: 'console', label: L.consoleTab, Icon: IconChatBubble, subItems: consoleSubs },
      { id: 'tools',   label: L.toolsTab,   Icon: IconTools,      subItems: [] },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.language, props.canUndo, props.canRedo,
      props.onNew, props.onOpenFile, props.onSave, props.onBackupJson,
      props.onExportSvg, props.onExportPng, props.onExportPdf,
      props.onClearLocalStorage]);

  const helpSubs: SubItem[] = useMemo(() => [
    { id: 'help-manual',    label: L.manualMenuOption,   Icon: IconBooks,     onClick: props.onShowManual },
    { id: 'help-changelog', label: L.changelogMenuOption, Icon: IconBooks,   onClick: props.onShowChangelog },
    { id: 'help-about',     label: L.about,              Icon: IconInfo,      onClick: props.onShowAbout },
    { id: 'help-bug',       label: L.bugReport,          Icon: IconWarning,   onClick: props.onBugReport },
    { id: 'help-feat',      label: L.featureRequest,     Icon: IdeaLightbulb, onClick: props.onFeatureRequest },
    { id: 'help-fork',      label: L.forkContribute,     Icon: IconGlobe,     onClick: props.onForkContribute },
    { id: 'help-lang',      label: L.selectLanguage,     Icon: IconGlobe,     onClick: props.onPickLanguage },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.language]);

  const renderRow = (sec: Section) => {
    const isCurrent = props.view === sec.id;
    const isExpanded = expanded === sec.id;
    return (
      <div key={sec.id} className={`m-sidebar__section ${isCurrent ? 'current' : ''}`}>
        <div className="m-sidebar__row-group">
          <button
            type="button"
            className="m-sidebar__row"
            onClick={() => { props.onSelectView(sec.id); props.onClose(); }}
            aria-current={isCurrent ? 'page' : undefined}
          >
            <span className="m-sidebar__icon"><sec.Icon size={18} /></span>
            <span className="m-sidebar__label">{sec.label}</span>
          </button>
          {sec.subItems.length > 0 && (
            <button
              type="button"
              className="m-sidebar__chev"
              onClick={() => setExpanded(isExpanded ? null : sec.id)}
              aria-label={isExpanded ? `Collapse ${sec.label}` : `Expand ${sec.label}`}
              aria-expanded={isExpanded}
            >
              <span aria-hidden="true">{isExpanded ? '▾' : '▸'}</span>
            </button>
          )}
        </div>
        {isExpanded && sec.subItems.length > 0 && (
          <div className="m-sidebar__sub" role="group">
            {sec.subItems.map((it) => (
              <button
                key={it.id}
                type="button"
                disabled={!!it.disabled}
                className="m-sidebar__subrow"
                onClick={() => { it.onClick(); props.onClose(); }}
              >
                {it.Icon && <span className="m-sidebar__subicon"><it.Icon size={16} /></span>}
                <span>{it.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`m-sidebar-backdrop ${props.open ? 'open' : ''}`}
        onClick={props.onClose}
        aria-hidden={!props.open}
      />
      <aside
        className={`m-sidebar ${props.open ? 'open' : ''}`}
        role="dialog"
        aria-modal={props.open}
        aria-label="Mobile menu"
        aria-hidden={!props.open}
      >
        <div className="m-sidebar__header">
          <div className="m-sidebar__title">Flowonline2</div>
          <button
            ref={closeBtnRef}
            type="button"
            className="m-icon-btn"
            onClick={props.onClose}
            aria-label="Close menu"
            title="Close"
          >
            <IconClose size={18} />
          </button>
        </div>

        <nav className="m-sidebar__nav" aria-label="Sections">
          {sections.map(renderRow)}
        </nav>

        <div className="m-sidebar__footer">
          <div className="m-sidebar__row-group">
            <button
              type="button"
              className="m-sidebar__row m-sidebar__row--help"
              onClick={() => setHelpExpanded((v) => !v)}
              aria-expanded={helpExpanded}
            >
              <span className="m-sidebar__icon"><IconInfo size={18} /></span>
              <span className="m-sidebar__label">{L.help}</span>
            </button>
            <button
              type="button"
              className="m-sidebar__chev"
              onClick={() => setHelpExpanded((v) => !v)}
              aria-label={helpExpanded ? 'Collapse Help' : 'Expand Help'}
            >
              <span aria-hidden="true">{helpExpanded ? '▾' : '▸'}</span>
            </button>
          </div>
          {helpExpanded && (
            <div className="m-sidebar__sub" role="group">
              {helpSubs.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  className="m-sidebar__subrow"
                  onClick={() => { it.onClick(); props.onClose(); }}
                >
                  {it.Icon && <span className="m-sidebar__subicon"><it.Icon size={16} /></span>}
                  <span>{it.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
