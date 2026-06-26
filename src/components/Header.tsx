import React, { useRef, useState, useEffect } from 'react';
import { useFlow, AppLayout } from '../context/FlowContext';
import { translations } from '../utils/translations';
import { FprgParser } from '../utils/fprgParser';
import { Language } from '../types/flow';

export const Header: React.FC = () => {
  const {
    programTitle,
    setProgramTitle,
    programAuthor,
    setProgramAuthor,
    layout,
    setLayout,
    colorScheme,
    setColorScheme,
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
  const menuBarRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Dropdown states for Menus
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // About Modal state
  const [showAbout, setShowAbout] = useState(false);
  const [licenseText, setLicenseText] = useState('Loading license...');

  // Hardcoded fallback license text
  const mitLicenseTextFallback = `MIT License

Copyright (c) 2026 PiBOH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  // LOCAL MENU & ABOUT TRANSLATIONS (For 1000% multilingual fidelity!)
  const menuTranslations: Record<Language, {
    file: string;
    edit: string;
    program: string;
    help: string;
    new: string;
    open: string;
    save: string;
    backup: string;
    exportSvg: string;
    undo: string;
    redo: string;
    run: string;
    step: string;
    pause: string;
    stop: string;
    about: string;
    aboutTitle: string;
    aboutVersion: string;
    aboutAuthor: string;
    aboutWebsite: string;
    aboutRepo: string;
    aboutLicense: string;
    colorSchemeLabel: string;
  }> = {
    en: {
      file: "File",
      edit: "Edit",
      program: "Program",
      help: "Help",
      new: "New",
      open: "Open...",
      save: "Save (.fprg)",
      backup: "Backup JSON",
      exportSvg: "Export SVG Image",
      undo: "Undo",
      redo: "Redo",
      run: "Run",
      step: "Step",
      pause: "Pause",
      stop: "Stop",
      about: "About Flowonline2...",
      aboutTitle: "About Flowonline2",
      aboutVersion: "Version ALPHA 2.0.8",
      aboutAuthor: "Author",
      aboutWebsite: "Website",
      aboutRepo: "Repository",
      aboutLicense: "Program License:",
      colorSchemeLabel: "Color Scheme:"
    },
    en_GB: {
      file: "File",
      edit: "Edit",
      program: "Program",
      help: "Help",
      new: "New",
      open: "Open...",
      save: "Save (.fprg)",
      backup: "Backup JSON",
      exportSvg: "Export SVG Image",
      undo: "Undo",
      redo: "Redo",
      run: "Run",
      step: "Step",
      pause: "Pause",
      stop: "Stop",
      about: "About Flowonline2...",
      aboutTitle: "About Flowonline2",
      aboutVersion: "Version ALPHA 2.0.8",
      aboutAuthor: "Author",
      aboutWebsite: "Website",
      aboutRepo: "Repository",
      aboutLicense: "Program License:",
      colorSchemeLabel: "Color Scheme:"
    },
    it: {
      file: "File",
      edit: "Modifica",
      program: "Programma",
      help: "?",
      new: "Nuovo",
      open: "Apri...",
      save: "Salva (.fprg)",
      backup: "Backup JSON",
      exportSvg: "Esporta Immagine SVG",
      undo: "Annulla (Undo)",
      redo: "Ripristina (Redo)",
      run: "Esegui (Run)",
      step: "Passo-Passo (Step)",
      pause: "Pausa",
      stop: "Stop",
      about: "Informazioni su Flowonline2...",
      aboutTitle: "Informazioni su Flowonline2",
      aboutVersion: "Versione ALPHA 2.0.8",
      aboutAuthor: "Autore",
      aboutWebsite: "Sito Web",
      aboutRepo: "Repository",
      aboutLicense: "Licenza del Programma:",
      colorSchemeLabel: "Schema Colori:"
    },
    de: {
      file: "Datei",
      edit: "Bearbeiten",
      program: "Programm",
      help: "Hilfe",
      new: "Neu",
      open: "Öffnen...",
      save: "Speichern (.fprg)",
      backup: "Backup JSON",
      exportSvg: "SVG-Bild exportieren",
      undo: "Rückgängig",
      redo: "Wiederholen",
      run: "Ausführen",
      step: "Schritt-für-Schritt",
      pause: "Pause",
      stop: "Stopp",
      about: "Über Flowonline2...",
      aboutTitle: "Über Flowonline2",
      aboutVersion: "Version ALPHA 2.0.8",
      aboutAuthor: "Autor",
      aboutWebsite: "Website",
      aboutRepo: "Repository",
      aboutLicense: "Lizenz:",
      colorSchemeLabel: "Farbschema:"
    },
    fr: {
      file: "Fichier",
      edit: "Édition",
      program: "Programme",
      help: "Aide",
      new: "Nouveau",
      open: "Ouvrir...",
      save: "Enregistrer (.fprg)",
      backup: "Sauvegarde JSON",
      exportSvg: "Exporter l'image SVG",
      undo: "Annuler",
      redo: "Rétablir",
      run: "Exécuter",
      step: "Pas-à-pas",
      pause: "Pause",
      stop: "Arrêter",
      about: "À propos de Flowonline2...",
      aboutTitle: "À propos de Flowonline2",
      aboutVersion: "Version ALPHA 2.0.8",
      aboutAuthor: "Auteur",
      aboutWebsite: "Site Web",
      aboutRepo: "Dépôt",
      aboutLicense: "Licence:",
      colorSchemeLabel: "Palette de couleurs:"
    },
    es: {
      file: "Archivo",
      edit: "Editar",
      program: "Programa",
      help: "Ayuda",
      new: "Nuevo",
      open: "Abrir...",
      save: "Guardar (.fprg)",
      backup: "Copia JSON",
      exportSvg: "Exportar Imagen SVG",
      undo: "Deshacer",
      redo: "Rehacer",
      run: "Ejecutar",
      step: "Paso a paso",
      pause: "Pausa",
      stop: "Detener",
      about: "Acerca de Flowonline2...",
      aboutTitle: "Acerca de Flowonline2",
      aboutVersion: "Versión ALPHA 2.0.8",
      aboutAuthor: "Autor",
      aboutWebsite: "Sitio Web",
      aboutRepo: "Repositorio",
      aboutLicense: "Licencia:",
      colorSchemeLabel: "Esquema de colores:"
    }
  };

  const mt = menuTranslations[language];

  // Dynamically load the LICENSE file from the repository root/build folder
  useEffect(() => {
    if (showAbout) {
      setLicenseText('Loading license...');
      fetch('./LICENSE')
        .then((res) => {
          if (!res.ok) {
            throw new Error('LICENSE file not found or not readable.');
          }
          return res.text();
        })
        .then((text) => setLicenseText(text))
        .catch((err) => {
          console.warn('Unable to load LICENSE in real-time, using fallback:', err);
          setLicenseText(mitLicenseTextFallback);
        });
    }
  }, [showAbout]);

  // Global click listener to close dropdowns when clicking outside (Win32 behavior!)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, []);

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
        alert(`Error opening .fprg file: ${err.message}`);
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
      link.download = `${programTitle.toLowerCase().replace(/\s+/g, '_') || 'diagram'}.fprg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Error saving file: ${err.message}`);
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
    link.download = `${programTitle.toLowerCase().replace(/\s+/g, '_') || 'diagram'}_backup.json`;
    link.click();
    URL.revokeObjectURL(url);
    setActiveDropdown(null);
  };

  const handleExportSvg = () => {
    const svgEl = document.getElementById('flowchart-svg-export-target');
    if (!svgEl) {
      alert('Unable to find SVG flowchart elements for export.');
      return;
    }
    const svgClone = svgEl.cloneNode(true) as SVGElement;
    svgClone.style.transform = '';
    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${programTitle.toLowerCase().replace(/\s+/g, '_') || 'diagram'}.svg`;
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

  // Win32 hover-to-slide menu bar logic!
  const handleMenuMouseEnter = (menuId: string) => {
    if (activeDropdown !== null) {
      setActiveDropdown(menuId);
    }
  };

  const isRunning = executionStatus === 'running';
  const isStopped = executionStatus === 'stopped' || executionStatus === 'idle';

  const layoutButtons: Array<{ id: AppLayout; label: string; tooltip: string }> = [
    { id: 'flowchart_only', label: '🖥️', tooltip: 'Flowchart Only' },
    { id: 'flow_variables', label: '📊', tooltip: 'Flowchart & Watch' },
    { id: 'flow_console', label: '💬', tooltip: 'Flowchart & Console' },
    { id: 'triple_split', label: '🚀', tooltip: 'Triple Split View' },
    { id: 'flow_code', label: '📝', tooltip: 'Flowchart & Source Code' }
  ];

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
          <span className="text-[11px] font-semibold text-white font-sans tracking-wide">
            Flowonline2 ALPHA 2.0.8 - {programTitle || 'Untitled'}.fprg
          </span>
        </div>

        {/* Windows Frame Minimize / Maximize / Close simulation */}
        <div className="flex h-full">
          <button className="w-[44px] h-[28px] hover:bg-white/20 text-white font-sans text-[11px] transition">─</button>
          <button className="w-[44px] h-[28px] hover:bg-white/20 text-white font-sans text-[11px] transition">▢</button>
          <button onClick={() => window.close()} className="w-[44px] h-[28px] hover:bg-red-600 text-white font-sans text-[11px] transition">✕</button>
        </div>
      </div>

      {/* ============ MENU BAR (Faithful Windows Desktop Style with hover sliding) ============ */}
      <div 
        ref={menuBarRef}
        className="h-[24px] bg-[#F0F0F0] border-b border-[#C8C8C8] flex items-center px-[4px] relative z-40 text-slate-800 text-[12px] font-sans"
      >
        
        {/* FILE MENU */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('file')}
            onMouseEnter={() => handleMenuMouseEnter('file')}
            className={`px-[10px] py-[2px] h-[20px] flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'file' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            {mt.file}
          </button>
          {activeDropdown === 'file' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[200px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <button onClick={handleNew} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between text-slate-800">
                <span>📄 {mt.new}</span>
                <span className="text-[10px] text-slate-400">Ctrl+N</span>
              </button>
              <button onClick={() => { fileInputRef.current?.click(); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between text-slate-800">
                <span>📂 {mt.open}</span>
                <span className="text-[10px] text-slate-400">Ctrl+O</span>
              </button>
              <div className="h-[1px] bg-slate-300 my-1"></div>
              <button onClick={handleExportFprg} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between text-slate-800">
                <span>💾 {mt.save}</span>
                <span className="text-[10px] text-slate-400">Ctrl+S</span>
              </button>
              <button onClick={handleExportJson} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>📦 {mt.backup}</span>
              </button>
              <button onClick={handleExportSvg} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>🖼️ {mt.exportSvg}</span>
              </button>
            </div>
          )}
        </div>

        {/* MODIFICA MENU (Includes Flowgorithm's official Color Schemes) */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('edit')}
            onMouseEnter={() => handleMenuMouseEnter('edit')}
            className={`px-[10px] py-[2px] h-full flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'edit' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            {mt.edit}
          </button>
          {activeDropdown === 'edit' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[200px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <button onClick={undo} disabled={!canUndo} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-40 text-slate-800">
                <span>↩ {mt.undo}</span>
                <span className="text-[10px] text-slate-400">Ctrl+Z</span>
              </button>
              <button onClick={redo} disabled={!canRedo} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-40 text-slate-800">
                <span>↪ {mt.redo}</span>
                <span className="text-[10px] text-slate-400">Ctrl+Y</span>
              </button>
              
              <div className="h-[1px] bg-slate-300 my-1"></div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">{mt.colorSchemeLabel}</div>
              
              <button onClick={() => { setColorScheme('classic'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Classic</span>
                {colorScheme === 'classic' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('pastel'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Pastel</span>
                {colorScheme === 'pastel' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('vibrant'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Vibrant</span>
                {colorScheme === 'vibrant' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('retro'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Retro</span>
                {colorScheme === 'retro' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('twilight'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Twilight (Dark)</span>
                {colorScheme === 'twilight' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('black_white'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Black & White</span>
                {colorScheme === 'black_white' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* PROGRAMMA MENU */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('program')}
            onMouseEnter={() => handleMenuMouseEnter('program')}
            className={`px-[10px] py-[2px] h-full flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'program' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            {mt.program}
          </button>
          {activeDropdown === 'program' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[180px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <button onClick={() => { startRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>▶ {mt.run}</span>
              </button>
              <button onClick={() => { stepRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>⏭ {mt.step}</span>
              </button>
              <button onClick={() => { pauseRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>⏸ {mt.pause}</span>
              </button>
              <button onClick={() => { stopRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>⏹ {mt.stop}</span>
              </button>
            </div>
          )}
        </div>

        {/* HELP / ? MENU */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('help')}
            onMouseEnter={() => handleMenuMouseEnter('help')}
            className={`px-[10px] py-[2px] h-full flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'help' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            {mt.help}
          </button>
          {activeDropdown === 'help' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[180px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <button onClick={() => { setShowAbout(true); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800 font-bold">
                <span>ℹ️ {mt.about}</span>
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
            <option value="it">Italiano</option>
            <option value="de">Deutsch</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
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
          title="Nuovo (Ctrl+N)"
        >
          📄
        </button>

        {/* OPEN BUTTON (CRITICAL FIX: This now works perfectly because input type=file is always in DOM!) */}
        <button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className="w-[32px] h-[32px] hover:bg-slate-200/50 hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-slate-700 text-sm active:scale-95 transition-all"
          title="Apri (Ctrl+O)"
        >
          📂
        </button>

        {/* SAVE BUTTON */}
        <button
          onClick={handleExportFprg}
          className="w-[32px] h-[32px] hover:bg-slate-200/50 hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-slate-700 text-sm active:scale-95 transition-all"
          title="Salva (Ctrl+S)"
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

        {/* LAYOUT SELECTOR CONTROL WINDOWS (Classic Flowgorithm buttons!) */}
        <div className="flex items-center gap-[1px]">
          {layoutButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setLayout(btn.id)}
              className={`w-[26px] h-[26px] flex items-center justify-center rounded-[3px] border text-xs transition-all ${
                layout === btn.id
                  ? 'bg-[#C9DEF5] border-[#5B8DC4] shadow-inner font-bold'
                  : 'bg-transparent border-transparent hover:bg-slate-200/50 hover:border-slate-300'
              }`}
              title={btn.tooltip}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="w-[1px] h-[24px] bg-[#B0B0B0] mx-[6px] shadow-[1px_0_0_#FAFAFA]"></div>

        {/* SPEED CONTROL (FAITHFUL MULTILINGUAL LABEL - SPEED / VELOCITÀ) */}
        <div className="flex items-center gap-2 pl-2 text-slate-500 text-[10px] font-bold font-sans">
          <span>{t.toolbar.speed.toUpperCase()}:</span>
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
        <div className="hidden lg:flex items-center gap-3 pl-2">
          <div className="flex flex-col text-[10px] font-sans">
            <span className="text-slate-400 uppercase font-black tracking-tight text-[7px] leading-none mb-0.5">Algorithm Name</span>
            <input
              type="text"
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              className="bg-white hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded border border-slate-300 text-[10px] font-bold text-slate-800 px-1 py-0.5 w-32 focus:outline-none"
              placeholder="My Algorithm"
            />
          </div>
          <div className="flex flex-col text-[10px] font-sans">
            <span className="text-slate-400 uppercase font-black tracking-tight text-[7px] leading-none mb-0.5">Author</span>
            <input
              type="text"
              value={programAuthor}
              onChange={(e) => setProgramAuthor(e.target.value)}
              className="bg-white hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded border border-slate-300 text-[10px] text-slate-700 px-1 py-0.5 w-24 focus:outline-none"
              placeholder="Author"
            />
          </div>
        </div>
      </div>

      {/* ============ WIN32 ABOUT DIALOG MODAL (ENLARGED & PERFECT INLINE SIZING) ============ */}
      {showAbout && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
          <div 
            className="bg-[#F0F0F0] border-2 border-slate-400 rounded-sm shadow-2xl overflow-hidden flex flex-col font-sans select-none"
            style={{ width: '450px' }} // EXPLICIT INLINE SIZE ENLARGEMENT!
          >
            {/* About Modal Title Bar */}
            <div 
              className="h-[24px] text-white flex items-center justify-between px-2 cursor-default"
              style={{
                background: 'linear-gradient(to right, #3E6FA8 0%, #7AAFE0 100%)'
              }}
            >
              <span className="text-[11px] font-bold text-white font-sans tracking-wide">
                {mt.aboutTitle}
              </span>
              <button 
                onClick={() => setShowAbout(false)}
                className="w-[14px] h-[14px] bg-[#E81123]/80 hover:bg-[#E81123] rounded-sm flex items-center justify-center text-[10px] text-white font-bold"
              >
                ×
              </button>
            </div>

            {/* About Modal Body (Win32 Dialog layout) */}
            <div className="p-4 flex flex-col space-y-3.5 bg-[#F0F0F0] text-slate-800">
              
              <div className="flex items-start gap-4">
                {/* Large Flowgorithm Colored logo */}
                <div className="w-12 h-12 bg-white rounded border border-slate-300 shadow-inner flex items-center justify-center shrink-0">
                  <svg className="w-9 h-9" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="10" height="8" fill="#84C44C" stroke="#333" strokeWidth="1.5" />
                    <rect x="18" y="4" width="10" height="8" fill="#F2A93B" stroke="#333" strokeWidth="1.5" />
                    <polygon points="4,18 14,18 12,26 6,26" fill="#E14C4C" stroke="#333" strokeWidth="1.5" />
                    <polygon points="18,18 28,18 26,26 20,26" fill="#4B9DDC" stroke="#333" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="flex flex-col gap-0.5 leading-tight text-[12px] font-sans">
                  <h4 className="font-extrabold text-[14px] text-slate-900 tracking-wide">Flowonline2</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">{mt.aboutVersion}</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {mt.aboutAuthor}: <a href="https://piboh.github.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">PiBOH</a>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {mt.aboutWebsite}: <a href="https://piboh.github.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">piboh.github.io</a>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {mt.aboutRepo}: <a href="https://github.com/PiBOH/flowonline2" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/PiBOH/flowonline2</a>
                  </p>
                </div>
              </div>

              {/* License automatically loaded text box */}
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{mt.aboutLicense}</span>
                <textarea
                  readOnly
                  value={licenseText}
                  className="w-full h-32 border border-slate-300 rounded p-2 font-mono text-[10px] bg-white text-slate-600 focus:outline-none resize-none overflow-auto leading-relaxed shadow-inner"
                />
              </div>

              {/* OK button to close dialog (Win32 styled) */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShowAbout(false)}
                  className="px-6 py-1 bg-white hover:bg-slate-100 border border-slate-400 hover:border-slate-500 text-slate-800 text-[11px] font-bold rounded shadow-sm focus:outline-none transition active:scale-95"
                >
                  OK
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CRITICAL FILE INPUT (Rendered outside conditional blocks so it's always in the DOM and available for toolbar click!) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".fprg" 
        className="hidden" 
      />

    </div>
  );
};
