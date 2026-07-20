import React from 'react';

// ============================================================
// COLORFUL SVG ICONS — Emoji-like appearance with fixed colors
// ============================================================

interface IconProps { size?: number; className?: string; }

const SvgIcon: React.FC<{ children: React.ReactNode; size?: number; className?: string; viewBox?: string }> = ({ children, size = 16, className = '', viewBox = '0 0 16 16' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" className={className} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    {children}
  </svg>
);

// ── Chat Bubble (💬) ──
export const IconChatBubble: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <rect x="1.5" y="1.5" width="13" height="9" rx="2" fill="#4CAF50" stroke="#2E7D32" strokeWidth="0.8"/>
    <path d="M5 13l-2.5 2.5V10.5H5" fill="#4CAF50" stroke="#2E7D32" strokeWidth="0.8"/>
  </SvgIcon>
);

// ── Folder (📂) ──
export const IconFolderOpen: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <path d="M1 13V4a1 1 0 011-1h4l2 2h6a1 1 0 011 1v2" fill="#FFB300" stroke="#E65100" strokeWidth="0.8"/>
    <path d="M2 13l1.5-7h11L13 13H2z" fill="#FFC107" stroke="#E65100" strokeWidth="0.8"/>
  </SvgIcon>
);

// ── Books (📚) ──
export const IconBooks: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <rect x="4" y="1" width="6" height="12" rx="1" fill="#42A5F5" stroke="#1565C0" strokeWidth="0.8"/>
    <rect x="3" y="2" width="6" height="10" rx="1" fill="#EF5350" stroke="#B71C1C" strokeWidth="0.7"/>
    <rect x="5" y="3" width="6" height="9" rx="1" fill="#66BB6A" stroke="#1B5E20" strokeWidth="0.7"/>
  </SvgIcon>
);

// ── Palette (🎨) ──
export const IconPalette: React.FC<IconProps> = (p) => (
  <SvgIcon {...p} viewBox="0 0 18 18">
    <path d="M9 2A7 7 0 003 9c0 3.5 2 5.5 4 5.5h4c2 0 4-2 4-5.5A7 7 0 009 2z" fill="#AB47BC" stroke="#4A148C" strokeWidth="0.8"/>
    <circle cx="6" cy="8" r="1.2" fill="#F44336"/>
    <circle cx="12" cy="7" r="1.2" fill="#2196F3"/>
    <circle cx="10" cy="11.5" r="1.4" fill="#4CAF50"/>
    <circle cx="7.5" cy="5" r="1" fill="#FF9800"/>
  </SvgIcon>
);

// ── Refresh (🔄) ──
export const IconRefresh: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <path d="M1 4v4h4M15 12v-4h-4" stroke="#2E7D32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.5 5.5A6 6 0 003.5 7M2.5 10.5a6 6 0 0010 1.5" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </SvgIcon>
);

// ── Magnifier (🔍) ──
export const IconMagnifier: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="6.5" cy="6.5" r="5" fill="#BBDEFB" stroke="#1565C0" strokeWidth="1"/>
    <path d="M10.5 10.5L15 15" stroke="#424242" strokeWidth="2" strokeLinecap="round"/>
    <line x1="6.5" y1="3.5" x2="6.5" y2="9.5" stroke="#1565C0" strokeWidth="1.5"/>
    <line x1="3.5" y1="6.5" x2="9.5" y2="6.5" stroke="#1565C0" strokeWidth="1.5"/>
  </SvgIcon>
);

// ── Plus (➕) ──
export const IconPlus: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="8" cy="8" r="7" fill="#4CAF50" stroke="#1B5E20" strokeWidth="0.8"/>
    <line x1="4" y1="8" x2="12" y2="8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="8" y1="4" x2="8" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Close (✕) — Windows 10/11 title bar style (red on hover) ──
export const IconClose: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Minimize (─) — Windows 10/11 title bar style ──
export const IconMinimize: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <line x1="3" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Maximize (▢) — Windows 10/11 title bar style ──
export const IconMaximize: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </SvgIcon>
);

// ── Warning (⚠️) ──
export const IconWarning: React.FC<IconProps> = (p) => (
  <SvgIcon {...p} viewBox="0 0 18 18">
    <path d="M9 2L1 16h16L9 2z" fill="#FFC107" stroke="#F57F17" strokeWidth="0.8"/>
    <line x1="9" y1="7" x2="9" y2="11.5" stroke="#424242" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="9" cy="14" r="1" fill="#424242"/>
  </SvgIcon>
);

// ── Error (❌) ──
export const IconError: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="8" cy="8" r="7" fill="#F44336" stroke="#B71C1C" strokeWidth="0.8"/>
    <line x1="5" y1="5" x2="11" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <line x1="11" y1="5" x2="5" y2="11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Clipboard (📋) ──
export const IconClipboard: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <rect x="4" y="2" width="8" height="12" rx="1" fill="#FFE0B2" stroke="#BF360C" strokeWidth="0.8"/>
    <rect x="6" y="1" width="4" height="2.5" rx="0.7" fill="#BCAAA4" stroke="#5D4037" strokeWidth="0.6"/>
    <line x1="6" y1="7.5" x2="10" y2="7.5" stroke="#795548" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="6" y1="10" x2="9" y2="10" stroke="#795548" strokeWidth="1.5" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Trash (🗑️) ──
export const IconTrash: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <rect x="3" y="1.5" width="10" height="2" rx="0.5" fill="#BDBDBD" stroke="#757575" strokeWidth="0.5"/>
    <path d="M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" fill="#EF5350" stroke="#B71C1C" strokeWidth="0.7"/>
    <line x1="7" y1="6.5" x2="7" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="9" y1="6.5" x2="9" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Save / Floppy Disk (💾) ──
export const IconSave: React.FC<IconProps> = (p) => (
  <SvgIcon {...p} viewBox="0 0 16 16">
    <path d="M14.5 2.5L13.5 1.5H3v4.5h7V2l2.5 2.5V13H3V1.5" fill="#64798A" stroke="#3A556A" strokeWidth="0.5"/>
    <rect x="2" y="7" width="12" height="7" rx="0.5" fill="white" stroke="#64798A" strokeWidth="0.3"/>
    <rect x="3.5" y="8.5" width="9" height="1" rx="0.3" fill="#EBF0F3"/>
    <rect x="3.5" y="10" width="9" height="1" rx="0.3" fill="#EBF0F3"/>
    <rect x="3.5" y="11.5" width="9" height="1" rx="0.3" fill="#EBF0F3"/>
    <rect x="10" y="2" width="2" height="3" rx="0.2" fill="#3A556A"/>
  </SvgIcon>
);

// ── Document (📄) ──
export const IconDocument: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <path d="M4 0.5h6l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V1.5a1 1 0 011-1z" fill="#FAFAFA" stroke="#616161" strokeWidth="0.8"/>
    <path d="M10 0.5v4h4" fill="#BBDEFB" stroke="#1565C0" strokeWidth="0.6"/>
    <line x1="5" y1="8" x2="11" y2="8" stroke="#9E9E9E" strokeWidth="1" strokeLinecap="round"/>
    <line x1="5" y1="10.5" x2="9" y2="10.5" stroke="#9E9E9E" strokeWidth="1" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Globe (🌐) ──
export const IconGlobe: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="8" cy="8" r="6.5" fill="#BBDEFB" stroke="#1565C0" strokeWidth="0.8"/>
    <ellipse cx="8" cy="8" rx="3" ry="6.5" fill="#90CAF9" stroke="#1565C0" strokeWidth="0.5"/>
    <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="#1565C0" strokeWidth="0.8"/>
    <line x1="8" y1="1.5" x2="8" y2="14.5" stroke="#1565C0" strokeWidth="0.8"/>
    <circle cx="8" cy="8" r="1.5" fill="#4CAF50"/>
  </SvgIcon>
);

// ── Info (ℹ️) ──
export const IconInfo: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="8" cy="8" r="7" fill="#42A5F5" stroke="#0D47A1" strokeWidth="0.8"/>
    <circle cx="8" cy="4.5" r="1.2" fill="white"/>
    <rect x="6.5" y="6.5" width="3" height="6" rx="1" fill="white"/>
  </SvgIcon>
);

// ── Question (❓) ──
export const IconQuestion: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="8" cy="8" r="7" fill="#42A5F5" stroke="#0D47A1" strokeWidth="0.8"/>
    <path d="M6 5.5a2.5 2.5 0 014 2c0 2-2.5 2.5-2.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="8" cy="12.5" r="1.2" fill="white"/>
  </SvgIcon>
);

// ── Chart (📊) ──
export const IconChart: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <rect x="1.5" y="8" width="3" height="6.5" rx="0.5" fill="#F44336" stroke="#B71C1C" strokeWidth="0.5"/>
    <rect x="6.5" y="4" width="3" height="10.5" rx="0.5" fill="#4CAF50" stroke="#1B5E20" strokeWidth="0.5"/>
    <rect x="11.5" y="5" width="3" height="9.5" rx="0.5" fill="#2196F3" stroke="#0D47A1" strokeWidth="0.5"/>
  </SvgIcon>
);

// ── Lightbulb (💡) ──
export const IdeaLightbulb: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <path d="M5 5a3.5 3.5 0 016 0c0 3-2.5 3.5-2.5 6h-1c0-2.5 2.5-3 2.5-6a2.5 2.5 0 00-4 0" fill="#FFEE58" stroke="#F57F17" strokeWidth="0.8"/>
    <line x1="5.5" y1="13" x2="10.5" y2="13" stroke="#795548" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="6" y1="14.5" x2="10" y2="14.5" stroke="#795548" strokeWidth="1" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Wrench (🔧) ──
export const IconWrench: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <path d="M13.5 13.5L10 10M4 7a3 3 0 015-2.2L7 7l1.2 1.2L11 6a3 3 0 01-4 4" fill="#BDBDBD" stroke="#424242" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </SvgIcon>
);

// ── Scissors (✂️) ──
export const IconScissors: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="5" cy="5" r="2" fill="#EF5350" stroke="#B71C1C" strokeWidth="0.7"/>
    <circle cx="5" cy="11" r="2" fill="#EF5350" stroke="#B71C1C" strokeWidth="0.7"/>
    <line x1="6.5" y1="6" x2="14" y2="13.5" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="6.5" y1="10" x2="14" y2="2.5" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Inbox (📥) ──
export const IconInbox: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <rect x="1.5" y="2" width="13" height="12" rx="1.5" fill="#C8E6C9" stroke="#1B5E20" strokeWidth="0.8"/>
    <path d="M1.5 7l5.5 3h2l5.5-3" fill="#81C784" stroke="#2E7D32" strokeWidth="0.7"/>
    <line x1="8" y1="5" x2="8" y2="9" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round"/>
    <polyline points="5.5,7 8,9.5 10.5,7" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </SvgIcon>
);

// ── Pencil (📝) ──
export const IconPencil: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <path d="M11 1L1.5 10.5v3h3L14 3.5 11 1z" fill="#FFE082" stroke="#F57F17" strokeWidth="0.8"/>
    <path d="M13.5 4.5l2-2" stroke="#F57F17" strokeWidth="1.5" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Code (💻) ──
export const IconCode: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <polyline points="5,5 1,8 5,11" fill="none" stroke="#9C27B0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="11,5 15,8 11,11" fill="none" stroke="#9C27B0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="9" y1="3" x2="7" y2="13" stroke="#E91E63" strokeWidth="1.8" strokeLinecap="round"/>
  </SvgIcon>
);

// ── Play (▶) ──
export const IconPlay: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="8" cy="8" r="7" fill="#4CAF50" stroke="#1B5E20" strokeWidth="0.8"/>
    <polygon points="5.5,4 5.5,12 12.5,8" fill="white"/>
  </SvgIcon>
);

// ── Step (⏭) ──
export const IconStep: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="8" cy="8" r="7" fill="#2196F3" stroke="#0D47A1" strokeWidth="0.8"/>
    <polygon points="4.5,4 4.5,12 9.5,8" fill="white"/>
    <rect x="10" y="4" width="2.5" height="8" rx="0.5" fill="white"/>
  </SvgIcon>
);

// ── Pause (⏸) ──
export const IconPause: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="8" cy="8" r="7" fill="#FF9800" stroke="#E65100" strokeWidth="0.8"/>
    <rect x="4.5" y="4" width="2.5" height="8" rx="0.8" fill="white"/>
    <rect x="9" y="4" width="2.5" height="8" rx="0.8" fill="white"/>
  </SvgIcon>
);

// ── Stop (⏹) ──
export const IconStop: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <circle cx="8" cy="8" r="7" fill="#F44336" stroke="#B71C1C" strokeWidth="0.8"/>
    <rect x="4" y="4" width="8" height="8" rx="1.5" fill="white"/>
  </SvgIcon>
);

// ── Monitor (🖥️) ──
export const IconMonitor: React.FC<IconProps> = (p) => (
  <SvgIcon {...p}>
    <rect x="1" y="1" width="14" height="10" rx="1.5" fill="#37474F" stroke="#263238" strokeWidth="0.8"/>
    <rect x="2" y="2" width="12" height="8" rx="0.5" fill="#42A5F5"/>
    <rect x="5" y="11" width="6" height="1.5" rx="0.5" fill="#616161"/>
    <rect x="7" y="12.5" width="2" height="2" rx="0.3" fill="#9E9E9E"/>
  </SvgIcon>
);

// ============================================================
// COUNTRY FLAGS — SVG simplified representations
// ============================================================

interface FlagProps { size?: number; className?: string; }

// Helper: horizontal tricolor flag
const FlagTriH: React.FC<{ c1: string; c2: string; c3: string } & FlagProps> = ({ c1, c2, c3, size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 12" className={className} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="4" fill={c1}/>
    <rect x="0" y="4" width="16" height="4" fill={c2}/>
    <rect x="0" y="8" width="16" height="4" fill={c3}/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// Helper: vertical tricolor flag
const FlagTriV: React.FC<{ c1: string; c2: string; c3: string } & FlagProps> = ({ c1, c2, c3, size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 12" className={className} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="5.33" height="12" fill={c1}/>
    <rect x="5.33" y="0" width="5.33" height="12" fill={c2}/>
    <rect x="10.66" y="0" width="5.34" height="12" fill={c3}/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// Helper: bicolor horizontal
const FlagBiH: React.FC<{ c1: string; c2: string } & FlagProps> = ({ c1, c2, size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 12" className={className} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="6" fill={c1}/>
    <rect x="0" y="6" width="16" height="6" fill={c2}/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// Helper: bicolor vertical
const FlagBiV: React.FC<{ c1: string; c2: string } & FlagProps> = ({ c1, c2, size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 12" className={className} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="8" height="12" fill={c1}/>
    <rect x="8" y="0" width="8" height="12" fill={c2}/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// Helper: single color with circle
const FlagCircle: React.FC<{ bg: string; circle: string } & FlagProps> = ({ bg, circle, size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 12" className={className} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill={bg}/>
    <circle cx="8" cy="6" r="2.5" fill={circle}/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// Helper: 5-stripe horizontal (Thailand)
const Flag5H: React.FC<{ c1: string; c2: string; c3: string } & FlagProps> = ({ c1, c2, c3, size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 16 12" className={className} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="2" fill={c1}/>
    <rect x="0" y="2" width="16" height="2" fill={c2}/>
    <rect x="0" y="4" width="16" height="4" fill={c3}/>
    <rect x="0" y="8" width="16" height="2" fill={c2}/>
    <rect x="0" y="10" width="16" height="2" fill={c1}/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// USA flag (simplified stars & stripes)
export const FlagUS: React.FC<FlagProps> = (p) => (
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 12" className={p.className || ''} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="1.33" fill="#B71C1C"/><rect x="0" y="1.33" width="16" height="1.33" fill="white"/>
    <rect x="0" y="2.66" width="16" height="1.33" fill="#B71C1C"/><rect x="0" y="4" width="16" height="1.33" fill="white"/>
    <rect x="0" y="5.33" width="16" height="1.33" fill="#B71C1C"/><rect x="0" y="6.66" width="16" height="1.33" fill="white"/>
    <rect x="0" y="8" width="16" height="1.33" fill="#B71C1C"/><rect x="0" y="9.33" width="16" height="1.33" fill="white"/>
    <rect x="0" y="10.66" width="16" height="1.34" fill="#B71C1C"/>
    <rect x="0" y="0" width="6.8" height="5.33" fill="#0D47A1"/>
    {[1,2,3,4].flatMap(r => [1,3,5].map(c => <circle key={`${r}-${c}`} cx={c*1.1+0.3} cy={r*1.1-0.1} r="0.35" fill="white"/>))}
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// UK union jack (simplified)
export const FlagGB: React.FC<FlagProps> = (p) => (
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 12" className={p.className || ''} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="#0D47A1"/>
    <polygon points="0,0 16,12 14,12 0,2" fill="white"/>
    <polygon points="16,0 0,12 2,12 16,2" fill="white"/>
    <polygon points="6,0 10,0 10,12 6,12" fill="white"/>
    <polygon points="0,4 16,4 16,8 0,8" fill="white"/>
    <polygon points="7,0 9,0 9,12 7,12" fill="#B71C1C"/>
    <polygon points="0,5 16,5 16,7 0,7" fill="#B71C1C"/>
    <polygon points="0,0 8,6 7,6 0,1" fill="#B71C1C"/>
    <polygon points="16,0 8,6 9,6 16,1" fill="#B71C1C"/>
    <polygon points="0,12 8,6 7,6 0,11" fill="#B71C1C"/>
    <polygon points="16,12 8,6 9,6 16,11" fill="#B71C1C"/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// Spain (simplified)
export const FlagES: React.FC<FlagProps> = (p) => (
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 12" className={p.className || ''} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="3" fill="#C62828"/>
    <rect x="0" y="3" width="16" height="6" fill="#FFC107"/>
    <rect x="0" y="9" width="16" height="3" fill="#C62828"/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// China (simplified)
export const FlagCN: React.FC<FlagProps> = (p) => (
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 12" className={p.className || ''} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="#D32F2F"/>
    <polygon points="4,3 4.6,5 6.7,5 5,6.2 5.7,8.2 4,7 2.3,8.2 3,6.2 1.3,5 3.4,5" fill="#FFEB3B" transform="scale(0.7) translate(2,1)"/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// Japan
export const FlagJP: React.FC<FlagProps> = (p) => <FlagCircle bg="#FAFAFA" circle="#D32F2F" {...p}/>;

// Israel
export const FlagIL: React.FC<FlagProps> = (p) => (
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 12" className={p.className || ''} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="2.5" fill="#1565C0"/>
    <rect x="0" y="2.5" width="16" height="7" fill="white"/>
    <rect x="0" y="9.5" width="16" height="2.5" fill="#1565C0"/>
    <polygon points="8,3.5 9.2,6 12,6 9.8,7.8 10.8,10.5 8,8.5 5.2,10.5 6.2,7.8 4,6 6.8,6" fill="#1565C0" transform="scale(0.6) translate(5.5,2)"/>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// Saudi Arabia (simplified green)
export const FlagSA: React.FC<FlagProps> = (p) => (
  <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 12" className={p.className || ''} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="#1B5E20"/>
    <text x="8" y="8" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white">ﷲ</text>
    <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
  </svg>
);

// Maps country codes to flag components
const FLAG_MAP: Record<string, React.FC<FlagProps>> = {
  en: FlagUS,
  en_GB: FlagGB,
  it: (p) => <FlagTriV c1="#4CAF50" c2="white" c3="#D32F2F" {...p}/>,
  de: (p) => <FlagTriH c1="#212121" c2="#D32F2F" c3="#FFC107" {...p}/>,
  fr: (p) => <FlagTriV c1="#1565C0" c2="white" c3="#D32F2F" {...p}/>,
  es: FlagES,
  zh: FlagCN,
  nl: (p) => <FlagTriH c1="#D32F2F" c2="white" c3="#1565C0" {...p}/>,
  pt: (p) => <FlagBiV c1="#1B5E20" c2="#D32F2F" {...p}/>,
  gl: FlagES, // Galicia uses Spain flag
  ru: (p) => <FlagTriH c1="white" c2="#1565C0" c3="#D32F2F" {...p}/>,
  uk: (p) => <FlagBiH c1="#1565C0" c2="#FFC107" {...p}/>,
  cs: (p) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 16 12" className={p.className || ''} style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="0" y="0" width="16" height="6" fill="white"/>
      <rect x="0" y="6" width="16" height="6" fill="#D32F2F"/>
      <polygon points="0,0 7,6 0,12" fill="#1565C0"/>
      <rect x="0" y="0" width="16" height="12" rx="0.5" fill="none" stroke="#999" strokeWidth="0.5"/>
    </svg>
  ),
  pl: (p) => <FlagBiH c1="white" c2="#D32F2F" {...p}/>, // Poland (white/red)
  hu: (p) => <FlagTriH c1="#D32F2F" c2="white" c3="#2E7D32" {...p}/>,
  sl: (p) => <FlagTriH c1="white" c2="#1565C0" c3="#D32F2F" {...p}/>,
  ja: FlagJP,
  th: (p) => <Flag5H c1="#D32F2F" c2="white" c3="#1565C0" {...p}/>,
  id: (p) => <FlagBiH c1="#D32F2F" c2="white" {...p}/>,
  mn: (p) => <FlagTriV c1="#D32F2F" c2="#1565C0" c3="#D32F2F" {...p}/>,
  ar: FlagSA,
  he: FlagIL,
  fa: (p) => <FlagTriH c1="#2E7D32" c2="white" c3="#D32F2F" {...p}/>,
};

// Generic FlagIcon component
export const FlagIcon: React.FC<{ code: string; size?: number; className?: string }> = ({ code, size = 16, className = '' }) => {
  const Flag = FLAG_MAP[code];
  if (!Flag) return <IconGlobe size={size} className={className}/>;
  return <Flag size={size} className={className}/>;
};
