import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { CodeGenerator } from '../utils/codeGenerator';
import { translations } from '../utils/translations';
import { Eye, Code, Copy, Check, Info } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { variables, statements, language } = useFlow();
  const [activeTab, setActiveTab] = useState<'watch' | 'code'>('watch');
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

  return (
    <div className="w-80 h-full bg-white border-l border-slate-200 flex flex-col z-10">
      {/* Tabs Headers */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab('watch')}
          className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 text-xs font-bold border-b-2 transition ${
            activeTab === 'watch'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye size={14} />
          <span>{t.sidebar.variables}</span>
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 text-xs font-bold border-b-2 transition ${
            activeTab === 'code'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code size={14} />
          <span>{t.sidebar.codeGen}</span>
        </button>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-auto p-4 flex flex-col">
        {activeTab === 'watch' ? (
          /* VARIABLE WATCH */
          <div className="flex-1 flex flex-col h-full">
            {variableList.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Info size={28} className="mb-2 stroke-[1.5]" />
                <p className="text-xs">{t.sidebar.noVariables}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {variableList.map((v) => (
                  <div
                    key={v.name}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 hover:border-blue-300 transition"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                      <span className="font-mono text-sm font-bold text-slate-800">{v.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        v.type === 'Integer' || v.type === 'Real'
                          ? 'bg-amber-100 text-amber-800'
                          : v.type === 'Boolean'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {v.type}{v.isArray ? '[]' : ''}
                      </span>
                    </div>

                    {v.isArray ? (
                      /* Array item sublist expansion */
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Vettore (Dime: {v.arraySize})</div>
                        <div className="max-h-28 overflow-y-auto border border-slate-150 rounded bg-white p-1 divide-y divide-slate-50">
                          {(v.value as any[]).map((val, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1 px-1.5 text-xs font-mono">
                              <span className="text-slate-400">[{idx}]</span>
                              <span className="font-bold text-slate-700">{String(val === null || val === undefined ? 'None' : val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Scalar Values */
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">{t.sidebar.varVal}:</span>
                        <span className="font-bold text-blue-600">{String(v.value === null || v.value === undefined ? 'None' : v.value)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* CODE GENERATOR PANEL */
          <div className="flex-1 flex flex-col h-full space-y-3">
            {/* Language Selector */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Linguaggio Target
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as any)}
                className="w-full text-xs font-semibold text-slate-700 p-2 border border-slate-200 rounded focus:border-blue-500 focus:outline-none"
              >
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript (Node/Web)</option>
                <option value="cpp">C++ (Standard)</option>
                <option value="java">Java (OOP)</option>
                <option value="csharp">C# (C-Sharp)</option>
              </select>
            </div>

            {/* Generated Code Window */}
            <div className="flex-1 flex flex-col border border-slate-200 rounded-lg overflow-hidden relative bg-slate-900">
              <div className="h-8 bg-slate-850 border-b border-slate-800 px-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  {targetLang}.txt
                </span>
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                </button>
              </div>

              <textarea
                value={generatedCode}
                readOnly
                className="flex-1 p-3 font-mono text-[11px] text-slate-300 bg-slate-950 focus:outline-none resize-none leading-relaxed overflow-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
