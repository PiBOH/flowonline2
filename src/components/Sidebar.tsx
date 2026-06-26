import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { CodeGenerator } from '../utils/codeGenerator';
import { translations } from '../utils/translations';
import { Copy, Check, Info } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { variables, statements, language, layout, setLayout, colorScheme } = useFlow();
  const [targetLang, setTargetLang] = useState<'python' | 'cpp' | 'java' | 'javascript' | 'csharp'>('javascript');
  const [copied, setCopied] = useState(false);

  const t = translations[language];

  // Compile code in real time
  const generatedCode = React.useMemo(() => {
    return CodeGenerator.generate(statements, targetLang);
  }, [statements, targetLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const variableList = Object.values(variables);

  // Determine what to show in the sidebar based on the layout
  const isWatchLayout = layout === 'flow_variables' || layout === 'triple_split';
  const isCodeLayout = layout === 'flow_code';

  // If neither layout is active, do not render sidebar at all
  if (!isWatchLayout && !isCodeLayout) return null;

  // DYNAMIC THEME STYLING (Twilight dark mode, Black/White, and Classic support)
  const isDark = colorScheme === 'twilight';
  const isBW = colorScheme === 'black_white';

  const panelBg = isDark ? "bg-zinc-900 border-zinc-700" : isBW ? "bg-white border-black" : "bg-[#F0F0F0] border-slate-300";
  const headerBg = isDark ? "bg-zinc-800 text-zinc-100" : isBW ? "bg-black text-white" : "bg-gradient-to-r from-[#3E6FA8] to-[#7AAFE0] text-white";
  const contentBg = isDark ? "bg-zinc-950 text-zinc-100 border-zinc-800" : isBW ? "bg-white text-black border-black" : "bg-white text-slate-800 border-[#C8C8C8]";
  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-slate-50 border-slate-200";
  const gridBg = isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-slate-200";
  const subText = isDark ? "text-zinc-500" : "text-slate-400";

  return (
    <div className={`w-[300px] h-full flex flex-col p-1 shrink-0 z-15 ${panelBg}`}>
      
      {/* ============ WIN32 PANEL HEADER ============ */}
      <div 
        style={!isDark && !isBW ? { background: 'linear-gradient(to right, #3E6FA8 0%, #7AAFE0 100%)' } : {}}
        className={`h-[24px] flex items-center justify-between px-2 cursor-default shrink-0 text-white font-sans ${headerBg}`}
      >
        <span className="text-[11px] font-bold tracking-wide">
          {isWatchLayout ? '👁️ Watch Variabili - Flowonline2' : '📝 Codice Sorgente - Flowonline2'}
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => {
              if (layout === 'triple_split') setLayout('flow_console');
              else setLayout('flowchart_only');
            }}
            className="w-[14px] h-[14px] bg-[#E81123]/80 hover:bg-[#E81123] rounded-sm flex items-center justify-center text-[10px] text-white font-bold"
            title="Chiudi Finestra"
          >
            ×
          </button>
        </div>
      </div>

      {/* Pane Content */}
      <div className={`flex-1 mt-1 p-3 flex flex-col overflow-hidden border ${contentBg}`}>
        {isWatchLayout ? (
          /* ============ VARIABLE WATCH GRID ============ */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 font-sans select-none ${subText}`}>
              Variabili Attive in Memoria
            </h4>
            
            {variableList.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 select-none">
                <Info size={24} className="mb-2 stroke-[1.5] text-slate-300" />
                <p className="text-[11px] font-sans italic">{t.sidebar.noVariables}</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto space-y-2">
                {variableList.map((v) => (
                  <div
                    key={v.name}
                    className={`p-2.5 rounded flex flex-col gap-1.5 border ${cardBg}`}
                  >
                    {/* Variable Name and Badge */}
                    <div className={`flex items-center justify-between border-b pb-1.5 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-1.5">
                        {/* Type Icon circles mimicking Flowgorithm! */}
                        <span className={`w-[9px] h-[9px] rounded-full inline-block ${
                          v.type === 'Integer'
                            ? 'bg-emerald-500'
                            : v.type === 'Real'
                            ? 'bg-amber-400'
                            : v.type === 'Boolean'
                            ? 'bg-purple-500'
                            : 'bg-sky-400'
                        }`} title={v.type} />
                        <span className={`font-mono text-[12px] font-bold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{v.name}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-tight">
                        {v.type}{v.isArray ? '[]' : ''}
                      </span>
                    </div>

                    {/* Variable Value */}
                    {v.isArray ? (
                      <div className="space-y-1">
                        <div className={`max-h-[100px] overflow-y-auto border rounded p-1 divide-y ${gridBg} ${isDark ? 'divide-zinc-800' : 'divide-slate-50'}`}>
                          {(v.value as any[]).map((val, idx) => (
                            <div key={idx} className="flex items-center justify-between py-0.5 px-1.5 text-[11px] font-mono">
                              <span className="text-slate-400">[{idx}]</span>
                              <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-[#1F3354]'}`}>{String(val === null || val === undefined ? 'None' : val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Valore:</span>
                        <span className={`font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{String(v.value === null || v.value === undefined ? 'None' : v.value)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ============ SOURCE CODE GENERATOR ============ */
          <div className="flex-1 flex flex-col h-full overflow-hidden space-y-3">
            <div className="flex flex-col space-y-1 select-none">
              <label className={`text-[10px] font-bold uppercase tracking-wide ${subText}`}>
                Seleziona Linguaggio
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as any)}
                className={`w-full text-xs font-semibold p-1.5 border rounded focus:outline-none ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-700 text-white' 
                    : 'bg-white border-[#B0B0B0] text-slate-700'
                }`}
              >
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript (Node/Web)</option>
                <option value="cpp">C++ (Standard)</option>
                <option value="java">Java (OOP)</option>
                <option value="csharp">C# (C-Sharp)</option>
              </select>
            </div>

            <div className={`flex-1 flex flex-col border rounded overflow-hidden relative ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-[#C8C8C8] bg-slate-900'}`}>
              <div className={`h-7 px-2 flex items-center justify-between select-none border-b ${isDark ? 'bg-zinc-850 border-zinc-800' : 'bg-slate-800 border-slate-700'}`}>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {targetLang}_output.txt
                </span>
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition"
                  title="Copy"
                >
                  {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
              </div>

              <textarea
                value={generatedCode}
                readOnly
                className="flex-1 p-2 font-mono text-[10px] text-slate-300 bg-slate-950 focus:outline-none resize-none leading-relaxed overflow-auto"
              />
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};
export default Sidebar;
