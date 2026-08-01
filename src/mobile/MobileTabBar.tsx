import React, { useRef, useEffect } from 'react';
import { IconChart, IconPencil, IconPlay, IconChatBubble, IconTools } from '../components/EmojiIcons';

export type MobileTabId = 'canvas' | 'edit' | 'run' | 'console' | 'tools';

export interface MobileTabBarProps {
  active: MobileTabId;
  onChange: (tab: MobileTabId) => void;
}

interface TabDef {
  id: MobileTabId;
  label: string;
  Icon: React.FC<{ size?: number; className?: string }>;
}

/**
 * Mobile-only bottom navigation rail (Phase 3 rewrite).
 *
 * 5-column grid, glassy backdrop, 72px tall + safe-area bottom inset.
 * Each tab is a 24px SVG icon + 11px label. Active tab has an accent
 * indicator (3px tall, top of the column) and accent text color. The
 * indicator's lateral position is animated on tab change so the user
 * gets a smooth horizontal "physical tab" feel.
 *
 * Icons come from the shared `EmojiIcons.tsx` SVG library so they stay
 * crisp and colorful without depending on platform emoji.
 */
const TABS: TabDef[] = [
  { id: 'canvas',  label: 'Canvas',  Icon: IconChart },
  { id: 'edit',    label: 'Edit',    Icon: IconPencil },
  { id: 'run',     label: 'Run',     Icon: IconPlay },
  { id: 'console', label: 'Console', Icon: IconChatBubble },
  { id: 'tools',   label: 'Tools',   Icon: IconTools },
];

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ active, onChange }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Animate the top indicator under the active tab on change.
  useEffect(() => {
    const rail = railRef.current;
    const ind = indicatorRef.current;
    if (!rail || !ind) return;
    const activeBtn = rail.querySelector<HTMLButtonElement>(`[data-tab='${active}']`);
    if (!activeBtn) return;
    const railWidth = rail.clientWidth;
    const colWidth = railWidth / TABS.length;
    const activeIdx = TABS.findIndex((t) => t.id === active);
    const leftPx = activeIdx * colWidth + (colWidth - ind.clientWidth) / 2;
    ind.style.left = `${leftPx}px`;
  }, [active]);

  return (
    <nav ref={railRef} className="m-tabbar" role="tablist" aria-label="Mobile sections">
      <div ref={indicatorRef} className="m-tabbar__indicator" aria-hidden="true" />
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            data-tab={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            className={`m-tabbar__btn ${isActive ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <span className="m-tabbar__icon">
              <tab.Icon size={22} />
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
