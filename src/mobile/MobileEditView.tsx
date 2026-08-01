import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { IconInbox, IconClipboard, IconScissors, IconTrash, IconRefresh } from '../components/EmojiIcons';
import { M2Button, M2Card, M2Dialog } from './Material2';

export const MobileEditView: React.FC = () => {
  const { selectedBlockId, copiedBlock, copyBlock, cutBlock, pasteBlock, undo, redo, canUndo, canRedo, clearAll } = useFlow();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const selected = Boolean(selectedBlockId);
  return (
    <section className="m2-view m2-scroll" aria-label="Edit flowchart">
      <M2Card><div className="m2-card__title">Selection</div><div className="m2-list-item"><span className="m2-list-item__icon"><IconInbox size={20} /></span><span className="m2-list-item__label">{selected ? 'A block is selected' : 'Select a block on the Canvas tab'}</span></div></M2Card>
      <M2Card><div className="m2-card__title">Clipboard</div>
        <button type="button" className="m2-list-item" disabled={!selected} onClick={() => { if (selectedBlockId) copyBlock(selectedBlockId); }}><span className="m2-list-item__icon"><IconClipboard size={20} /></span><span className="m2-list-item__label">Copy block</span></button>
        <button type="button" className="m2-list-item" disabled={!selected} onClick={() => { if (selectedBlockId) cutBlock(selectedBlockId); }}><span className="m2-list-item__icon"><IconScissors size={20} /></span><span className="m2-list-item__label">Cut block</span></button>
        <button type="button" className="m2-list-item" disabled={!copiedBlock} onClick={() => pasteBlock()}><span className="m2-list-item__icon"><IconClipboard size={20} /></span><span className="m2-list-item__label">Paste block</span></button>
      </M2Card>
      <M2Card><div className="m2-card__title">History</div>
        <button type="button" className="m2-list-item" disabled={!canUndo} onClick={() => undo()}><span className="m2-list-item__icon"><IconRefresh size={20} /></span><span className="m2-list-item__label">Undo</span></button>
        <button type="button" className="m2-list-item" disabled={!canRedo} onClick={() => redo()}><span className="m2-list-item__icon"><IconRefresh size={20} /></span><span className="m2-list-item__label">Redo</span></button>
      </M2Card>
      <M2Card><div className="m2-card__title">Canvas</div><button type="button" className="m2-list-item" onClick={() => setConfirmOpen(true)}><span className="m2-list-item__icon"><IconTrash size={20} /></span><span className="m2-list-item__label">Clear canvas</span></button></M2Card>
      <M2Dialog open={confirmOpen} title="Clear canvas" onClose={() => setConfirmOpen(false)} actions={<><M2Button onClick={() => setConfirmOpen(false)}>Cancel</M2Button><M2Button variant="contained" onClick={() => { clearAll(); setConfirmOpen(false); }}>Clear</M2Button></>}>
        This removes every block from the current flowchart. This action cannot be undone.
      </M2Dialog>
    </section>
  );
};
