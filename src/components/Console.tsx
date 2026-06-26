import React, { useState, useEffect, useRef } from 'react';
import { useFlow } from '../context/FlowContext';
import { CornerDownLeft } from 'lucide-react';

export const Console: React.FC = () => {
  const {
    consoleMessages,
    executionStatus,
    submitInput,
    clearConsole,
    layout,
    setLayout
  } = useFlow();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // If the console is not part of the active layout, do not render it
  if (layout !== 'flow_console' && layout !== 'triple_split') return null;

  return (
    <div className="flex-1 min-h-0 bg-[#E6E0F0] border-2 border-slate-300 rounded shadow-md flex flex-col font-sans select-none m-1">
      
      {/* ============ WIN32 PANEL HEADER ============ */}
      <div 
        className="h-[24px] text-white flex items-center justify-between px-2 cursor-default shrink-0"
        style={{
          background: 'linear-gradient(to right, #3E6FA8 0%, #7AAFE0 100%)'
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-white font-sans tracking-wide">
            💬 Console di Esecuzione - Flowonline2
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={clearConsole}
            className="text-[9px] bg-white/10 hover:bg-white/20 text-white font-bold px-1 rounded transition"
            title="Svuota Console"
          >
            Svuota
          </button>
          <button 
            onClick={() => {
              // Close console by changing layout
              if (layout === 'triple_split') setLayout('flow_variables');
              else setLayout('flowchart_only');
            }}
            className="w-[14px] h-[14px] bg-[#E81123]/80 hover:bg-[#E81123] rounded-sm flex items-center justify-center text-[10px] text-white font-bold"
            title="Chiudi Finestra"
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages Output Area (Classic Light-Purple Lavender Background) */}
      {/* CRITICAL FIX: Set white-space to pre-wrap to support ToChar(13) carriage return newlines! */}
      <div className="flex-1 overflow-auto p-4 space-y-2.5 flex flex-col bg-[#FAF8FF] whitespace-pre-wrap">
        {consoleMessages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-purple-400 font-mono italic">
            Console vuota. Premi "Esegui" per avviare l'algoritmo.
          </div>
        )}

        {consoleMessages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="text-[10px] font-bold font-mono text-purple-500 text-center py-0.5 select-none">
                {msg.text}
              </div>
            );
          }

          if (msg.type === 'error') {
            return (
              <div key={msg.id} className="self-center bg-red-100 border border-red-300 text-red-700 p-2 rounded text-xs font-mono max-w-[90%] shadow-sm">
                ❌ {msg.text}
              </div>
            );
          }

          if (msg.type === 'input') {
            // Flowgorithm user input bubble (Blue dialog chat balloon on the right!)
            return (
              <div key={msg.id} className="self-end max-w-[80%] bg-[#D2E3FC] text-blue-900 border border-blue-400 rounded-2xl rounded-tr-none px-3.5 py-1.5 text-xs font-mono font-bold shadow-sm whitespace-pre-wrap">
                {msg.text}
              </div>
            );
          }

          // Flowgorithm output bubbles (Classic mint-green rounded dialog speech balloons on the left!)
          return (
            <div key={msg.id} className="self-start max-w-[80%] bg-[#E2F0D9] border border-[#A9D18E] text-[#385723] rounded-2xl rounded-tl-none px-3.5 py-1.5 text-xs font-mono font-semibold shadow-sm leading-relaxed whitespace-pre-wrap">
              {msg.text}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Prompter Footer (Win32 Style) */}
      {isAwaitingInput ? (
        <form
          onSubmit={handleSubmit}
          className="h-11 bg-[#F0F0F0] border-t border-[#C8C8C8] px-3 flex items-center space-x-2 shrink-0"
        >
          <div className="animate-ping w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digitare valore e premere invio..."
            className="flex-1 bg-white text-slate-800 text-xs font-mono py-1 px-2.5 rounded border border-[#B0B0B0] focus:border-[#5B8DC4] focus:outline-none placeholder-slate-400 shadow-inner"
            autoFocus
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-[#D5EAFA] hover:bg-[#C9DEF5] border border-[#5B8DC4] text-slate-700 font-bold rounded flex items-center gap-1 text-[11px] shadow-sm transition"
          >
            <span>Invia</span>
            <CornerDownLeft size={11} />
          </button>
        </form>
      ) : (
        <div className="h-4 bg-[#F0F0F0] border-t border-[#C8C8C8] px-2 flex items-center justify-between text-[10px] text-slate-400 font-mono shrink-0 select-none">
          <span>Pronto</span>
          <span>Log: {consoleMessages.length} righe</span>
        </div>
      )}
    </div>
  );
};
