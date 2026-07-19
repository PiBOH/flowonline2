import React, { useState, useRef, useEffect, useCallback } from 'react';

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
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({ startX: 0, startY: 0, posX: 0, posY: 0 });
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number }>({ startX: 0, startY: 0, startW: defaultWidth, startH: defaultHeight });
  const dialogRef = useRef<HTMLDivElement>(null);

  // Center dialog on open, reset to default size
  useEffect(() => {
    if (isOpen) {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      setPosition({ x: Math.max(0, (ww - defaultWidth) / 2), y: Math.max(0, (wh - defaultHeight) / 2) });
      setSize({ w: defaultWidth, h: defaultHeight });
    }
  }, [isOpen, defaultWidth, defaultHeight]);

  // Dragging handlers
  const onMouseDownTitle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, posX: position.x, posY: position.y };
  }, [position]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      setPosition({
        x: dragRef.current.posX + e.clientX - dragRef.current.startX,
        y: dragRef.current.posY + e.clientY - dragRef.current.startY,
      });
    };
    const onUp = () => setDragging(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  // Resizing handlers
  const onMouseDownResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h };
  }, [size]);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: MouseEvent) => {
      setSize({
        w: Math.max(300, resizeRef.current.startW + e.clientX - resizeRef.current.startX),
        h: Math.max(140, resizeRef.current.startH + e.clientY - resizeRef.current.startY),
      });
    };
    const onUp = () => setResizing(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [resizing]);

  if (!isOpen) return null;

  const typeColors: Record<string, { gradient: string; icon: string }> = {
    info: { gradient: 'linear-gradient(to bottom, #5B8DC4 0%, #3E6FA8 50%, #2F5A8C 100%)', icon: 'ℹ️' },
    warning: { gradient: 'linear-gradient(to bottom, #E8A838 0%, #D49420 50%, #B87818 100%)', icon: '⚠️' },
    error: { gradient: 'linear-gradient(to bottom, #D04444 0%, #B83030 50%, #982020 100%)', icon: '❌' },
    confirm: { gradient: 'linear-gradient(to bottom, #5B8DC4 0%, #3E6FA8 50%, #2F5A8C 100%)', icon: '❓' },
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
          minHeight: size.h,
        }}
      >
        {/* Title bar */}
        <div
          className="h-[28px] text-white flex items-center justify-between px-[8px] shrink-0 cursor-default select-none"
          style={{ background: tc.gradient }}
          onMouseDown={onMouseDownTitle}
        >
          <span className="text-[11px] font-semibold font-sans tracking-wide flex items-center gap-1.5">
            <span>{tc.icon}</span> {title}
          </span>
          <button
            onClick={onClose}
            className="w-[24px] h-[20px] hover:bg-red-600 text-white font-sans text-[11px] flex items-center justify-center rounded-sm transition"
          >
            ✕
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
          onMouseDown={onMouseDownResize}
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #999 50%)',
          }}
        />
      </div>
    </div>
  );
};

export default WinUIDialog;
