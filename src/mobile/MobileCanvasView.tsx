import React from 'react';
import { useFlow } from '../context/FlowContext';
import type { BlockType, Statement } from '../types/flow';
import { IconMagnifier, IconRefresh, IconPlus, IconTrash } from '../components/EmojiIcons';

const BLOCK_TYPES: Array<{ type: BlockType; label: string }> = [
  { type: 'declare', label: 'Declare' },
  { type: 'assign', label: 'Assign' },
  { type: 'input', label: 'Input' },
  { type: 'output', label: 'Output' },
  { type: 'if', label: 'If' },
  { type: 'while', label: 'While' },
  { type: 'for', label: 'For' },
  { type: 'do', label: 'Do' },
  { type: 'call', label: 'Call' },
  { type: 'comment', label: 'Comment' },
];

const TYPE_LABELS: Record<BlockType, string> = Object.fromEntries(BLOCK_TYPES.map(({ type, label }) => [type, label])) as Record<BlockType, string>;

const statementSummary = (statement: Statement): string => {
  switch (statement.type) {
    case 'declare': return `${statement.variableName} : ${statement.variableType}`;
    case 'assign': return `${statement.variableName} = ${statement.expression}`;
    case 'input': return statement.variableName;
    case 'output': return statement.expression;
    case 'if':
    case 'while':
    case 'do': return statement.condition;
    case 'for': return `${statement.variableName} = ${statement.startValue} to ${statement.endValue}`;
    case 'call': return `${statement.functionName}(${statement.arguments || ''})`;
    case 'comment': return statement.text;
  }
};

interface MobileStatementTreeProps {
  statements: Statement[];
  selectedBlockId: string | null;
  onSelect: (statement: Statement) => void;
  onEdit: (statement: Statement) => void;
  onAdd: (targetId: string, type: BlockType) => void;
  onDelete: (id: string) => void;
  depth?: number;
}

const AddBlockButton: React.FC<{ onAdd: (type: BlockType) => void; label?: string }> = ({ onAdd, label = 'Add block' }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="m2-flow-add-wrap">
      <button type="button" className="m2-flow-add" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={label}>
        <IconPlus size={16} /> <span>{label}</span>
      </button>
      {open && <div className="m2-flow-type-menu" role="menu">{BLOCK_TYPES.map(({ type, label: typeLabel }) => <button key={type} type="button" role="menuitem" onClick={() => { onAdd(type); setOpen(false); }}>{typeLabel}</button>)}</div>}
    </div>
  );
};

const MobileStatementTree: React.FC<MobileStatementTreeProps> = ({
  statements,
  selectedBlockId,
  onSelect,
  onEdit,
  onAdd,
  onDelete,
  depth = 0,
}) => (
  <div className="m2-flow-tree" style={{ marginInlineStart: depth ? 12 : 0 }}>
    {statements.length === 0 ? (
      <p className="m2-flow-empty">No blocks in this branch.</p>
    ) : statements.map((statement) => (
      <React.Fragment key={statement.id}>
        <div className={`m2-flow-block-wrap ${selectedBlockId === statement.id ? 'is-selected' : ''}`}>
          <button
            type="button"
            className={`m2-flow-block m2-flow-block--${statement.type} ${selectedBlockId === statement.id ? 'is-selected' : ''}`}
            onClick={() => onSelect(statement)}
            onDoubleClick={() => onEdit(statement)}
            aria-pressed={selectedBlockId === statement.id}
          >
            <span className="m2-flow-block__type">{TYPE_LABELS[statement.type]}</span>
            <span className="m2-flow-block__summary">{statementSummary(statement)}</span>
            <span className="m2-flow-block__hint">Double-tap to edit</span>
          </button>
          <button type="button" className="m2-flow-delete" onClick={() => onDelete(statement.id)} aria-label={`Delete ${TYPE_LABELS[statement.type]} block`}><IconTrash size={16} /></button>
        </div>
        {statement.type === 'if' && (
          <div className="m2-flow-branches">
            <section className="m2-flow-branch m2-flow-branch--true" aria-label="True branch">
              <h3>TRUE</h3>
              <MobileStatementTree statements={statement.thenBranch} selectedBlockId={selectedBlockId} onSelect={onSelect} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} depth={depth + 1} />
              <AddBlockButton label="Add to TRUE" onAdd={(type) => onAdd(`branch_end:${statement.id}:then`, type)} />
            </section>
            <section className="m2-flow-branch m2-flow-branch--false" aria-label="False branch">
              <h3>FALSE</h3>
              <MobileStatementTree statements={statement.elseBranch} selectedBlockId={selectedBlockId} onSelect={onSelect} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} depth={depth + 1} />
              <AddBlockButton label="Add to FALSE" onAdd={(type) => onAdd(`branch_end:${statement.id}:else`, type)} />
            </section>
          </div>
        )}
        {(statement.type === 'while' || statement.type === 'for' || statement.type === 'do') && (
          <section className="m2-flow-branch m2-flow-branch--body" aria-label={`${TYPE_LABELS[statement.type]} body`}>
            <h3>BODY</h3>
            <MobileStatementTree statements={statement.body} selectedBlockId={selectedBlockId} onSelect={onSelect} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} depth={depth + 1} />
            <AddBlockButton label="Add to BODY" onAdd={(type) => onAdd(`branch_end:${statement.id}:body`, type)} />
          </section>
        )}
      </React.Fragment>
    ))}
  </div>
);

interface ExportSvgProps { statements: Statement[]; }

export const MobileExportSvg: React.FC<ExportSvgProps> = ({ statements }) => {
  const rows: Array<{ label: string; summary: string; depth: number }> = [];
  const collect = (items: Statement[], depth = 0) => {
    items.forEach((statement) => {
      rows.push({ label: TYPE_LABELS[statement.type], summary: statementSummary(statement), depth });
      if (statement.type === 'if') {
        rows.push({ label: 'TRUE', summary: '', depth: depth + 1 });
        collect(statement.thenBranch, depth + 2);
        rows.push({ label: 'FALSE', summary: '', depth: depth + 1 });
        collect(statement.elseBranch, depth + 2);
      } else if (statement.type === 'while' || statement.type === 'for' || statement.type === 'do') {
        rows.push({ label: 'BODY', summary: '', depth: depth + 1 });
        collect(statement.body, depth + 2);
      }
    });
  };
  collect(statements);
  const rowHeight = 52;
  const height = Math.max(160, (rows.length + 2) * rowHeight + 24);
  return (
    <svg id="mobile-svg-export-target" className="m2-export-svg" xmlns="http://www.w3.org/2000/svg" width="640" height={height} viewBox={`0 0 640 ${height}`} role="img" aria-label="Flowchart export">
      <rect width="640" height={height} fill="#ffffff" />
      <rect x="220" y="12" width="200" height="32" rx="16" fill="#3f51b5" />
      <text x="320" y="33" fill="#ffffff" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="700">MAIN</text>
      {rows.map((row, index) => {
        const y = 58 + index * rowHeight;
        const x = 24 + row.depth * 22;
        return <g key={`${row.label}-${index}`}><rect x={x} y={y} width={Math.max(240, 580 - row.depth * 22)} height="38" rx="3" fill="#ffffff" stroke="#3f51b5" strokeWidth="2" /><text x={x + 12} y={y + 15} fill="#757575" fontFamily="Arial" fontSize="10" fontWeight="700">{row.label.toUpperCase()}</text><text x={x + 12} y={y + 30} fill="#212121" fontFamily="Consolas, monospace" fontSize="12">{row.summary}</text></g>;
      })}
      <rect x="220" y={height - 44} width="200" height="32" rx="16" fill="#303f9f" />
      <text x="320" y={height - 23} fill="#ffffff" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="700">END</text>
    </svg>
  );
};

export const MobileCanvasView: React.FC = () => {
  const { zoom, setZoom, statements, selectedBlockId, setSelectedBlockId, openEditor, addBlock, deleteBlock } = useFlow();
  const percent = Math.round(zoom <= 10 ? zoom * 100 : zoom);
  const setPercent = (next: number) => setZoom(Math.max(25, Math.min(600, next)) / 100);
  const selectStatement = (statement: Statement) => setSelectedBlockId(statement.id);
  const editStatement = (statement: Statement) => { setSelectedBlockId(statement.id); openEditor(statement); };
  const addMobileBlock = (targetId: string, type: BlockType) => addBlock(targetId as Parameters<typeof addBlock>[0], type);

  return (
    <section className="m2-view m2-canvas-view" aria-label="Flowchart canvas">
      <div className="m2-canvas__info"><span>{statements.length} top-level blocks</span><span>Zoom {percent}%</span></div>
      <div className="m2-canvas__viewport">
        <div className="m2-canvas__content" style={{ transform: `scale(${Math.max(0.25, percent / 100)})` }}>
          <AddBlockButton label="Add at start" onAdd={(type) => addMobileBlock('main_start', type)} />
          <div className="m2-flow-terminal m2-flow-terminal--start">MAIN</div>
          <MobileStatementTree statements={statements} selectedBlockId={selectedBlockId} onSelect={selectStatement} onEdit={editStatement} onAdd={addMobileBlock} onDelete={deleteBlock} />
          <AddBlockButton label="Add at end" onAdd={(type) => addMobileBlock('main_end', type)} />
          <div className="m2-flow-terminal m2-flow-terminal--end">END</div>
        </div>
      </div>
      <div className="m2-fab-group" role="toolbar" aria-label="Canvas zoom controls">
        <button type="button" className="m2-fab" aria-label="Zoom out" onClick={() => setPercent(percent - 25)}><IconMagnifier size={20} /></button>
        <button type="button" className="m2-fab" aria-label="Reset zoom" onClick={() => setPercent(100)}><IconRefresh size={20} /></button>
        <button type="button" className="m2-fab" aria-label="Zoom in" onClick={() => setPercent(percent + 25)}><IconPlus size={24} /></button>
      </div>
    </section>
  );
};
