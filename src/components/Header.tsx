import React, { useRef } from 'react';
import { useFlow } from '../context/FlowContext';
import { translations } from '../utils/translations';
import { FprgParser } from '../utils/fprgParser';
import {
  Play,
  Pause,
  Square,
  ChevronRight,
  RotateCcw,
  RotateCw,
  FolderOpen,
  Save,
  Download,
  Image,
  Globe
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    programTitle,
    programAuthor,
    setProgramTitle,
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
    loadProgram
  } = useFlow();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  // FILE OPEN: load .fprg file
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
    // Reset file input value
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // FILE SAVE: export .fprg file
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
  };

  // JSON BACKUP
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
  };

  // SVG IMAGE EXPORT
  const handleExportSvg = () => {
    const svgEl = document.getElementById('flowchart-svg-export-target');
    if (!svgEl) {
      alert('Impossibile trovare il diagramma SVG da esportare.');
      return;
    }

    // Clone the node to clean export styles
    const svgClone = svgEl.cloneNode(true) as SVGElement;
    // Remove scale style to ensure correct sizes
    svgClone.style.transform = '';
    
    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${programTitle.toLowerCase().replace(/\s+/g, '_') || 'diagramma'}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isRunning = executionStatus === 'running';
  const isStopped = executionStatus === 'stopped' || executionStatus === 'idle';

  return (
    <header className="h-16 bg-slate-800 text-white border-b border-slate-900 px-5 flex items-center justify-between z-30 select-none shadow-md shrink-0">
      {/* Brand License Logo */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center font-bold font-sans text-white text-xl tracking-tighter shadow-md">
          F2
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-sans font-black text-sm tracking-wide uppercase leading-none text-emerald-400">
              Flowonline2
            </h1>
            <span className="text-[9px] bg-slate-700 text-slate-300 font-mono font-bold px-1 py-0.5 rounded">
              v1.0 MIT
            </span>
          </div>
          <p className="text-[10px] font-sans text-slate-400 leading-tight">
            sviluppato da <span className="font-semibold text-slate-300">PiBOH</span>
          </p>
        </div>
      </div>

      {/* Program Info Fields (Editable) */}
      <div className="hidden lg:flex items-center space-x-3 px-4 border-l border-r border-slate-700/60 max-w-xs xl:max-w-md">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider leading-none">Nome Programma</span>
          <input
            type="text"
            value={programTitle}
            onChange={(e) => setProgramTitle(e.target.value)}
            className="bg-transparent hover:bg-slate-700/40 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 rounded border border-transparent focus:border-blue-500 text-xs font-bold text-white px-1.5 py-0.5 w-36 transition focus:outline-none"
            placeholder="Mio Algoritmo"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider leading-none">Autore</span>
          <input
            type="text"
            value={programAuthor}
            onChange={(e) => setProgramAuthor(e.target.value)}
            className="bg-transparent hover:bg-slate-700/40 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 rounded border border-transparent focus:border-blue-500 text-xs text-slate-300 px-1.5 py-0.5 w-24 transition focus:outline-none"
            placeholder="Autore"
          />
        </div>
      </div>

      {/* RUNTIME INTERPRETER CONTROLS */}
      <div className="flex items-center space-x-1.5 bg-slate-900/40 p-1.5 rounded-lg border border-slate-700/40">
        <button
          onClick={startRun}
          disabled={isRunning}
          className={`p-1.5 rounded transition ${
            isRunning
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-emerald-400 hover:bg-slate-700'
          }`}
          title={t.toolbar.run}
        >
          <Play size={15} fill="currentColor" />
        </button>

        <button
          onClick={stepRun}
          className="p-1.5 text-blue-400 hover:bg-slate-700 rounded transition"
          title={t.toolbar.step}
        >
          <ChevronRight size={15} className="stroke-[2.5]" />
        </button>

        <button
          onClick={pauseRun}
          disabled={!isRunning}
          className={`p-1.5 rounded transition ${
            !isRunning
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-amber-400 hover:bg-slate-700'
          }`}
          title={t.toolbar.pause}
        >
          <Pause size={15} fill="currentColor" />
        </button>

        <button
          onClick={stopRun}
          disabled={isStopped}
          className={`p-1.5 rounded transition ${
            isStopped
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-red-400 hover:bg-slate-700'
          }`}
          title={t.toolbar.stop}
        >
          <Square size={14} fill="currentColor" />
        </button>

        {/* SPEED SLIDER */}
        <div className="flex items-center space-x-2 pl-3 border-l border-slate-700/60">
          <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
            {t.toolbar.speed}
          </span>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* UNDO / REDO & FILE SYSTEM */}
      <div className="flex items-center space-x-1 pl-4">
        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 border-r border-slate-700/60 pr-2.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition ${
              !canUndo ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title={t.toolbar.undo}
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition ${
              !canRedo ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title={t.toolbar.redo}
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Bidirectional File IO / Export Options */}
        <div className="flex items-center space-x-1 pl-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white rounded transition"
            title={t.toolbar.import}
          >
            <FolderOpen size={14} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".fprg"
            className="hidden"
          />

          <button
            onClick={handleExportFprg}
            className="p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white rounded transition"
            title={t.toolbar.export}
          >
            <Save size={14} />
          </button>

          <button
            onClick={handleExportSvg}
            className="p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white rounded transition"
            title={t.toolbar.exportImage}
          >
            <Image size={14} />
          </button>

          <button
            onClick={handleExportJson}
            className="p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white rounded transition"
            title={t.toolbar.exportJson}
          >
            <Download size={14} />
          </button>
        </div>

        {/* LANGUAGE SELECTOR */}
        <div className="flex items-center space-x-1.5 pl-3 border-l border-slate-700/60">
          <Globe size={13} className="text-slate-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="en">EN (US)</option>
            <option value="en_GB">EN (UK)</option>
            <option value="it">Italiano</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    </header>
  );
};
