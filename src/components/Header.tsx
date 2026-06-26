import React, { useRef, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { translations } from '../utils/translations';
import { FprgParser } from '../utils/fprgParser';

export const Header: React.FC = () => {
  const {
    programTitle,
    setProgramTitle,
    programAuthor,
    setProgramAuthor,
    executionStatus,
    speed,
    setSpeed,
    language,
    setLanguage,
    undo,
    redo,
    canUndo,
    canRedo,
    startRun,
    stepRun,
    pauseRun,
    stopRun,
    statements,
    loadProgram,
    clearAll
  } = useFlow();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  // Dropdown states for Menus
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // File IO actions
  const handleNew = () => {
    clearAll();
    setActiveDropdown(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = FprgParser.parse(content);
        loadProgram(parsed.statements, parsed.title, parsed.author);
      } catch (err: any) {
        alert(`Errore nell'apertura del file .fprg: ${err.message}`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveDropdown(null);
  };

  const handleExportFprg = () => {
    try {
      const xml = FprgParser.serialize(statements, programTitle, programAuthor);
      const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${programTitle.toLowerCase().replace(/\s+/g, '_') || 'diagramma'}.fprg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Errore nel salvataggio: ${err.message}`);
    }
    setActiveDropdown(null);
  };

  const handleExportJson = () => {
    const data = {
      title: programTitle,
      author: programAuthor,
      statements
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${programTitle.toLowerCase().replace(/\s+/g, '_') || 'diagramma'}_backup.json`;
    link.click();
    URL.revokeObjectURL(url);
    setActiveDropdown(null);
  };

  const handleExportSvg = () => {
    const svgEl = document.getElementById('flowchart-svg-export-target');
    if (!svgEl) {
      alert('Impossibile trovare il diagramma SVG da esportare.');
      return;
    }
    const svgClone = svgEl.cloneNode(true) as SVGElement;
    svgClone.style.transform = '';
    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${programTitle.toLowerCase().replace(/\s+/g, '_') || 'diagramma'}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    setActiveDropdown(null);
  };

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  const isRunning = executionStatus === 'running';
  const isStopped = executionStatus === 'stopped' || executionStatus === 'idle';

  return (
    <div className="flex flex-col w-full z-30 select-none shadow-md shrink-0">
      
      {/* ============ TITLE BAR (Faithful Windows Desktop Style) ============ */}
      <div 
        className="h-[28px] text-white flex items-center justify-between px-[6px] border-b border-[#1F3354]"
        style={{
          background: 'linear-gradient(to bottom, #5B8DC4 0%, #3E6FA8 50%, #2F5A8C 100%)'
        }}
      >
        <div className="flex items-center gap-[6px]">
          {/* Flowgorithm 4-box Colored Logo */}
          <svg className="w-[16px] h-[16px]" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="10" height="8" fill="#84C44C" stroke="#333" strokeWidth="1.5" />
            <rect x="18" y="4" width="10" height="8" fill="#F2A93B" stroke="#333" strokeWidth="1.5" />
            <polygon points="4,18 14,18 12,26 6,26" fill="#E14C4C" stroke="#333" strokeWidth="1.5" />
            <polygon points="18,18 28,18 26,26 20,26" fill="#4B9DDC" stroke="#333" strokeWidth="1.5" />
          </svg>
          <span className="text-[12px] font-semibold text-white font-sans tracking-wide">
            Flowonline2 BETA - {programTitle || 'Untitled'}.fprg
          </span>
        </div>

        {/* Windows Frame Minimize / Maximize / Close simulation */}
        <div className="flex h-full">
          <button className="w-[44px] h-[28px] hover:bg-white/20 text-white font-sans text-[11px] transition">─</button>
          <button className="w-[44px] h-[28px] hover:bg-white/20 text-white font-sans text-[11px] transition">▢</button>
          <button className="w-[44px] h-[28px] hover:bg-red-600 text-white font-sans text-[11px] transition">✕</button>
        </div>
      </div>

      {/* ============ MENU BAR (Faithful Windows Desktop Style) ============ */}
      <div className="h-[24px] bg-[#F0F0F0] border-b border-[#C8C8C8] flex items-center px-[4px] relative z-40 text-slate-800 text-[12px] font-sans">
        
        {/* FILE MENU */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('file')}
            className={`px-[10px] py-[2px] h-full flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'file' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            File
          </button>
          {activeDropdown === 'file' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[200px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <button onClick={handleNew} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between text-slate-800">
                <span>📄 Nuovo</span>
                <span className="text-[10px] text-slate-400">Ctrl+N</span>
              </button>
              <button onClick={() => { fileInputRef.current?.click(); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between text-slate-800">
                <span>📂 Apri...</span>
                <span className="text-[10px] text-slate-400">Ctrl+O</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".fprg" className="hidden" />
              <div className="h-[1px] bg-slate-300 my-1"></div>
              <button onClick={handleExportFprg} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between text-slate-800">
                <span>💾 Salva (.fprg)</span>
                <span className="text-[10px] text-slate-400">Ctrl+S</span>
              </button>
              <button onClick={handleExportJson} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>📦 Backup JSON</span>
              </button>
              <button onClick={handleExportSvg} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>🖼️ Esporta Immagine SVG</span>
              </button>
            </div>
          )}
        </div>

        {/* MODIFICA MENU */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('edit')}
            className={`px-[10px] py-[2px] h-full flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'edit' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            Modifica
          </button>
          {activeDropdown === 'edit' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[180px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <button onClick={undo} disabled={!canUndo} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-40 text-slate-800">
                <span>↩ Annulla (Undo)</span>
                <span className="text-[10px] text-slate-400">Ctrl+Z</span>
              </button>
              <button onClick={redo} disabled={!canRedo} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-40 text-slate-800">
                <span>↪ Ripristina (Redo)</span>
                <span className="text-[10px] text-slate-400">Ctrl+Y</span>
              </button>
            </div>
          )}
        </div>

        {/* PROGRAMMA MENU */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('program')}
            className={`px-[10px] py-[2px] h-full flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'program' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            Programma
          </button>
          {activeDropdown === 'program' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[180px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <button onClick={() => { startRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>▶ Esegui (Run)</span>
              </button>
              <button onClick={() => { stepRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>⏭ Passo-Passo (Step)</span>
              </button>
              <button onClick={() => { pauseRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>⏸ Pausa</span>
              </button>
              <button onClick={() => { stopRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>⏹ Stop</span>
              </button>
            </div>
          )}
        </div>

        {/* GLOBE LANGUAGE SWITCHER */}
        <div className="relative ml-auto mr-2 flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
          <span>Lingua:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="border border-[#B0B0B0] bg-white rounded-md py-0.5 px-1.5 text-slate-700 font-bold focus:outline-none cursor-pointer"
          >
            <option value="en">English (US)</option>
            <option value="en_GB">English (UK)</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="it">Italiano</option>
          </select>
        </div>
      </div>

      {/* ============ TOOLBAR (Faithful Windows Desktop Style) ============ */}
      <div 
        className="h-[36px] border-b border-[#B0B0B0] flex items-center px-[4px] gap-[1px]"
        style={{
          background: 'linear-gradient(to bottom, #FAFAFA, #E4E4E4)'
        }}
      >
        {/* NEW BUTTON */}
        <button
          onClick={handleNew}
          className="w-[32px] h-[32px] hover:bg-slate-200/50 hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-slate-700 text-sm active:scale-95 transition-all"
          title="Nuovo"
        >
          📄
        </button>

        {/* OPEN BUTTON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-[32px] h-[32px] hover:bg-slate-200/50 hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-slate-700 text-sm active:scale-95 transition-all"
          title="Apri"
        >
          📂
        </button>

        {/* SAVE BUTTON */}
        <button
          onClick={handleExportFprg}
          className="w-[32px] h-[32px] hover:bg-slate-200/50 hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-slate-700 text-sm active:scale-95 transition-all"
          title="Salva"
        >
          💾
        </button>

        <div className="w-[1px] h-[24px] bg-[#B0B0B0] mx-[6px] shadow-[1px_0_0_#FAFAFA]"></div>

        {/* RUN BUTTON */}
        <button
          onClick={startRun}
          disabled={isRunning}
          className="w-[32px] h-[32px] hover:bg-[#D5EAFA] hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-emerald-600 font-bold active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
          title={t.toolbar.run}
        >
          ▶
        </button>

        {/* STEP BUTTON */}
        <button
          onClick={stepRun}
          className="w-[32px] h-[32px] hover:bg-[#D5EAFA] hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-blue-600 font-bold active:scale-95 transition-all"
          title={t.toolbar.step}
        >
          ⏭
        </button>

        {/* PAUSE BUTTON */}
        <button
          onClick={pauseRun}
          disabled={!isRunning}
          className="w-[32px] h-[32px] hover:bg-[#FCD2E6] hover:border hover:border-[#B03F70] hover:shadow-sm rounded-[3px] flex items-center justify-center text-amber-600 font-bold active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
          title={t.toolbar.pause}
        >
          ⏸
        </button>

        {/* STOP BUTTON */}
        <button
          onClick={stopRun}
          disabled={isStopped}
          className="w-[32px] h-[32px] hover:bg-rose-100 hover:border hover:border-red-400 hover:shadow-sm rounded-[3px] flex items-center justify-center text-red-600 font-bold active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
          title={t.toolbar.stop}
        >
          ⏹
        </button>

        <div className="w-[1px] h-[24px] bg-[#B0B0B0] mx-[6px] shadow-[1px_0_0_#FAFAFA]"></div>

        {/* SPEED CONTROL */}
        <div className="flex items-center gap-2 pl-2 text-slate-500 text-[11px] font-bold font-sans">
          <span>VELOCITÀ:</span>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
            className="w-[80px] h-[4px] bg-slate-300 rounded appearance-none cursor-pointer accent-[#2F5A8C]"
          />
        </div>

        <div className="w-[1px] h-[24px] bg-[#B0B0B0] mx-[6px] shadow-[1px_0_0_#FAFAFA]"></div>

        {/* META ATTRIBUTI (Editable directly on Toolbar) */}
        <div className="hidden md:flex items-center gap-3 pl-2">
          <div className="flex flex-col text-[10px] font-sans">
            <span className="text-slate-400 uppercase font-black tracking-tight text-[8px] leading-none">TITOLO ALGORITMO</span>
            <input
              type="text"
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              className="bg-white border border-slate-300 rounded text-slate-800 px-1 py-0.5 w-[140px] text-[11px] font-bold focus:outline-none focus:border-[#5B8DC4]"
            />
          </div>
          <div className="flex flex-col text-[10px] font-sans">
            <span className="text-slate-400 uppercase font-black tracking-tight text-[8px] leading-none">AUTORE</span>
            <input
              type="text"
              value={programAuthor}
              onChange={(e) => setProgramAuthor(e.target.value)}
              className="bg-white border border-slate-300 rounded text-slate-800 px-1 py-0.5 w-[100px] text-[11px] focus:outline-none focus:border-[#5B8DC4]"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
