import React, { useState, useEffect, useRef } from 'react';
import { useFlow } from '../context/FlowContext';
import { translations } from '../utils/translations';
import { Send, Terminal, AlertCircle } from 'lucide-react';

export const Console: React.FC = () => {
  const {
    consoleMessages,
    executionStatus,
    submitInput,
    clearConsole,
    language
  } = useFlow();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    submitInput(inputValue);
    setInputValue('');
  };

  const isAwaitingInput = executionStatus === 'input_pause';

  return (
    <div className="h-44 bg-slate-900 border-t border-slate-800 flex flex-col z-10 font-sans">
      {/* Console Header */}
      <div className="h-8 bg-slate-950 border-b border-slate-850 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-400 text-xs font-bold">
          <Terminal size={13} />
          <span className="uppercase tracking-wider font-mono">Console I/O</span>
        </div>
        <button
          onClick={clearConsole}
          className="text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase font-mono px-1.5 py-0.5 rounded hover:bg-slate-800 transition"
        >
          {t.toolbar.clear}
        </button>
      </div>

      {/* Messages Output Area */}
      <div className="flex-1 overflow-auto p-4 space-y-2 flex flex-col bg-slate-950">
        {consoleMessages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-600 font-mono italic">
            Console vuota. Premi "Esegui" per avviare il diagramma.
          </div>
        )}

        {consoleMessages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="text-[10px] font-semibold font-mono text-slate-500 text-center py-1 select-none">
                {msg.text}
              </div>
            );
          }

          if (msg.type === 'error') {
            return (
              <div key={msg.id} className="flex items-start space-x-2 bg-red-950/40 border border-red-900/40 text-red-400 p-2 rounded text-xs font-mono self-stretch">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <div>{msg.text}</div>
              </div>
            );
          }

          if (msg.type === 'input') {
            // User input bubble on the right
            return (
              <div key={msg.id} className="self-end max-w-[80%] bg-blue-600 text-white rounded-lg px-3 py-1.5 text-xs font-mono font-bold shadow">
                {msg.text}
              </div>
            );
          }

          // Output bubbles (standard Flowgorithm teal/mint bubbles on the left)
          return (
            <div key={msg.id} className="self-start max-w-[80%] bg-emerald-900/60 border border-emerald-850 text-emerald-200 rounded-lg px-3 py-1.5 text-xs font-mono shadow leading-relaxed">
              {msg.text}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Prompter Footer */}
      {isAwaitingInput && (
        <form
          onSubmit={handleSubmit}
          className="h-12 bg-slate-900 border-t border-slate-850 px-4 flex items-center space-x-3"
        >
          <div className="animate-pulse w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Scrivi qui il valore per l'input e premi invio..."
            className="flex-1 bg-slate-950 text-white text-xs font-mono py-1.5 px-3 rounded border border-slate-800 focus:border-blue-500 focus:outline-none placeholder-slate-600"
            autoFocus
          />
          <button
            type="submit"
            className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition shrink-0"
          >
            <Send size={14} />
          </button>
        </form>
      )}
    </div>
  );
};
