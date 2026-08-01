import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { translations as catalogs } from '../utils/translations';
import { menuTranslations } from '../components/Header';
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
  // useFlow / exportUtils / window.open / FprgParser directly — see
  // MobileApp.tsx for the canonical paths).
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
 *     All other side-effects are passed in by the parent.
 *   - 23-language labels are taken from `menuTranslations` (the same
 *     map the desktop menus use), merged with the standard
 *     `translations` catalog fall-through so any missing key degrades
 *     gracefully to `''` instead of crashing.
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
    // when it closes. We grab document.activeElement BEFORE we ever
    // shift focus into the drawer.
    openerRef.current = (document.activeElement as HTMLElement) ?? null;

    // Move focus to the close button.
    requestAnimationFrame(() => {
      try { closeBtnRef.current?.focus(); } catch { /* noop */ }
    });

    // ESC closes the drawer.
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
      try { openerRef.current?.focus(); } catch { /* noop */ }
    };
  }, [props.open, props.onClose]);

  const [expanded, setExpanded] = useState<MobileViewId | null>(null);
  const [helpExpanded, setHelpExpanded] = useState<boolean>(false);

  const { undo, redo, clearConsole } = useFlow() as any;

  // Merge the standard `translations` catalog with `menuTranslations` so
  // we expose the keys the desktop menus use. Missing keys degrade to ''.
  const t = useMemo(() => {
    const base = (catalogs[props.language] ?? {}) as Record<string, string>;
    const mt = ((menuTranslations as any)[props.language] ?? {}) as Record<string, string>;
    return { ...base, ...mt } as Record<string, string>;
  }, [props.language]);

  // Section labels for the 5 main rows. Currently English-only labels
  // because the desktop tabs themselves don't carry an i18n key. If a
  // future pass adds `mt.canvasTab/...` keys we'll swap them in here.
  const LABELS: Record<MobileViewId, string> = {
    canvas: t.canvasTab ?? 'Canvas',
    edit: t.editTab ?? 'Edit',
    run: t.runTab ?? 'Run',
    console: t.consoleTab ?? 'Console',
    tools: t.toolsTab ?? 'Tools',
  };

  // ----- Sections (each main item, with optional sub-list) -----
  const sections = useMemo<Section[]>(() => {
    const fileSubs: SubItem[] = [
      { id: 'sub-new', label: t.new, Icon: IconDocument, onClick: props.onNew },
      { id: 'sub-open', label: t.open, Icon: IconFolderOpen, onClick: props.onOpenFile },
      { id: 'sub-save', label: t.save, Icon: IconSave, onClick: props.onSave },
      { id: 'sub-backup', label: t.backup, Icon: IconInbox, onClick: props.onBackupJson },
      { id: 'sub-svg', label: t.exportSvg, Icon: IconPalette, onClick: props.onExportSvg },
      { id: 'sub-png', label: t.exportPng, Icon: IconMagnifier, onClick: props.onExportPng },
      { id: 'sub-pdf', label: t.exportPdf, Icon: IconBooks, onClick: props.onExportPdf },
      { id: 'sub-clearstorage', label: t.clearStorage, Icon: IconTrash, onClick: props.onClearLocalStorage },
    ];
    const editSubs: SubItem[] = [
      { id: 'sub-undo', label: t.undo, Icon: IconRefresh, onClick: () => { try { undo?.(); } catch {} }, disabled: !props.canUndo },
      { id: 'sub-redo', label: t.redo, Icon: IconRefresh, onClick: () => { try { redo?.(); } catch {} }, disabled: !props.canRedo },
    ];
    const consoleSubs: SubItem[] = [
      { id: 'sub-clearconsole', label: t.consoleTabClear ?? t.consoleClear ?? (catalogs[props.language]?.console?.clearBtn ?? 'Clear'), Icon: IconTrash, onClick: () => { try { clearConsole?.(); } catch {} } },
    ];

    return [
      { id: 'canvas',  label: LABELS.canvas,  Icon: IconChart,      subItems: fileSubs },
      { id: 'edit',    label: LABELS.edit,    Icon: IconPencil,     subItems: editSubs },
      { id: 'run',     label: LABELS.run,     Icon: IconPlay,       subItems: [] },
      { id: 'console', label: LABELS.console, Icon: IconChatBubble, subItems: consoleSubs },
      { id: 'tools',   label: LABELS.tools,   Icon: IconTools,      subItems: [] },
    ];
  // We depend on props.* directly so a parent re-render re-creates the list
  // (callbacks captured by closures would otherwise go stale).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.language, props.canUndo, props.canRedo,
      props.onNew, props.onOpenFile, props.onSave, props.onBackupJson,
      props.onExportSvg, props.onExportPng, props.onExportPdf,
      props.onClearLocalStorage]);

  const helpSubs: SubItem[] = useMemo(() => [
    { id: 'help-manual',    label: t.manualMenuOption,   Icon: IconBooks,     onClick: props.onShowManual },
    { id: 'help-changelog', label: t.changelogMenuOption, Icon: IconBooks,   onClick: props.onShowChangelog },
    { id: 'help-about',     label: t.about,              Icon: IconInfo,      onClick: props.onShowAbout },
    { id: 'help-bug',       label: t.bugReport,          Icon: IconWarning,   onClick: props.onBugReport },
    { id: 'help-feat',      label: t.featureRequest,     Icon: IdeaLightbulb, onClick: props.onFeatureRequest },
    { id: 'help-fork',      label: t.forkContribute,     Icon: IconGlobe,     onClick: props.onForkContribute },
    { id: 'help-lang',      label: t.selectLanguage,     Icon: IconGlobe,     onClick: props.onPickLanguage },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [props.language]);

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
              <span className="m-sidebar__label">{t.help}</span>
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
