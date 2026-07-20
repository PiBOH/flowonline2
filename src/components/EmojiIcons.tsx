import React from 'react';

// Reusable SVG icon components replacing platform-dependent emoji.
// Each icon is 16x16 viewBox, rendered inline with currentColor for theming.

interface IconProps { size?: number; className?: string; }

const Svg: React.FC<{ children: React.ReactNode; size?: number; className?: string; viewBox?: string }> = ({ children, size = 16, className = '', viewBox = '0 0 16 16' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    {children}
  </svg>
);

export const IconChatBubble:   React.FC<IconProps> = (p) => <Svg {...p}><path d="M2 2h12v9H5l-3 3V2z" fill="currentColor" fillOpacity="0.15" strokeWidth="1.2"/></Svg>;
export const IconFolderOpen:   React.FC<IconProps> = (p) => <Svg {...p}><path d="M1 13V4a1 1 0 011-1h4l2 2h6a1 1 0 011 1v2M2 13l1.5-7h11L13 13H2z" strokeWidth="1.2"/></Svg>;
export const IconBooks:        React.FC<IconProps> = (p) => <Svg {...p}><path d="M4 2h5l1 1h4v8H4a2 2 0 010-4V2z" strokeWidth="1.2"/><path d="M4 13h10V5" strokeWidth="1" opacity="0.6"/></Svg>;
export const IconPalette:      React.FC<IconProps> = (p) => <Svg {...p}><circle cx="8" cy="8" r="6.5" strokeWidth="1.2"/><path d="M8 2a6 6 0 00-6 6c0 3 2 4.5 4 4.5h4c2 0 4-1.5 4-4.5A6 6 0 008 2z"/><circle cx="5.5" cy="7" r="1" fill="currentColor"/><circle cx="10.5" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="10" r="1.2" fill="currentColor"/></Svg>;
export const IconRefresh:      React.FC<IconProps> = (p) => <Svg {...p}><path d="M1 4v4h4M15 12v-4h-4"/><path d="M13.5 5.5A6 6 0 003.5 7M2.5 10.5a6 6 0 0010 1.5" strokeWidth="1.3"/></Svg>;
export const IconMagnifier:    React.FC<IconProps> = (p) => <Svg {...p}><circle cx="6.5" cy="6.5" r="5" strokeWidth="1.3"/><path d="M10.5 10.5L15 15" strokeWidth="1.5"/></Svg>;
export const IconPlus:         React.FC<IconProps> = (p) => <Svg {...p}><path d="M8 3v10M3 8h10" strokeWidth="2"/></Svg>;
export const IconClose:        React.FC<IconProps> = (p) => <Svg {...p}><path d="M3 3l10 10M13 3L3 13" strokeWidth="2"/></Svg>;
export const IconMinimize:     React.FC<IconProps> = (p) => <Svg {...p}><path d="M3 12h10" strokeWidth="2"/></Svg>;
export const IconMaximize:     React.FC<IconProps> = (p) => <Svg {...p}><rect x="2" y="2" width="12" height="12" rx="1" strokeWidth="1.5"/></Svg>;
export const IconWarning:      React.FC<IconProps> = (p) => <Svg {...p}><path d="M8 2L1 14h14L8 2z" strokeWidth="1.3"/><path d="M8 7v3M8 12h0" strokeWidth="2"/></Svg>;
export const IconError:        React.FC<IconProps> = (p) => <Svg {...p}><circle cx="8" cy="8" r="6.5" strokeWidth="1.3"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" strokeWidth="1.8"/></Svg>;
export const IconClipboard:    React.FC<IconProps> = (p) => <Svg {...p}><rect x="4" y="2" width="8" height="12" rx="1" strokeWidth="1.2"/><path d="M6 2h4a1 1 0 011 1v0a1 1 0 01-1 1H6a1 1 0 01-1-1v0a1 1 0 011-1z" strokeWidth="1.1"/><path d="M6 8h4M6 10.5h3" strokeWidth="1.3"/></Svg>;
export const IconTrash:        React.FC<IconProps> = (p) => <Svg {...p}><path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M3 4l1 10h8l1-10" strokeWidth="1.2"/></Svg>;
export const IconSave:         React.FC<IconProps> = (p) => <Svg {...p}><path d="M2 14V2h8l4 4v8a1 1 0 01-1 1H3a1 1 0 01-1-1z" strokeWidth="1.2"/><path d="M10 2v4h4M9 11a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="1.2"/></Svg>;
export const IconDocument:     React.FC<IconProps> = (p) => <Svg {...p}><path d="M4 1h6l4 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z" strokeWidth="1.2"/><path d="M10 1v4h4M5 8h6M5 11h4" strokeWidth="1.2"/></Svg>;
export const IconGlobe:        React.FC<IconProps> = (p) => <Svg {...p}><circle cx="8" cy="8" r="6.5" strokeWidth="1.2"/><ellipse cx="8" cy="8" rx="3" ry="6.5" strokeWidth="1"/><path d="M1.5 8h13M8 1.5v13" strokeWidth="1"/></Svg>;
export const IconInfo:         React.FC<IconProps> = (p) => <Svg {...p}><circle cx="8" cy="8" r="6.5" strokeWidth="1.3"/><path d="M8 7v4M8 5h0" strokeWidth="2"/></Svg>;
export const IconQuestion:     React.FC<IconProps> = (p) => <Svg {...p}><circle cx="8" cy="8" r="6.5" strokeWidth="1.3"/><path d="M6.5 6a2 2 0 013 1.5c0 1.5-2 2-2 3.5M8 12.5h0" strokeWidth="1.8"/></Svg>;
export const IconChart:        React.FC<IconProps> = (p) => <Svg {...p}><rect x="1" y="8" width="3" height="6" rx="0.5" strokeWidth="1.2"/><rect x="6.5" y="4" width="3" height="10" rx="0.5" strokeWidth="1.2"/><rect x="12" y="5" width="3" height="9" rx="0.5" strokeWidth="1.2"/></Svg>;
export const IdeaLightbulb:    React.FC<IconProps> = (p) => <Svg {...p}><path d="M6 13h4M6 14.5h4" strokeWidth="1.3"/><path d="M5 7a3 3 0 016 0c0 2.5-2 3-2 5H7c0-2-2-2.5-2-5z" strokeWidth="1.2"/></Svg>;
export const IconWrench:       React.FC<IconProps> = (p) => <Svg {...p}><path d="M13.5 13.5L10 10M4 7a3 3 0 015-2.2L7 7l1.2 1.2L11 6a3 3 0 01-4 4" strokeWidth="1.3"/></Svg>;
export const IconScissors:     React.FC<IconProps> = (p) => <Svg {...p}><circle cx="6" cy="5" r="2" strokeWidth="1.2"/><circle cx="6" cy="11" r="2" strokeWidth="1.2"/><path d="M7.5 6l6.5 7M7.5 10l6.5-7" strokeWidth="1.3"/></Svg>;
export const IconInbox:        React.FC<IconProps> = (p) => <Svg {...p}><polyline points="14 2 2 2 2 14 14 14 14 2" strokeWidth="1.2"/><path d="M2 7l5 3h2l5-3" strokeWidth="1.2"/></Svg>;
export const IconPencil:       React.FC<IconProps> = (p) => <Svg {...p}><path d="M11 2L2 11v3h3l9-9-3-3zM14 5l3-3" strokeWidth="1.3"/></Svg>;
export const IconCode:         React.FC<IconProps> = (p) => <Svg {...p}><polyline points="5 5 1 8 5 11" strokeWidth="1.3"/><polyline points="11 5 15 8 11 11" strokeWidth="1.3"/><line x1="9" y1="3" x2="7" y2="13" strokeWidth="1.3"/></Svg>;
