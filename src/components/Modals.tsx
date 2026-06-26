import React, { useState, useEffect } from 'react';
import { useFlow } from '../context/FlowContext';
import { Statement, VariableType } from '../types/flow';
import { translations } from '../utils/translations';
import { X, Save, AlertTriangle } from 'lucide-react';

export const Modals: React.FC = () => {
  const { editingBlock, closeEditor, saveBlockFields, language } = useFlow();

  const t = translations[language];

  // Temporary local form states
  const [variableName, setVariableName] = useState('');
  const [variableType, setVariableType] = useState<VariableType>('Integer');
  const [isArray, setIsArray] = useState(false);
  const [arraySize, setArraySize] = useState('');
  
  const [expression, setExpression] = useState('');
  const [newline, setNewline] = useState(true);

  const [condition, setCondition] = useState('');
  
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [stepValue, setStepValue] = useState('');
  const [direction, setDirection] = useState<'inc' | 'dec'>('inc');

  const [functionName, setFunctionName] = useState('');
  const [argumentsStr, setArgumentsStr] = useState('');

  const [text, setText] = useState('');
  const [commentText, setCommentText] = useState('');

  const [validationError, setValidationError] = useState('');

  // Synchronize local states with open block values
  useEffect(() => {
    if (!editingBlock) return;

    setValidationError('');
    setCommentText(editingBlock.comment || '');

    switch (editingBlock.type) {
      case 'declare':
        setVariableName(editingBlock.variableName);
        setVariableType(editingBlock.variableType);
        setIsArray(editingBlock.isArray);
        setArraySize(editingBlock.arraySize);
        break;
      case 'assign':
        setVariableName(editingBlock.variableName);
        setExpression(editingBlock.expression);
        break;
      case 'input':
        setVariableName(editingBlock.variableName);
        break;
      case 'output':
        setExpression(editingBlock.expression);
        setNewline(editingBlock.newline);
        break;
      case 'if':
        setCondition(editingBlock.condition);
        break;
      case 'while':
      case 'do':
        setCondition(editingBlock.condition);
        break;
      case 'for':
        setVariableName(editingBlock.variableName);
        setStartValue(editingBlock.startValue);
        setEndValue(editingBlock.endValue);
        setStepValue(editingBlock.stepValue);
        setDirection(editingBlock.direction);
        break;
      case 'call':
        setFunctionName(editingBlock.functionName);
        setArgumentsStr(editingBlock.arguments);
        break;
      case 'comment':
        setText(editingBlock.text);
        break;
    }
  }, [editingBlock]);

  if (!editingBlock) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const fields: any = {
      comment: commentText.trim() ? commentText.trim() : undefined
    };

    // FORM VALIDATION
    try {
      switch (editingBlock.type) {
        case 'declare':
          if (!variableName.trim()) throw new Error(t.modals.errorRequired);
          if (isArray && !arraySize.trim()) throw new Error(t.modals.errorRequired);
          
          fields.variableName = variableName.trim();
          fields.variableType = variableType;
          fields.isArray = isArray;
          fields.arraySize = isArray ? arraySize.trim() : '';
          break;

        case 'assign':
          if (!variableName.trim() || !expression.trim()) throw new Error(t.modals.errorRequired);
          fields.variableName = variableName.trim();
          fields.expression = expression.trim();
          break;

        case 'input':
          if (!variableName.trim()) throw new Error(t.modals.errorRequired);
          fields.variableName = variableName.trim();
          break;

        case 'output':
          if (!expression.trim()) throw new Error(t.modals.errorRequired);
          fields.expression = expression.trim();
          fields.newline = newline;
          break;

        case 'if':
        case 'while':
        case 'do':
          if (!condition.trim()) throw new Error(t.modals.errorRequired);
          fields.condition = condition.trim();
          break;

        case 'for':
          if (!variableName.trim() || !startValue.trim() || !endValue.trim() || !stepValue.trim()) {
            throw new Error(t.modals.errorRequired);
          }
          fields.variableName = variableName.trim();
          fields.startValue = startValue.trim();
          fields.endValue = endValue.trim();
          fields.stepValue = stepValue.trim();
          fields.direction = direction;
          break;

        case 'call':
          if (!functionName.trim()) throw new Error(t.modals.errorRequired);
          fields.functionName = functionName.trim();
          fields.arguments = argumentsStr.trim();
          break;

        case 'comment':
          if (!text.trim()) throw new Error(t.modals.errorRequired);
          fields.text = text.trim();
          break;
      }

      saveBlockFields(fields as Partial<Statement>);
    } catch (err: any) {
      setValidationError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className={`w-3 h-3 rounded-full ${
              editingBlock.type === 'declare' || editingBlock.type === 'assign'
                ? 'bg-yellow-400'
                : editingBlock.type === 'input'
                ? 'bg-cyan-400'
                : editingBlock.type === 'output'
                ? 'bg-green-400'
                : editingBlock.type === 'if'
                ? 'bg-orange-400'
                : editingBlock.type === 'call'
                ? 'bg-blue-400'
                : editingBlock.type === 'comment'
                ? 'bg-slate-300'
                : 'bg-rose-400'
            }`}></span>
            <h3 className="font-sans font-bold text-slate-800 text-sm tracking-wide uppercase">
              {t.modals.title} - {t.blocks[editingBlock.type]}
            </h3>
          </div>
          <button
            onClick={closeEditor}
            className="text-slate-400 hover:text-slate-600 rounded p-1 transition hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="p-5 flex-1 overflow-y-auto space-y-4">
          {validationError && (
            <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs font-semibold">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* DYNAMIC FIELD RENDERING BY TYPE */}
          {editingBlock.type === 'declare' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t.modals.declareVar}
                </label>
                <input
                  type="text"
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="es. x, y, somma"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t.modals.type}
                </label>
                <select
                  value={variableType}
                  onChange={(e) => setVariableType(e.target.value as VariableType)}
                  className="w-full text-xs font-semibold text-slate-700 p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                >
                  <option value="Integer">Integer</option>
                  <option value="Real">Real</option>
                  <option value="String">String</option>
                  <option value="Boolean">Boolean</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="isArrayCheckbox"
                  checked={isArray}
                  onChange={(e) => setIsArray(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:outline-none cursor-pointer"
                />
                <label htmlFor="isArrayCheckbox" className="text-xs font-bold text-slate-600 select-none cursor-pointer">
                  {t.modals.isArray}
                </label>
              </div>

              {isArray && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t.modals.arraySize}
                  </label>
                  <input
                    type="text"
                    value={arraySize}
                    onChange={(e) => setArraySize(e.target.value)}
                    className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="es. 10, N, x * 2"
                  />
                </div>
              )}
            </div>
          )}

          {editingBlock.type === 'assign' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t.modals.assignTo}
                </label>
                <input
                  type="text"
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="es. somma, vettore[i]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t.modals.expression}
                </label>
                <input
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="es. x + 5, a & b, true"
                />
              </div>
            </div>
          )}

          {editingBlock.type === 'input' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t.modals.inputVar}
              </label>
              <input
                type="text"
                value={variableName}
                onChange={(e) => setVariableName(e.target.value)}
                className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                placeholder="es. x, vettore[idx]"
                autoFocus
              />
            </div>
          )}

          {editingBlock.type === 'output' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t.modals.outputExpr}
                </label>
                <input
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                  placeholder='es. "Risultato: " & somma'
                  autoFocus
                />
              </div>

              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="newlineCheckbox"
                  checked={newline}
                  onChange={(e) => setNewline(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:outline-none cursor-pointer"
                />
                <label htmlFor="newlineCheckbox" className="text-xs font-bold text-slate-600 select-none cursor-pointer">
                  {t.modals.newline}
                </label>
              </div>
            </div>
          )}

          {(editingBlock.type === 'if' || editingBlock.type === 'while' || editingBlock.type === 'do') && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t.modals.condition}
              </label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                placeholder="es. x > 10, a == b and c != d"
                autoFocus
              />
            </div>
          )}

          {editingBlock.type === 'for' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t.modals.forVar}
                  </label>
                  <input
                    type="text"
                    value={variableName}
                    onChange={(e) => setVariableName(e.target.value)}
                    className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="es. i"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t.modals.step}
                  </label>
                  <input
                    type="text"
                    value={stepValue}
                    onChange={(e) => setStepValue(e.target.value)}
                    className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="es. 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t.modals.start}
                  </label>
                  <input
                    type="text"
                    value={startValue}
                    onChange={(e) => setStartValue(e.target.value)}
                    className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="es. 1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {t.modals.end}
                  </label>
                  <input
                    type="text"
                    value={endValue}
                    onChange={(e) => setEndValue(e.target.value)}
                    className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                    placeholder="es. 10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t.modals.direction}
                </label>
                <div className="flex space-x-3 mt-1">
                  <label className="flex items-center space-x-1.5 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="directionRadio"
                      checked={direction === 'inc'}
                      onChange={() => setDirection('inc')}
                      className="cursor-pointer"
                    />
                    <span>{t.modals.ascending}</span>
                  </label>
                  <label className="flex items-center space-x-1.5 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="directionRadio"
                      checked={direction === 'dec'}
                      onChange={() => setDirection('dec')}
                      className="cursor-pointer"
                    />
                    <span>{t.modals.descending}</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {editingBlock.type === 'call' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t.modals.callFunc}
                </label>
                <input
                  type="text"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="es. MiaFunzione"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {t.modals.arguments}
                </label>
                <input
                  type="text"
                  value={argumentsStr}
                  onChange={(e) => setArgumentsStr(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="es. x, 10, y + 2"
                />
              </div>
            </div>
          )}

          {editingBlock.type === 'comment' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t.modals.commentText}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full text-xs font-mono p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none h-24 resize-none"
                placeholder="Scrivi qui le annotazioni..."
                autoFocus
              />
            </div>
          )}

          {/* SHARED BLOCK COMMENT FIELD (Exactly like Flowgorithm where any node can have an associated comment) */}
          {editingBlock.type !== 'comment' && (
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Nota/Commento del Blocco (Opzionale)
              </label>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full text-xs font-mono p-1.5 border border-slate-150 rounded bg-slate-50 focus:bg-white focus:outline-none"
                placeholder="es. Controlla che eta sia maggiore di 18"
              />
            </div>
          )}

          {/* Modal Buttons Footer */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-150 bg-white">
            <button
              type="button"
              onClick={closeEditor}
              className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded transition"
            >
              {t.modals.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow flex items-center space-x-1.5 transition"
            >
              <Save size={13} />
              <span>{t.modals.ok}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
