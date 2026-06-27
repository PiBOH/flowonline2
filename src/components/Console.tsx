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
    setLayout,
    colorScheme
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

  // DYNAMIC THEME STYLING (Support for Twilight Dark Mode!)
  const isDark = colorScheme === 'twilight';
  const isBW = colorScheme === 'black_white';

  const panelBg = isDark ? "bg-zinc-900 border-zinc-700" : isBW ? "bg-white border-black" : "bg-[#E6E0F0] border-slate-300";
  const headerBg = isDark ? "bg-zinc-800" : isBW ? "bg-black text-white" : "bg-gradient-to-r from-[#3E6FA8] to-[#7AAFE0]";
  const listBg = isDark ? "bg-zinc-950" : isBW ? "bg-white" : "bg-[#FAF8FF]";
  
  // Dialog bubble classes based on active color scheme
  const getInputBubbleClass = () => {
    if (isDark) return "bg-blue-950/60 border border-blue-800 text-blue-200";
    if (isBW) return "bg-white border-2 border-black text-black";
    return "bg-[#D2E3FC] border border-blue-400 text-blue-900";
  };

  const getOutputBubbleClass = () => {
    if (isDark) return "bg-emerald-950/60 border border-emerald-800 text-emerald-200";
    if (isBW) return "bg-white border-2 border-black text-black font-bold";
    return "bg-[#E2F0D9] border border-[#A9D18E] text-[#385723]";
  };

  return (
    <div className={`flex-1 min-h-0 border-2 rounded shadow-md flex flex-col font-sans select-none m-1 ${panelBg}`}>
      
      {/* ============ WIN32 PANEL HEADER ============ */}
      <div 
        style={!isDark && !isBW ? { background: 'linear-gradient(to right, #3E6FA8 0%, #7AAFE0 100%)' } : {}}
        className={`h-[24px] flex items-center justify-between px-2 cursor-default shrink-0 text-white font-sans ${headerBg}`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold tracking-wide">
            💬 Console di Esecuzione - Flowonline2
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={clearConsole}
            className={`text-[9px] font-bold px-1 rounded transition ${isDark ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            title="Svuota Console"
          >
            Svuota
          </button>
          <button 
            onClick={() => {
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

      {/* Messages Output Area (supports ToChar(13) carriage returns mapped to Line Feeds) */}
      {/* select-text added to make console content perfectly selectable and copyable! */}
      <div 
        className={`flex-1 overflow-auto p-4 space-y-2.5 flex flex-col select-text ${listBg}`}
        style={{ whiteSpace: 'pre-wrap' }} // EXPLICIT BULLETPROOF STYLE ENSURING CARRIAGE RETURNS WORK IN BALOONS!
      >
        {consoleMessages.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-purple-400 font-mono italic select-none">
            Console vuota. Premi "Esegui" per avviare l'algoritmo.
          </div>
        )}

        {consoleMessages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="text-[10px] font-bold font-mono text-purple-500 text-center py-0.5 select-text">
                {msg.text}
              </div>
            );
          }

          if (msg.type === 'error') {
            return (
              <div key={msg.id} className="self-center bg-red-100 border border-red-300 text-red-700 p-2 rounded text-xs font-mono max-w-[90%] shadow-sm select-text">
                ❌ {msg.text}
              </div>
            );
          }

          if (msg.type === 'input') {
            // User input bubble (Blue balloon on the right!)
            return (
              <div key={msg.id} className={`self-end max-w-[80%] rounded-2xl rounded-tr-none px-3.5 py-1.5 text-xs font-mono font-bold shadow-sm select-text ${getInputBubbleClass()}`}>
                {msg.text.replace(/\r/g, '\n')}
              </div>
            );
          }

          // Flowgorithm output bubbles (Classic mint-green rounded dialogue speech balloons on the left!)
          return (
            <div key={msg.id} className={`self-start max-w-[80%] rounded-2xl rounded-tl-none px-3.5 py-1.5 text-xs font-mono font-semibold shadow-sm leading-relaxed select-text ${getOutputBubbleClass()}`}>
              {msg.text.replace(/\r/g, '\n')}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Prompter Footer (Win32 Style) */}
      {isAwaitingInput ? (
        <form
          onSubmit={handleSubmit}
          className={`h-11 border-t px-3 flex items-center space-x-2 shrink-0 ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-[#F0F0F0] border-slate-300'}`}
        >
          <div className="animate-ping w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digitare valore e premere invio..."
            className={`flex-1 text-xs font-mono py-1 px-2.5 rounded border shadow-inner focus:outline-none ${
              isDark 
                ? 'bg-zinc-900 border-zinc-700 text-white focus:border-blue-500 placeholder-zinc-500' 
                : 'bg-white border-[#B0B0B0] text-slate-800 focus:border-[#5B8DC4] placeholder-slate-400'
            }`}
            autoFocus
          />
          <button
            type="submit"
            className={`px-2.5 py-1 border font-bold rounded flex items-center gap-1 text-[11px] shadow-sm transition ${
              isDark 
                ? 'bg-zinc-700 border-zinc-600 hover:bg-zinc-650 text-white' 
                : 'bg-[#D5EAFA] border-[#5B8DC4] hover:bg-[#C9DEF5] text-slate-700'
            }`}
          >
            <span>Invia</span>
            <CornerDownLeft size={11} />
          </button>
        </form>
      ) : (
        <div className={`h-4 border-t px-2 flex items-center justify-between text-[10px] font-mono shrink-0 select-none ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-500' : 'bg-[#F0F0F0] border-slate-300 text-slate-400'}`}>
          <span>Pronto</span>
          <span>Log: {consoleMessages.length} righe</span>
        </div>
      )}
    </div>
  );
};
export default Console;
