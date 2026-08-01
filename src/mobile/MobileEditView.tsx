import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { WinUIDialog } from '../components/WinUIDialog';
import { IconInbox, IconClipboard, IconScissors, IconTrash, IconPencil, IconRefresh } from '../components/EmojiIcons';

/**
 * Mobile edit view (Phase 3 rewrite).
 *
 * Card-based sections: Selection → Clipboard → History → Canvas.
 * Every row is a flat `m-row` button with a 22px SVG icon + label.
 * `Clear canvas` uses the WinUI dialog (no browser confirm),
 * so it matches desktop behavior and is i18n-aware.
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

  const [clearOpen, setClearOpen] = useState(false);

  const doClear = () => {
    setClearOpen(false);
    if (clearAll) clearAll();
  };

  const hasSelection = !!selectedBlockId;
  const hasClipboard = !!copiedBlock;

  return (
    <div className="m-view m-scroll" style={{ background: 'var(--m-bg)' }}>
      <div className="m-section">
        <div className="m-section-title">Selection</div>
        <div className="m-row subtitle">
          <span className="m-row__icon"><IconInbox size={18} /></span>
          <span className="m-row__label">
            {hasSelection
              ? `Block ${String(selectedBlockId).slice(0, 6)}… selected`
              : 'Tap a block on the canvas to select it'}
          </span>
        </div>
      </div>

      <div className="m-section">
        <div className="m-section-title">Clipboard</div>
        <button
          type="button"
          className="m-row"
          disabled={!hasSelection || !copyBlock}
          onClick={() => hasSelection && copyBlock && copyBlock(selectedBlockId)}
        >
          <span className="m-row__icon"><IconClipboard size={18} /></span>
          <span className="m-row__label">Copy block</span>
        </button>
        <button
          type="button"
          className="m-row"
          disabled={!hasSelection || !cutBlock}
          onClick={() => hasSelection && cutBlock && cutBlock(selectedBlockId)}
        >
          <span className="m-row__icon"><IconScissors size={18} /></span>
          <span className="m-row__label">Cut block</span>
        </button>
        <button
          type="button"
          className="m-row"
          disabled={!hasClipboard || !pasteBlock}
          onClick={() => pasteBlock && pasteBlock()}
        >
          <span className="m-row__icon"><IconPencil size={18} /></span>
          <span className="m-row__label">
            Paste{' '}
            {hasClipboard ? (
              <span style={{ color: 'var(--m-ok)', fontWeight: 600 }}>· ready</span>
            ) : (
              <span style={{ color: 'var(--m-text-3)' }}>· empty</span>
            )}
          </span>
        </button>
      </div>

      <div className="m-section">
        <div className="m-section-title">History</div>
        <button type="button" className="m-row" disabled={!canUndo} onClick={() => undo && undo()}>
          <span className="m-row__icon"><IconRefresh size={18} /></span>
          <span className="m-row__label">Undo</span>
          <span className="m-row__hint">{canUndo ? '' : 'nothing to undo'}</span>
        </button>
        <button type="button" className="m-row" disabled={!canRedo} onClick={() => redo && redo()}>
          <span className="m-row__icon"><IconRefresh size={18} /></span>
          <span className="m-row__label">Redo</span>
          <span className="m-row__hint">{canRedo ? '' : 'nothing to redo'}</span>
        </button>
      </div>

      <div className="m-section">
        <div className="m-section-title">Canvas</div>
        <button type="button" className="m-row danger" onClick={() => setClearOpen(true)}>
          <span className="m-row__icon"><IconTrash size={18} /></span>
          <span className="m-row__label">Clear canvas</span>
        </button>
      </div>

      <WinUIDialog
        isOpen={clearOpen}
        onClose={() => setClearOpen(false)}
        onOk={doClear}
        title="Clear canvas"
        message="This will remove every block. This cannot be undone — are you sure?"
        type="confirm"
        defaultWidth={360}
        defaultHeight={220}
      />
    </div>
  );
};
