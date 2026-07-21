import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { FlowchartCanvas } from '../components/FlowchartCanvas';

/**
 * Mobile canvas view.
 * Wraps the existing desktop FlowchartCanvas in a touch-friendly wrapper.
 * Provides a small overlay with zoom + reset controls (desktop styles
 * don't apply here because we are inside the .mobile-app-root scope).
 *
 * Block-context-menu (long-press) logic is intentionally MINIMAL in
 * Phase 2 — the existing FlowchartCanvas desktop right-click Win32 menu
 * will not work on touch. The MobileActionMenu file ships phased in
 * Phase 2.5 (use `MobileLongPressProbe` once present).
 */
export const MobileCanvasView: React.FC = () => {
  const { zoom, setZoom, statements } = useFlow() as any;

  const handleZoomIn = () => setZoom && setZoom(Math.min(600, (zoom ?? 100) + 25));
  const handleZoomOut = () => setZoom && setZoom(Math.max(25, (zoom ?? 100) - 25));
  const handleReset = () => setZoom && setZoom(100);

  const stmtCount = Array.isArray(statements) ? statements.length : 0;

  return (
    <div className="m-view" style={{ background: '#ffffff' }}>
      <div className="m-canvas-overlay">
        <span>
          ◇ {stmtCount} stmt · {zoom ?? 100}%
        </span>
        <span style={{ display: 'flex', gap: 4 }}>
          <button type="button" onClick={handleZoomOut} aria-label="Zoom out">−</button>
          <button type="button" onClick={handleReset} aria-label="Reset zoom">100%</button>
          <button type="button" onClick={handleZoomIn} aria-label="Zoom in">+</button>
        </span>
      </div>
      <div className="m-canvas-wrap">
        <FlowchartCanvas />
      </div>
    </div>
  );
};
