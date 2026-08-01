import React from 'react';
import type { AppLayout, ColorSchemeType } from '../context/FlowContext';
import { useFlow } from '../context/FlowContext';
import { IconDocument, IconGlobe, IconChart, IconInbox, IconBooks, IconTrash, IconInfo, IconWarning } from '../components/EmojiIcons';
import { M2Card } from './Material2';

interface MobileToolsViewProps { onLanguage: () => void; onAbout: () => void; onManual: () => void; onChangelog: () => void; onClearStorage: () => void; onExportSvg: () => void; onExportPng: () => void; onExportPdf: () => void; onBugReport?: () => void; onFeatureRequest?: () => void; onForkContribute?: () => void; }
const COLOR_SCHEMES = ['classic', 'pastel', 'vibrant', 'retro', 'twilight', 'black_white'] as const;
const LAYOUTS: Array<{ value: AppLayout; label: string }> = [{ value: 'flowchart_only', label: 'Canvas only' }, { value: 'flow_console', label: 'Canvas + Console' }, { value: 'flow_variables', label: 'Canvas + Variables' }, { value: 'triple_split', label: 'Triple split' }, { value: 'flow_code', label: 'Canvas + Source code' }];

export const MobileToolsView: React.FC<MobileToolsViewProps> = (props) => {
  const flow = useFlow();



  return (
    <section className="m2-view m2-scroll" aria-label="Mobile tools">
      <M2Card><div className="m2-card__title">Program</div><div style={{ display: 'flex' }}><label className="m2-field"><span>Title</span><input className="m2-input" value={flow.programTitle || ''} onChange={(e) => flow.setProgramTitle(e.target.value)} placeholder="Untitled Program" /></label><label className="m2-field"><span>Author</span><input className="m2-input" value={flow.programAuthor || ''} onChange={(e) => flow.setProgramAuthor(e.target.value)} placeholder="Author" /></label></div></M2Card>
      <M2Card><div className="m2-card__title">Settings</div><button type="button" className="m2-list-item" onClick={props.onLanguage}><span className="m2-list-item__icon"><IconGlobe size={20} /></span><span className="m2-list-item__label">Language</span><span className="m2-list-item__secondary">{flow.language}</span></button><label className="m2-field"><span>Color scheme</span><select className="m2-select" value={flow.colorScheme || 'classic'} onChange={(e) => flow.setColorScheme(e.target.value as ColorSchemeType)}>{COLOR_SCHEMES.map((scheme) => <option key={scheme} value={scheme}>{scheme}</option>)}</select></label><label className="m2-field"><span>Workspace layout</span><select className="m2-select" value={flow.layout || 'triple_split'} onChange={(e) => flow.setLayout(e.target.value as AppLayout)}>{LAYOUTS.map((layout) => <option key={layout.value} value={layout.value}>{layout.label}</option>)}</select></label></M2Card>
      <M2Card><div className="m2-card__title">Export</div><button type="button" className="m2-list-item" onClick={props.onExportSvg}><span className="m2-list-item__icon"><IconChart size={20} /></span><span className="m2-list-item__label">Export SVG</span></button><button type="button" className="m2-list-item" onClick={props.onExportPng}><span className="m2-list-item__icon"><IconInbox size={20} /></span><span className="m2-list-item__label">Export PNG</span></button><button type="button" className="m2-list-item" onClick={props.onExportPdf}><span className="m2-list-item__icon"><IconDocument size={20} /></span><span className="m2-list-item__label">Export PDF</span></button></M2Card>
      <M2Card><div className="m2-card__title">Help</div><button type="button" className="m2-list-item" onClick={props.onAbout}><span className="m2-list-item__icon"><IconInfo size={20} /></span><span className="m2-list-item__label">About & License</span></button><button type="button" className="m2-list-item" onClick={props.onManual}><span className="m2-list-item__icon"><IconBooks size={20} /></span><span className="m2-list-item__label">User Manual</span></button><button type="button" className="m2-list-item" onClick={props.onChangelog}><span className="m2-list-item__icon"><IconBooks size={20} /></span><span className="m2-list-item__label">Changelog</span></button><button type="button" className="m2-list-item" onClick={props.onBugReport}><span className="m2-list-item__icon"><IconWarning size={20} /></span><span className="m2-list-item__label">Report a Bug</span></button><button type="button" className="m2-list-item" onClick={props.onFeatureRequest}><span className="m2-list-item__icon"><IconInbox size={20} /></span><span className="m2-list-item__label">Feature Request</span></button><button type="button" className="m2-list-item" onClick={props.onForkContribute}><span className="m2-list-item__icon"><IconGlobe size={20} /></span><span className="m2-list-item__label">Fork & Contribute</span></button></M2Card>
      <M2Card><div className="m2-card__title">Storage</div><button type="button" className="m2-list-item" onClick={props.onClearStorage}><span className="m2-list-item__icon"><IconTrash size={20} /></span><span className="m2-list-item__label">Clear localStorage</span></button></M2Card>

    </section>
  );
};
