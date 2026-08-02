import React from 'react';
import { useFlow } from '../context/FlowContext';
import { IconChart, IconPencil, IconPlay, IconChatBubble, IconTools, IconDocument, IconFolderOpen, IconSave, IconInbox, IconPalette, IconTrash, IconBooks, IconInfo, IconGlobe, IconWarning, IconRefresh, IconShield, IconLock, IconBookmarkTabs } from '../components/EmojiIcons';
import { M2Drawer, M2IconButton, M2CloseIcon } from './Material2';

export type MobileViewId = 'canvas' | 'edit' | 'run' | 'console' | 'tools';
export type MobileTabId = MobileViewId;

export interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  view: MobileViewId;
  onSelectView: (view: MobileViewId) => void;
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
  onShowSecurity: () => void;
  onShowPrivacy: () => void;
  onShowDisclaimer: () => void;
  onBugReport: () => void;
  onFeatureRequest: () => void;
  onForkContribute: () => void;
  onPickLanguage: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const sections: Array<{ id: MobileViewId; label: string; icon: React.ReactNode }> = [
  { id: 'canvas', label: 'Canvas', icon: <IconChart size={20} /> },
  { id: 'edit', label: 'Edit', icon: <IconPencil size={20} /> },
  { id: 'run', label: 'Run', icon: <IconPlay size={20} /> },
  { id: 'console', label: 'Console', icon: <IconChatBubble size={20} /> },
  { id: 'tools', label: 'Tools', icon: <IconTools size={20} /> },
];

export const MobileSidebar: React.FC<MobileSidebarProps> = (props) => {
  const { undo, redo, clearConsole } = useFlow();
  const choose = (view: MobileViewId) => { props.onSelectView(view); props.onClose(); };
  const action = (fn: () => void) => { fn(); props.onClose(); };
  const item = (label: string, icon: React.ReactNode, fn: () => void, disabled = false) => (
    <button key={label} type="button" className="m2-drawer__item" disabled={disabled} onClick={() => action(fn)}>
      <span className="m2-drawer__item-icon">{icon}</span><span>{label}</span>
    </button>
  );

  return (
    <M2Drawer open={props.open} onClose={props.onClose}>
      <header className="m2-drawer__header">
        <span>Flowonline2</span>
        <M2IconButton aria-label="Close navigation drawer" onClick={props.onClose}><M2CloseIcon size={20} /></M2IconButton>
      </header>
      <nav className="m2-drawer__nav" aria-label="Mobile sections">
        {sections.map((section) => <button key={section.id} type="button" className={`m2-drawer__item ${props.view === section.id ? 'is-active' : ''}`} onClick={() => choose(section.id)}><span className="m2-drawer__item-icon">{section.icon}</span><span>{section.label}</span></button>)}
        <div className="m2-section-label">File</div>
        {item('New program', <IconDocument size={20} />, props.onNew)}
        {item('Open file', <IconFolderOpen size={20} />, props.onOpenFile)}
        {item('Save FPRG', <IconSave size={20} />, props.onSave)}
        {item('Backup JSON', <IconInbox size={20} />, props.onBackupJson)}
        <div className="m2-section-label">Export</div>
        {item('Export SVG', <IconPalette size={20} />, props.onExportSvg)}
        {item('Export PNG', <IconInbox size={20} />, props.onExportPng)}
        {item('Export PDF', <IconBooks size={20} />, props.onExportPdf)}
        <div className="m2-section-label">Edit</div>
        {item('Undo', <IconRefresh size={20} />, () => undo?.(), !props.canUndo)}
        {item('Redo', <IconRefresh size={20} />, () => redo?.(), !props.canRedo)}
        <div className="m2-section-label">Storage</div>
        {item('Clear localStorage', <IconTrash size={20} />, props.onClearLocalStorage)}
        <div className="m2-section-label">Help</div>
        {item('About & License', <IconInfo size={20} />, props.onShowAbout)}
        {item('User Manual', <IconBooks size={20} />, props.onShowManual)}
        {item('Changelog', <IconBooks size={20} />, props.onShowChangelog)}
        {item('Security Policy', <IconShield size={20} />, props.onShowSecurity)}
        {item('Privacy Policy', <IconLock size={20} />, props.onShowPrivacy)}
        {item('Disclaimer', <IconBookmarkTabs size={20} />, props.onShowDisclaimer)}
        {item('Report a Bug', <IconWarning size={20} />, props.onBugReport)}
        {item('Feature Request', <IconInbox size={20} />, props.onFeatureRequest)}
        {item('Fork & Contribute', <IconGlobe size={20} />, props.onForkContribute)}
        {item('Select Language', <IconGlobe size={20} />, props.onPickLanguage)}
        {item('Clear Console', <IconTrash size={20} />, () => clearConsole?.())}
      </nav>
    </M2Drawer>
  );
};
