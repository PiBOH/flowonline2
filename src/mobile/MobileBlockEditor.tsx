import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import type { Statement, VariableType } from '../types/flow';
import { M2Button, M2Dialog } from './Material2';

interface MobileBlockEditorProps {
  block: Statement | null;
  open: boolean;
  onClose: () => void;
}

type EditorValue = string | boolean;
type EditorFields = Record<string, EditorValue>;

const readField = (fields: EditorFields, key: string): string => String(fields[key] ?? '');

export const MobileBlockEditor: React.FC<MobileBlockEditorProps> = ({ block, open, onClose }) => {
  const { saveBlockFields } = useFlow();
  const [fields, setFields] = useState<EditorFields>({});

  useEffect(() => {
    if (!block) {
      setFields({});
      return;
    }
    setFields({ ...block } as unknown as EditorFields);
  }, [block]);

  if (!block) return null;

  const update = (key: string, value: EditorValue) => {
    setFields((previous) => ({ ...previous, [key]: value }));
  };

  const textField = (label: string, key: string) => (
    <label className="m2-field">
      <span>{label}</span>
      <input className="m2-input" value={readField(fields, key)} onChange={(event) => update(key, event.target.value)} />
    </label>
  );

  const renderFields = () => {
    switch (block.type) {
      case 'declare':
        return <>
          {textField('Variable name', 'variableName')}
          <label className="m2-field"><span>Variable type</span><select className="m2-select" value={readField(fields, 'variableType')} onChange={(event) => update('variableType', event.target.value as VariableType)}><option value="Integer">Integer</option><option value="Real">Real</option><option value="String">String</option><option value="Boolean">Boolean</option></select></label>
          <label className="m2-field m2-checkbox-field"><input type="checkbox" checked={Boolean(fields.isArray)} onChange={(event) => update('isArray', event.target.checked)} /><span>Array</span></label>
          {textField('Array size', 'arraySize')}
        </>;
      case 'assign': return <>{textField('Variable name', 'variableName')}{textField('Expression', 'expression')}</>;
      case 'input': return textField('Variable name', 'variableName');
      case 'output': return <>{textField('Expression', 'expression')}<label className="m2-field m2-checkbox-field"><input type="checkbox" checked={Boolean(fields.newline)} onChange={(event) => update('newline', event.target.checked)} /><span>Append newline</span></label></>;
      case 'if':
      case 'while':
      case 'do': return textField('Condition', 'condition');
      case 'for': return <>
        {textField('Variable name', 'variableName')}
        {textField('Start value', 'startValue')}
        {textField('End value', 'endValue')}
        <label className="m2-field"><span>Direction</span><select className="m2-select" value={readField(fields, 'direction')} onChange={(event) => update('direction', event.target.value as 'inc' | 'dec')}><option value="inc">Ascending</option><option value="dec">Descending</option></select></label>
        {textField('Step value', 'stepValue')}
      </>;
      case 'call': return <>{textField('Function name', 'functionName')}{textField('Arguments', 'arguments')}</>;
      case 'comment': return textField('Comment', 'text');
    }
  };

  const save = () => {
    saveBlockFields(fields as Partial<Statement>);
    onClose();
  };

  return <M2Dialog open={open} title={`Edit ${block.type}`} onClose={onClose} actions={<><M2Button onClick={onClose}>Cancel</M2Button><M2Button variant="contained" onClick={save}>Save</M2Button></>}><div className="m2-editor-fields">{renderFields()}</div></M2Dialog>;
};
