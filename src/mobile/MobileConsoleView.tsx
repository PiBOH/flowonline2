import React from 'react';
import { Console } from '../components/Console';

/**
 * Mobile console view — wraps the existing desktop `Console` component
 * in a touch-friendly container. Console itself is already mobile-tolerable
 * (just text + chat bubbles), but we provide the .m-view styling so
 * the existing desktop padding is overridden by mobile safe-area.
 */
export const MobileConsoleView: React.FC = () => {
  return (
    <div className="m-view m-safe-bottom">
      <Console />
    </div>
  );
};
