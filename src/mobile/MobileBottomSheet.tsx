import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Reusable iOS / Material 3-style bottom sheet.
 *
 * - Snap points (percent of viewport height, e.g. ['30%', '60%', '90%']).
 * - Backdrop tap closes; swipe-down past threshold closes.
 * - Renders via portal so it sits above the topbar (z-30) and tabbar (z-40).
 * - Touch-action: none inside sheet so vertical drag doesn't scroll underlying view.
 */
export interface MobileBottomSheetProps {
  open: boolean;
  onClose: () => void;
  snapPoints?: string[]; // e.g. ['40%', '85%']
  initialSnap?: number;
  title?: string;
  showHandle?: boolean;
  dismissThreshold?: number; // px swipe-down to close (default 80)
  children: React.ReactNode;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  open,
  onClose,
  snapPoints = ['50%'],
  initialSnap = 0,
  title,
  showHandle = true,
  dismissThreshold = 80,
  children,
}) => {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [dragY, setDragY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Reset drag offset whenever the sheet opens or snap changes
  useEffect(() => {
    if (open) {
      setCurrentSnap(initialSnap);
      setDragY(0);
    }
  }, [open, initialSnap]);

  // Close on Escape (desktop debugging)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (dy > 0) setDragY(dy); // only downward drag offset
  };
  const onTouchEnd = () => {
    if (dragY > dismissThreshold) {
      onClose();
    } else {
      setDragY(0);
    }
    touchStartY.current = null;
  };

  if (!open) return null;

  // Parse percent to pixels for translateY (closed = bottom 0 = 100% down)
  const currentHeight = snapPoints[Math.min(currentSnap, snapPoints.length - 1)];
  const sheetTranslateY = `calc(100% - ${currentHeight} + ${dragY}px)`;

  return createPortal(
    <>
      <div
        className="m-sheet-backdrop open"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        className="m-sheet"
        style={{ transform: `translateY(${sheetTranslateY})` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {showHandle && <div className="m-sheet-handle" />}
        {title && (
          <div className="m-sheet-header">
            <span>{title}</span>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                color: '#64748b',
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        <div className="m-sheet-body">{children}</div>
      </div>
    </>,
    document.body
  );
};
