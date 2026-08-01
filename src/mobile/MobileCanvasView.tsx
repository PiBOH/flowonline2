import React from 'react';
import { useFlow } from '../context/FlowContext';
import { FlowchartCanvas } from '../components/FlowchartCanvas';
import { IconMagnifier, IconRefresh, IconPlus } from '../components/EmojiIcons';

/**
 * Mobile canvas view (Phase 3 rewrite).
 *
 * The desktop FlowchartCanvas is already touch-tolerant; we wrap it in a
 * 100%-sized container and provide:
 *   - Top-left overlay with statement count + zoom %.
 *   - Bottom-right FAB stack: zoom-out, zoom-reset, zoom-in.
 *
 * Phase 3 dropped the floating round "+" add-block FAB because adding
 * blocks on mobile happens via the Edit tab (one tap → dropdown of
 * block types). This keeps the canvas clean for the primary use case
 * (read + edit flow graphs) without cluttering the viewport.
 */
export const MobileCanvasView: React.FC = () => {
  const { zoom, setZoom, statements } = useFlow() as any;

  const clamp = (v: number) => Math.max(25, Math.min(600, v));
  const current = typeof zoom === 'number' ? zoom : 100;

  const zoomOut = () => setZoom && setZoom(clamp(current - 25));
  const zoomReset = () => setZoom && setZoom(100);
  const zoomIn = () => setZoom && setZoom(clamp(current + 25));

  const stmtCount = Array.isArray(statements) ? statements.length : 0;

  return (
    <div className="m-view" style={{ background: '#fff' }}>
      <div className="m-canvas-overlay" role="status" aria-label={`Canvas: ${stmtCount} statements, zoom ${current}%`}>
        <span className="m-caption">
          ◇ {stmtCount} stmt · {current}%
        </span>
        <span className="m-caption">tap block to select</span>
      </div>
      <div className="m-canvas-wrap">
        <FlowchartCanvas />
      </div>
      <div className="m-canvas-fab" role="toolbar" aria-label="Canvas zoom">
        <button type="button" className="m-fab" onClick={zoomOut} aria-label="Zoom out">
          <IconMagnifier size={20} />
        </button>
        <button type="button" className="m-fab" onClick={zoomReset} aria-label="Reset zoom to 100%">
          <IconRefresh size={20} />
        </button>
        <button type="button" className="m-fab fab-primary" onClick={zoomIn} aria-label="Zoom in">
          <IconPlus size={26} />
        </button>
      </div>
    </div>
  );
};
