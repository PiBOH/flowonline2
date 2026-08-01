import React from 'react';
import { Console } from '../components/Console';

/**
 * Mobile console view (Phase 3 rewrite).
 * Wraps the existing desktop `Console` in a touch-friendly container.
 * The desktop Console is already mobile-tolerable (scrollable chat
 * bubbles + dot animation); we add only safe-area insets.
 */
export const MobileConsoleView: React.FC = () => {
  return (
    <div className="m-view m-safe-bottom" style={{ background: '#fff' }}>
      <Console />
    </div>
  );
};
