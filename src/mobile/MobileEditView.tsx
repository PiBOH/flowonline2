import React from 'react';
import { useFlow } from '../context/FlowContext';

/**
 * Mobile edit view — clipboard + undo/redo controls.
 * Shows the current selection status, plus a tap target for ready paste.
 */
export const MobileEditView: React.FC = () => {
  const {
    selectedBlockId,
    copiedBlock,
    copyBlock,
    cutBlock,
    pasteBlock,
    undo,
    redo,
    canUndo,
    canRedo,
    clearAll,
  } = useFlow() as any;

  return (
    <div className="m-view m-scroll">
      <div className="m-section-title">Selection</div>
      <div className="m-row subtitle">
        <span style={{ flex: 1 }}>
          {selectedBlockId ? `Block ${String(selectedBlockId).slice(0, 6)}… selected` : 'Tap a block on the canvas to select it'}
        </span>
      </div>

      <div className="m-section-title">Clipboard</div>
      <button
        type="button"
        className="m-row"
        disabled={!selectedBlockId || !copyBlock}
        onClick={() => { if (selectedBlockId && copyBlock) { copyBlock(selectedBlockId); } }}
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>⧉</span>
        <span style={{ flex: 1 }}>Copy block</span>
      </button>
      <button
        type="button"
        className="m-row"
        disabled={!selectedBlockId || !cutBlock}
        onClick={() => { if (selectedBlockId && cutBlock) { cutBlock(selectedBlockId); } }}
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>✂</span>
        <span style={{ flex: 1 }}>Cut block</span>
      </button>
      <button
        type="button"
        className="m-row"
        disabled={!copiedBlock || !pasteBlock}
        onClick={() => { if (pasteBlock) pasteBlock(); }}
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>⎘</span>
        <span style={{ flex: 1 }}>
          Paste {copiedBlock ? <span style={{ color: '#16a34a', fontWeight: 600 }}>(ready)</span> : <span style={{ color: '#94a3b8' }}>(empty)</span>}
        </span>
      </button>

      <div className="m-section-title">History</div>
      <button type="button" className="m-row" disabled={!canUndo} onClick={() => undo && undo()}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>↶</span>
        <span style={{ flex: 1 }}>Undo</span>
      </button>
      <button type="button" className="m-row" disabled={!canRedo} onClick={() => redo && redo()}>
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>↷</span>
        <span style={{ flex: 1 }}>Redo</span>
      </button>

      <div className="m-section-title">Canvas</div>
      <button
        type="button"
        className="m-row danger"
        disabled={!clearAll}
        onClick={() => {
          if (typeof window !== 'undefined' && window.confirm('Clear canvas? This will be lost on refresh unless saved.')) {
            if (clearAll) clearAll();
          }
        }}
      >
        <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>⌫</span>
        <span style={{ flex: 1 }}>Clear canvas</span>
      </button>
    </div>
  );
};
