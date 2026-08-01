import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IconInfo, IconWarning, IconError, IconQuestion, IconClose } from './EmojiIcons';

export interface WinUIDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  children?: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'confirm';
  onOk?: () => void;
  onCancel?: () => void;
  okLabel?: string;
  cancelLabel?: string;
  defaultWidth?: number;
  defaultHeight?: number;
}

export const WinUIDialog: React.FC<WinUIDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  children,
  type = 'info',
  onOk,
  onCancel,
  okLabel = 'OK',
  cancelLabel = 'Cancel',
  defaultWidth = 420,
  defaultHeight = 200,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number; pointerId: number }>({ startX: 0, startY: 0, posX: 0, posY: 0, pointerId: -1 });
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number; pointerId: number }>({ startX: 0, startY: 0, startW: defaultWidth, startH: defaultHeight, pointerId: -1 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const isRotatedMobileSurface = typeof document !== 'undefined' && Boolean(document.querySelector('.desktop-mobile-mode'));

  // The rotated mobile surface has logical landscape dimensions: its local
  // width is the physical viewport height and its local height is the physical
  // viewport width. Use those dimensions only for dialogs inside that surface.
  useEffect(() => {
    if (isOpen) {
      const viewportWidth = isRotatedMobileSurface ? window.innerHeight : window.innerWidth;
      const viewportHeight = isRotatedMobileSurface ? window.innerWidth : window.innerHeight;
      const width = Math.min(defaultWidth, Math.max(300, viewportWidth - 16));
      const height = Math.min(defaultHeight, Math.max(140, viewportHeight - 16));
      setPosition({ x: Math.max(0, (viewportWidth - width) / 2), y: Math.max(0, (viewportHeight - height) / 2) });
      setSize({ w: width, h: height });
    }
  }, [isOpen, defaultWidth, defaultHeight, isRotatedMobileSurface]);

  // Dragging handlers
  const onPointerDownTitle = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
      pointerId: e.pointerId,
    };
  }, [position]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== dragRef.current.pointerId) return;
      const screenDeltaX = e.clientX - dragRef.current.startX;
      const screenDeltaY = e.clientY - dragRef.current.startY;
      const deltaX = isRotatedMobileSurface ? screenDeltaY : screenDeltaX;
      const deltaY = isRotatedMobileSurface ? -screenDeltaX : screenDeltaY;
      setPosition({
        x: dragRef.current.posX + deltaX,
        y: dragRef.current.posY + deltaY,
      });
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === dragRef.current.pointerId) setDragging(false);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    };
  }, [dragging, isRotatedMobileSurface]);

  // Resizing handlers
  const onPointerDownResize = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size.w,
      startH: size.h,
      pointerId: e.pointerId,
    };
  }, [size]);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== resizeRef.current.pointerId) return;
      const screenDeltaX = e.clientX - resizeRef.current.startX;
      const screenDeltaY = e.clientY - resizeRef.current.startY;
      const deltaW = isRotatedMobileSurface ? screenDeltaY : screenDeltaX;
      const deltaH = isRotatedMobileSurface ? -screenDeltaX : screenDeltaY;
      setSize({
        w: Math.max(300, resizeRef.current.startW + deltaW),
        h: Math.max(140, resizeRef.current.startH + deltaH),
      });
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === resizeRef.current.pointerId) setResizing(false);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    };
  }, [resizing, isRotatedMobileSurface]);

  if (!isOpen) return null;

  const typeColors: Record<string, { gradient: string; icon: React.ReactNode }> = {
    info: { gradient: 'linear-gradient(to bottom, #5B8DC4 0%, #3E6FA8 50%, #2F5A8C 100%)', icon: <IconInfo size={14} /> },
    warning: { gradient: 'linear-gradient(to bottom, #E8A838 0%, #D49420 50%, #B87818 100%)', icon: <IconWarning size={14} /> },
    error: { gradient: 'linear-gradient(to bottom, #D04444 0%, #B83030 50%, #982020 100%)', icon: <IconError size={14} /> },
    confirm: { gradient: 'linear-gradient(to bottom, #5B8DC4 0%, #3E6FA8 50%, #2F5A8C 100%)', icon: <IconQuestion size={14} /> },
  };

  const tc = typeColors[type];

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 flex items-start justify-start pointer-events-none">
      <div
        ref={dialogRef}
        className="pointer-events-auto absolute bg-white rounded-t-lg shadow-2xl border border-[#999] flex flex-col overflow-hidden"
        style={{
          left: position.x,
          top: position.y,
          width: size.w,
          height: size.h,
          maxWidth: isRotatedMobileSurface ? 'calc(100dvh - 16px)' : 'calc(100vw - 16px)',
          maxHeight: isRotatedMobileSurface ? 'calc(100dvw - 16px)' : 'calc(100dvh - 16px)',
        }}
      >
        {/* Title bar */}          <div
            className="h-[28px] text-white flex items-center justify-between px-[8px] shrink-0 cursor-default select-none touch-target"
            style={{ background: tc.gradient, touchAction: 'none' }}
          onPointerDown={onPointerDownTitle}
        >
          <span className="text-[11px] font-semibold font-sans tracking-wide flex items-center gap-1.5">
            <span>{tc.icon}</span> {title}
          </span>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            aria-label="Close dialog"
            className="w-[24px] h-[20px] hover:bg-red-600 text-white font-sans text-[11px] flex items-center justify-center rounded-sm transition"
          >
            <IconClose size={10} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 bg-[#F0F0F0] text-slate-800 text-[12px] font-sans leading-relaxed select-text overflow-auto">
          {children || message}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 p-3 bg-[#E8E8E8] border-t border-[#C8C8C8]">
          {type === 'confirm' && (
            <button
              onClick={() => { onCancel?.(); onClose(); }}
              className="px-5 py-1.5 bg-[#E0E0E0] hover:bg-[#D0D0D0] border border-[#A0A0A0] rounded-[3px] text-[11px] font-sans text-slate-700 active:scale-95 transition"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={() => { onOk?.(); if (type !== 'confirm') onClose(); }}
            className="px-5 py-1.5 bg-[#E0E0E0] hover:bg-[#C9DEF5] border border-[#5B8DC4] rounded-[3px] text-[11px] font-sans font-bold text-slate-700 active:scale-95 transition"
          >
            {okLabel}
          </button>
        </div>

        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-[16px] h-[16px] cursor-se-resize"
          onPointerDown={onPointerDownResize}
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #999 50%)',
            touchAction: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default WinUIDialog;
