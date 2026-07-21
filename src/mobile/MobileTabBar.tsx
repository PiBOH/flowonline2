import React from 'react';

export type MobileTabId = 'canvas' | 'edit' | 'run' | 'console' | 'tools';

export interface MobileTabBarProps {
  active: MobileTabId;
  onChange: (tab: MobileTabId) => void;
}

interface TabDef {
  id: MobileTabId;
  label: string;
  icon: string;
}

const TABS: TabDef[] = [
  { id: 'canvas', label: 'Canvas', icon: '◇' },
  { id: 'edit',   label: 'Edit',   icon: '✎' },
  { id: 'run',    label: 'Run',    icon: '▶' },
  { id: 'console',label: 'Console',icon: '💬' },
  { id: 'tools',  label: 'Tools',  icon: '⚙' },
];

/**
 * Mobile-only bottom tab bar (Material 3 / iOS 17 feel).
 * Active tab → blue-600; inactive → slate-500.
 * 64px tall + safe-bottom inset.
 */
export const MobileTabBar: React.FC<MobileTabBarProps> = ({ active, onChange }) => {
  return (
    <nav className="m-tabbar" role="tablist">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            className={isActive ? 'active' : ''}
            onClick={() => onChange(tab.id)}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
