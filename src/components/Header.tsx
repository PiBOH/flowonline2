import React, { useRef, useState, useEffect } from 'react';
import { useFlow, AppLayout } from '../context/FlowContext';
import { translations } from '../utils/translations';
import { FprgParser } from '../utils/fprgParser';
import { exportToPNG, exportToPDF } from '../utils/exportUtils';
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
    zoom,
    setZoom,
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
    clearAll,
    clearLocalStorage,
    // BLOCK SELECTION, COPY & PASTE (Version 2.0.13!)
    selectedBlockId,
    copiedBlock,
    copyBlock,
    cutBlock,
    pasteBlock
  } = useFlow();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Dropdown states for Menus
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Dynamic App Version state (BETA 2.1.0 fallback default!)
  const [appVersion, setAppVersion] = useState('BETA 2.1.0');
  const [versionSource, setVersionSource] = useState<'repo' | 'fallback'>('repo');

  // About Modal state
  const [showAbout, setShowAbout] = useState(false);
  const [licenseText, setLicenseText] = useState('Loading license...');
  const [licenseSource, setLicenseSource] = useState<'repo' | 'fallback'>('repo');

  // Manual Modal state (ALPHA 2.0.12 / BETA 2.1.0 New feature!)
  const [showManual, setShowManual] = useState(false);
  const [manualText, setManualText] = useState('Loading user manual...');
  const [manualSource, setManualSource] = useState<'repo' | 'fallback'>('repo');

  // Decorative Window controls warning modal state
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Changelog Modal state
  const [showChangelog, setShowChangelog] = useState(false);
  const [changelogText, setChangelogText] = useState('Loading changelog...');
  const [changelogSource, setChangelogSource] = useState<'repo' | 'fallback'>('repo');
  const changelogTextFallback = '# Flowonline2 Changelog\n\n> Fallback changelog not available.';

  // Hardcoded fallback license text (GNU GPL v3)
  const gplLicenseTextFallback = `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2026 PiBOH

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.`;

  // Hardcoded fallback manual text
  const manualTextFallback = `# Flowonline2 User Manual

> Notice: The translations of Flowonline2, MANUAL.md, and all other local project files might not be 100% accurate.

Flowonline2 is a web-based replica of Flowgorithm (Windows version 2.0.3).

### 1. Variables and Operators
- Variables are case-insensitive.
- The single '=' operator is treated as a comparison (equality) in conditions.
- String comparative relational operators (<, >, <=, >=) compare strings lexicographically.
- The inequality operator '<>' is fully supported as an alternative to '!='.

### 2. Newlines and formatting
- To introduce a newline carriage return, write \\n without quotes inside string expressions (e.g. text & \\n & "more text").
- In saved .fprg files, \\n is automatically translated to ToChar(13) for full desktop compatibility!`;

  // LOCAL MENU & ABOUT TRANSLATIONS (For 1000% multilingual fidelity!)
  const menuTranslations: Record<Language, {
    file: string;
    edit: string;
    program: string;
    styleMenu: string; // Dynamic Chart Style & Color menu title!
    help: string;
    new: string;
    open: string;
    save: string;
    backup: string;
    exportSvg: string;
    exportPng: string;
    exportPdf: string;
    clearStorage: string;
    tools: string;
    undo: string;
    redo: string;
    run: string;
    step: string;
    pause: string;
    stop: string;
    about: string;
    aboutTitle: string;
    aboutVersion: string; // Unified property name!
    aboutAuthor: string;
    aboutWebsite: string;
    aboutRepo: string;
    aboutLicense: string;
    colorSchemeLabel: string;
    decorativeWindowAlert: string;
    languageLabel: string;
    layoutLabel: string;
    zoomInLabel: string;
    zoomOutLabel: string;
    zoomResetLabel: string;
    licenseRepoLoaded: string;
    licenseFallbackLoaded: string;
    versionRepoLoaded: string;
    versionFallbackLoaded: string;
    warningModalTitle: string;
    manualMenuOption: string; // Help submenu option!
    manualTitle: string;
    manualRepoLoaded: string;
    manualFallbackLoaded: string;
    changelogMenuOption: string;
    changelogTitle: string;
    changelogRepoLoaded: string;
    changelogFallbackLoaded: string;
  }> = {
    en: {
      file: "File",
      edit: "Edit",
      program: "Program",
      styleMenu: "Chart Style & Color",
      help: "Help",
      new: "New",
      open: "Open...",
      save: "Save (.fprg)",
      backup: "Backup JSON",
      exportSvg: "Export SVG Image",
      exportPng: "Export PNG Image",
      exportPdf: "Export PDF Document",
      clearStorage: "Clear Local Storage",
      undo: "Undo",
      redo: "Redo",
      run: "Run",
      step: "Step",
      pause: "Pause",
      stop: "Stop",
      about: "About Flowonline2...",
      aboutTitle: "About Flowonline2",
      aboutVersion: "Version",
      aboutAuthor: "Author",
      aboutWebsite: "Website",
      aboutRepo: "Repository",
      aboutLicense: "Program License:",
      colorSchemeLabel: "Color Scheme:",
      decorativeWindowAlert: "Flowonline2 is a web-based replica of Flowgorithm for Windows. These window control buttons (Minimize, Maximize, and Close) are purely decorative and have no functional purpose other than displaying this informational warning.",
      languageLabel: "Language",
      layoutLabel: "Disposal",
      zoomInLabel: "Zoom In",
      zoomOutLabel: "Zoom Out",
      zoomResetLabel: "Reset Zoom",
      licenseRepoLoaded: "License dynamically loaded from GitHub",
      licenseFallbackLoaded: "License loaded from hardcoded fallback compilation code",
      versionRepoLoaded: "Version dynamically loaded from GitHub",
      versionFallbackLoaded: "Version loaded from hardcoded fallback compilation code",
      warningModalTitle: "Windows System Information",
      manualMenuOption: "User Manual (MANUAL.md)...",
      manualTitle: "Flowonline2 User Manual - MANUAL.md",
      manualRepoLoaded: "Manual dynamically loaded from GitHub",
      manualFallbackLoaded: "Manual loaded from hardcoded fallback compilation code",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dynamically loaded from GitHub",
      changelogFallbackLoaded: "Changelog loaded from hardcoded fallback compilation code",
      tools: "Tools"
    },
    en_GB: {
      file: "File",
      edit: "Edit",
      program: "Program",
      styleMenu: "Chart Style & Color",
      help: "Help",
      new: "New",
      open: "Open...",
      save: "Save (.fprg)",
      backup: "Backup JSON",
      exportSvg: "Export SVG Image",
      exportPng: "Export PNG Image",
      exportPdf: "Export PDF Document",
      clearStorage: "Clear Local Storage",
      undo: "Undo",
      redo: "Redo",
      run: "Run",
      step: "Step",
      pause: "Pause",
      stop: "Stop",
      about: "About Flowonline2...",
      aboutTitle: "About Flowonline2",
      aboutVersion: "Version",
      aboutAuthor: "Author",
      aboutWebsite: "Website",
      aboutRepo: "Repository",
      aboutLicense: "Program License:",
      colorSchemeLabel: "Color Scheme:",
      decorativeWindowAlert: "Flowonline2 is a web-based replica of Flowgorithm for Windows. These window control buttons (Minimize, Maximize, and Close) are purely decorative and have no functional purpose other than displaying this informational warning.",
      languageLabel: "Language",
      layoutLabel: "Disposal",
      zoomInLabel: "Zoom In",
      zoomOutLabel: "Zoom Out",
      zoomResetLabel: "Reset Zoom",
      licenseRepoLoaded: "License dynamically loaded from GitHub",
      licenseFallbackLoaded: "License loaded from hardcoded fallback compilation code",
      versionRepoLoaded: "Version dynamically loaded from GitHub",
      versionFallbackLoaded: "Version loaded from hardcoded fallback compilation code",
      warningModalTitle: "Windows System Information",
      manualMenuOption: "User Manual (MANUAL.md)...",
      manualTitle: "Flowonline2 User Manual - MANUAL.md",
      manualRepoLoaded: "Manual dynamically loaded from GitHub",
      manualFallbackLoaded: "Manual loaded from hardcoded fallback compilation code",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dynamically loaded from GitHub",
      changelogFallbackLoaded: "Changelog loaded from hardcoded fallback compilation code",
      tools: "Tools"
    },
    it: {
      file: "File",
      edit: "Modifica",
      program: "Programma",
      styleMenu: "Stile & Colori",
      help: "?",
      new: "Nuovo",
      open: "Apri...",
      save: "Salva (.fprg)",
      backup: "Backup JSON",
      exportSvg: "Esporta Immagine SVG",
      exportPng: "Esporta Immagine PNG",
      exportPdf: "Esporta Documento PDF",
      clearStorage: "Pulisci Storage Locale",
      undo: "Annulla (Undo)",
      redo: "Ripristina (Redo)",
      run: "Esegui (Run)",
      step: "Passo-Passo (Step)",
      pause: "Pausa",
      stop: "Stop",
      about: "Informazioni su Flowonline2...",
      aboutTitle: "Informazioni su Flowonline2",
      aboutVersion: "Versione",
      aboutAuthor: "Autore",
      aboutWebsite: "Sito Web",
      aboutRepo: "Repository",
      aboutLicense: "Licenza del Programma:",
      colorSchemeLabel: "Schema Colori:",
      decorativeWindowAlert: "Flowonline2 è una replica web di Flowgorithm per Windows. Questi tasti di controllo (Riduci a icona, Ingrandisci, Chiudi) sono presenti solo a scopo estetico e non hanno alcuna função pratica se non quella di aprire questa finestra informativa di avviso.",
      languageLabel: "Lingua",
      layoutLabel: "Disposizione",
      zoomInLabel: "Aumenta Zoom",
      zoomOutLabel: "Riduci Zoom",
      zoomResetLabel: "Ripristina Zoom",
      licenseRepoLoaded: "Licenza caricata dinamicamente da GitHub",
      licenseFallbackLoaded: "Licenza caricata dal codice compilato hardcoded (Fallback)",
      versionRepoLoaded: "Versione caricata dinamicamente da GitHub",
      versionFallbackLoaded: "Versione caricata dal codice compilato hardcoded (Fallback)",
      warningModalTitle: "Informazione di Sistema Windows",
      manualMenuOption: "Guida d'uso (MANUAL.md)...",
      manualTitle: "Guida d'uso di Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Manuale caricato dinamicamente da GitHub",
      manualFallbackLoaded: "Manuale caricato dal codice compilato di fallback",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog caricato dinamicamente da GitHub",
      changelogFallbackLoaded: "Changelog caricato dal codice compilato di fallback",
      tools: "Strumenti"
    },
    de: {
      file: "Datei",
      edit: "Bearbeiten",
      program: "Programm",
      styleMenu: "Diagrammstil & Farbe",
      help: "Hilfe",
      new: "Neu",
      open: "Öffnen...",
      save: "Speichern (.fprg)",
      backup: "Backup JSON",
      exportSvg: "SVG-Bild exportieren",
      exportPng: "PNG-Bild exportieren",
      exportPdf: "PDF-Dokument exportieren",
      clearStorage: "Lokalen Speicher leeren",
      undo: "Rückgängig",
      redo: "Wiederholen",
      run: "Ausführen",
      step: "Schritt-für-Schritt",
      pause: "Pause",
      stop: "Stopp",
      about: "Über Flowonline2...",
      aboutTitle: "Über Flowonline2",
      aboutVersion: "Version",
      aboutAuthor: "Autor",
      aboutWebsite: "Website",
      aboutRepo: "Repository",
      aboutLicense: "Lizenz:",
      colorSchemeLabel: "Farbschema:",
      decorativeWindowAlert: "Flowonline2 ist eine webbasierte Replik von Flowgorithm für Windows. Diese Fensterschaltflächen (Minimieren, Maximieren und Schließen) sind rein dekorativ und haben keine praktische Funktion, außer dieses Informationsfenster anzuzeigen.",
      languageLabel: "Sprache",
      layoutLabel: "Anordnung",
      zoomInLabel: "Vergrößern",
      zoomOutLabel: "Verkleinern",
      zoomResetLabel: "Zoom zurücksetzen",
      licenseRepoLoaded: "Licence loaded from GitHub",
      licenseFallbackLoaded: "Licence loaded from fallback",
      versionRepoLoaded: "Version loaded from GitHub",
      versionFallbackLoaded: "Version loaded from fallback",
      warningModalTitle: "Windows Systeminformationen",
      manualMenuOption: "Benutzerhandbuch (MANUAL.md)...",
      manualTitle: "Flowonline2 Benutzerhandbuch - MANUAL.md",
      manualRepoLoaded: "Handbuch geladen aus GitHub",
      manualFallbackLoaded: "Handbuch geladen aus Fallback",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog geladen aus GitHub",
      changelogFallbackLoaded: "Changelog geladen aus Fallback",
      tools: "Werkzeuge"
    },
    fr: {
      file: "Fichier",
      edit: "Édition",
      program: "Programme",
      styleMenu: "Style & Couleur",
      help: "Aide",
      new: "Nouveau",
      open: "Ouvrir...",
      save: "Enregistrer (.fprg)",
      backup: "Sauvegarde JSON",
      exportSvg: "Exporter l'image SVG",
      exportPng: "Exporter l'image PNG",
      exportPdf: "Exporter le document PDF",
      clearStorage: "Vider le stockage local",
      undo: "Annuler",
      redo: "Rétablir",
      run: "Exécuter",
      step: "Pas-à-pas",
      pause: "Pause",
      stop: "Arrêter",
      about: "À propos de Flowonline2...",
      aboutTitle: "À propos de Flowonline2",
      aboutVersion: "Version",
      aboutAuthor: "Auteur",
      aboutWebsite: "Site Web",
      aboutRepo: "Dépôt",
      aboutLicense: "Licence:",
      colorSchemeLabel: "Palette de couleurs:",
      decorativeWindowAlert: "Flowonline2 est une réplique Web de Flowgorithm pour Windows. Ces boutons de contrôle de fenêtre (Réduire, Agrandir et Fermer) sont purement décoratifs et n'ont aucune fonction pratique autre que celle d'afficher ce message d'avertissement.",
      languageLabel: "Langue",
      layoutLabel: "Disposition",
      zoomInLabel: "Zoom avant",
      zoomOutLabel: "Zoom arrière",
      zoomResetLabel: "Réinitialiser",
      licenseRepoLoaded: "Licence chargée dynamiquement à partir de GitHub",
      licenseFallbackLoaded: "Licence de secours chargée",
      versionRepoLoaded: "Version chargée dynamiquement à partir de GitHub",
      versionFallbackLoaded: "Version de secours chargée",
      warningModalTitle: "Informations Système Windows",
      manualMenuOption: "Manuel d'utilisation (MANUAL.md)...",
      manualTitle: "Manuel d'utilisation de Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Manuel chargé de GitHub",
      manualFallbackLoaded: "Manuel de secours chargé",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog chargé de GitHub",
      changelogFallbackLoaded: "Changelog de secours chargé",
      tools: "Outils"
    },
    es: {
      file: "Archivo",
      edit: "Editar",
      program: "Programa",
      styleMenu: "Estilo & Color",
      help: "Ayuda",
      new: "Nuevo",
      open: "Abrir...",
      save: "Guardar (.fprg)",
      backup: "Copia JSON",
      exportSvg: "Exportar Imagen SVG",
      exportPng: "Exportar Imagen PNG",
      exportPdf: "Exportar Documento PDF",
      clearStorage: "Limpiar almacenamiento local",
      undo: "Deshacer",
      redo: "Rehacer",
      run: "Ejecutar",
      step: "Paso a paso",
      pause: "Pausa",
      stop: "Detener",
      about: "Acerca de Flowonline2...",
      aboutTitle: "Acerca de Flowonline2",
      aboutVersion: "Version",
      aboutAuthor: "Autor",
      aboutWebsite: "Sitio Web",
      aboutRepo: "Repositorio",
      aboutLicense: "Licencia:",
      colorSchemeLabel: "Esquema de colores:",
      decorativeWindowAlert: "Flowonline2 es una réplica web de Flowgorithm para Windows. Estos botones de control de ventana (Minimizar, Maximizar y Cerrar) son puramente decorativos y no tienen ninguna función práctica aparte de mostrar este aviso informativo.",
      languageLabel: "Idioma",
      layoutLabel: "Disposición",
      zoomInLabel: "Acercar",
      zoomOutLabel: "Alejar",
      zoomResetLabel: "Restablecer",
      licenseRepoLoaded: "Licencia cargada desde GitHub",
      licenseFallbackLoaded: "Licencia cargada desde el código compilado de reserva",
      versionRepoLoaded: "Versión cargada desde GitHub",
      versionFallbackLoaded: "Versión cargada desde el código compilado de reserva",
      warningModalTitle: "Información del Sistema Windows",
      manualMenuOption: "Manual de usuario (MANUAL.md)...",
      manualTitle: "Manual de usuario de Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Manual cargado desde GitHub",
      manualFallbackLoaded: "Manual de reserva cargado",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog cargado desde GitHub",
      changelogFallbackLoaded: "Changelog de reserva cargado",
      tools: "Herramientas"
    }
  };

  const mt = menuTranslations[language];

  // Dynamically load the version.txt file FROM THE OFFICIAL GITHUB URL (Ensuring absolute live updating!)
  useEffect(() => {
    setVersionSource('repo');
    fetch('https://raw.githubusercontent.com/PiBOH/flowonline2/refs/heads/main/version.txt')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load version.');
        return res.text();
      })
      .then((text) => {
        setAppVersion(text.trim());
        setVersionSource('repo');
      })
      .catch((err) => {
        console.warn('Unable to load live version from GitHub, trying local:', err);
        // Fallback local fetch
        fetch('./version.txt')
          .then((localRes) => {
            if (!localRes.ok) throw new Error('Local version.txt missing.');
            return localRes.text();
          })
          .then((text) => {
            setAppVersion(text.trim());
            setVersionSource('repo');
          })
          .catch(() => {
            setAppVersion('BETA 2.1.0'); // Local final fallback updated to BETA!
            setVersionSource('fallback');
          });
      });
  }, []);

  // Dynamically load the LICENSE file FROM THE OFFICIAL GITHUB URL (Ensuring absolute live updating!)
  useEffect(() => {
    if (showAbout) {
      setLicenseText('Loading license from GitHub...');
      setLicenseSource('repo');
      fetch('https://raw.githubusercontent.com/PiBOH/flowonline2/refs/heads/main/LICENSE')
        .then((res) => {
          if (!res.ok) {
            throw new Error('LICENSE not found in remote repo.');
          }
          return res.text();
        })
        .then((text) => {
          setLicenseText(text);
          setLicenseSource('repo');
        })
        .catch((err) => {
          console.warn('Unable to load remote LICENSE, trying local fallback:', err);
          // Try local fetch as first-level fallback
          fetch('./LICENSE')
            .then((localRes) => {
              if (!localRes.ok) throw new Error('Local LICENSE missing.');
              return localRes.text();
            })
            .then((text) => {
              setLicenseText(text);
              setLicenseSource('repo');
            })
            .catch(() => {
              setLicenseText(gplLicenseTextFallback);
              setLicenseSource('fallback');
            });
        });
    }
  }, [showAbout]);

  // Dynamically load the MANUAL.md file FROM THE OFFICIAL GITHUB URL (ALPHA 2.0.12 / BETA 2.1.0 New Feature!)
  useEffect(() => {
    if (showManual) {
      setManualText('Loading user manual from GitHub...');
      setManualSource('repo');
      fetch('https://raw.githubusercontent.com/PiBOH/flowonline2/refs/heads/main/MANUAL.md')
        .then((res) => {
          if (!res.ok) {
            throw new Error('MANUAL.md not found in remote repo.');
          }
          return res.text();
        })
        .then((text) => {
          setManualText(text);
          setManualSource('repo');
        })
        .catch((err) => {
          console.warn('Unable to load remote MANUAL.md, trying local fallback:', err);
          fetch('./MANUAL.md')
            .then((localRes) => {
              if (!localRes.ok) throw new Error('Local MANUAL.md missing.');
              return localRes.text();
            })
            .then((text) => {
              setManualText(text);
              setManualSource('repo');
            })
            .catch(() => {
              setManualText(manualTextFallback);
              setManualSource('fallback');
            });
        });
    }
  }, [showManual]);

  // Dynamically load the CHANGELOG.md file FROM THE OFFICIAL GITHUB URL
  useEffect(() => {
    if (showChangelog) {
      setChangelogText('Loading changelog from GitHub...');
      setChangelogSource('repo');
      fetch('https://raw.githubusercontent.com/PiBOH/flowonline2/refs/heads/main/CHANGELOG.md')
        .then((res) => {
          if (!res.ok) {
            throw new Error('CHANGELOG.md not found in remote repo.');
          }
          return res.text();
        })
        .then((text) => {
          setChangelogText(text);
          setChangelogSource('repo');
        })
        .catch((err) => {
          console.warn('Unable to load remote CHANGELOG.md, trying local fallback:', err);
          fetch('./CHANGELOG.md')
            .then((localRes) => {
              if (!localRes.ok) throw new Error('Local CHANGELOG.md missing.');
              return localRes.text();
            })
            .then((text) => {
              setChangelogText(text);
              setChangelogSource('repo');
            })
            .catch(() => {
              setChangelogText(changelogTextFallback);
              setChangelogSource('fallback');
            });
        });
    }
  }, [showChangelog]);

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
        if (file.name.toLowerCase().endsWith('.json')) {
          // Parse JSON backup safely as requested!
          const parsed = JSON.parse(content);
          loadProgram(parsed.statements || [], parsed.title || 'Backup', parsed.author || 'PiBOH');
        } else {
          // Parse FPRG (DO NOT TOUCH THIS LOGIC AS REQUESTED!)
          const parsed = FprgParser.parse(content);
          loadProgram(parsed.statements, parsed.title, parsed.author);
        }
      } catch (err: any) {
        if (file.name.toLowerCase().endsWith('.json')) {
          alert(`Error opening .json file: ${err.message}`);
        } else {
          alert(`Error opening .fprg file: ${err.message}`);
        }
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

  const handleExportPng = () => {
    exportToPNG(programTitle || 'diagram');
    setActiveDropdown(null);
  };

  const handleExportPdf = () => {
    exportToPDF(programTitle || 'diagram');
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

  const handleDecorativeButtonClick = () => {
    setShowWarningModal(true);
  };

  // ============ IN-APP MARKDOWN TO REACT JSX TRANSLATOR (Fulfill user request!) ============
  const renderInlineMarkdown = (textStr: string): React.ReactNode => {
    let parts: Array<string | JSX.Element> = [textStr];

    // 1. Process inline Code blocks: `code`
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return part;
      const split = part.split(/`([^`]+)`/g);
      return split.map((chunk, idx) => {
        if (idx % 2 === 1) {
          return (
            <code key={idx} className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] text-rose-600 border border-slate-200 font-bold">
              {chunk}
            </code>
          );
        }
        return chunk;
      });
    });

    // 2. Process Bold tags: **bold**
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return part;
      const split = part.split(/\*\*([^*]+)\*\*/g);
      return split.map((chunk, idx) => {
        if (idx % 2 === 1) {
          return <strong key={idx} className="font-extrabold text-slate-950">{chunk}</strong>;
        }
        return chunk;
      });
    });

    // 3. Process hyper links: [text](url)
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return part;
      const split = part.split(/\[([^\]]+)\]\(([^)]+)\)/g);
      const result: Array<string | JSX.Element> = [];
      let idx = 0;
      while (idx < split.length) {
        if (idx % 3 === 0) {
          result.push(split[idx]);
          idx++;
        } else {
          const linkText = split[idx];
          const linkUrl = split[idx + 1];
          result.push(
            <a
              key={idx}
              href={linkUrl}
              target={linkUrl.startsWith('#') ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline"
            >
              {linkText}
            </a>
          );
          idx += 2;
        }
      }
      return result;
    });

    return <>{parts}</>;
  };

  const parseMarkdown = (mdText: string): React.ReactNode => {
    const lines = mdText.split('\n');
    const elements: React.ReactNode[] = [];

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Horizontal separator line
      if (line.trim() === '---') {
        elements.push(<hr key={i} className="my-4 border-slate-300" />);
        i++;
        continue;
      }

      // Blockquotes with warning highlights
      if (line.trim().startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
          i++;
        }
        elements.push(
          <blockquote key={i} className="border-l-4 border-amber-500 bg-amber-50 text-amber-950 p-3 my-3 rounded-r text-[11px] font-sans">
            {quoteLines.map((ql, idx) => (
              <div key={idx} className="leading-relaxed">{renderInlineMarkdown(ql)}</div>
            ))}
          </blockquote>
        );
        continue;
      }

      // Anchor tags
      if (line.trim().startsWith('<a name=')) {
        const match = line.trim().match(/<a name="([^"]+)"><\/a>/);
        if (match) {
          elements.push(<span key={`anchor-${i}`} id={match[1]} className="block scroll-mt-2" />);
          i++;
          continue;
        }
      }

      // Headers (H1, H2, H3)
      if (line.trim().startsWith('#')) {
        const match = line.trim().match(/^(#{1,6})\s*(.*)$/);
        if (match) {
          const level = match[1].length;
          const content = match[2];
          const className = level === 1
            ? "text-[16px] font-extrabold text-slate-900 border-b border-slate-300 pb-1 mt-4 mb-2 font-sans"
            : level === 2
            ? "text-[13px] font-bold text-slate-800 border-b border-slate-200 pb-0.5 mt-4 mb-2 font-sans"
            : "text-[11px] font-bold text-slate-750 mt-3 mb-1 font-sans";

          elements.push(React.createElement(`h${level}`, { key: i, className }, renderInlineMarkdown(content)));
          i++;
          continue;
        }
      }

      // Tables (Operators parameters lookup)
      if (line.trim().startsWith('|')) {
        const rows: string[][] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          const l = lines[i].trim();
          if (l.includes('---')) {
            i++;
            continue;
          }
          const parts = l.split('|').map(s => s.trim()).slice(1, -1);
          rows.push(parts);
          i++;
        }

        if (rows.length > 0) {
          const headerRow = rows[0];
          const bodyRows = rows.slice(1);

          elements.push(
            <div key={i} className="overflow-x-auto my-3 border border-slate-300 rounded shadow-sm">
              <table className="min-w-full border-collapse bg-white text-[11px] text-left">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    {headerRow.map((cell, idx) => (
                      <th key={idx} className="p-2 font-bold text-slate-800 border-r border-slate-200 last:border-0 font-sans">
                        {renderInlineMarkdown(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-slate-150 last:border-0 hover:bg-slate-50">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="p-2 text-slate-700 border-r border-slate-150 last:border-0 font-sans leading-normal">
                          {renderInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Unordered List tags
      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        const listItems: string[] = [];
        while (i < lines.length && (lines[i].trim().startsWith('*') || lines[i].trim().startsWith('-'))) {
          listItems.push(lines[i].trim().replace(/^[\*\-]\s*/, ''));
          i++;
        }
        elements.push(
          <ul key={i} className="list-disc pl-5 my-2 text-[11.5px] text-slate-700 font-sans space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Skip whitespace lines
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Normal text paragraphs
      elements.push(
        <p key={i} className="text-[11.5px] leading-relaxed text-slate-700 my-2 font-sans">
          {renderInlineMarkdown(line)}
        </p>
      );
      i++;
    }

    return elements;
  };

  return (
    <div className="flex flex-col w-full z-30 select-none shadow-md shrink-0">
      
      {/* ============ TITLE BAR (Faithful Windows Desktop Style - VERSION DYNAMICALLY LOADED!) ============ */}
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
            Flowonline2 {appVersion} - {programTitle || 'Untitled'}.fprg
          </span>
        </div>

        {/* Windows Frame Minimize / Maximize / Close simulation with custom Win32 warning dialog modal! */}
        <div className="flex h-full">
          <button 
            onClick={handleDecorativeButtonClick}
            className="w-[44px] h-[28px] hover:bg-white/20 text-white font-sans text-[11px] transition"
          >
            ─
          </button>
          <button 
            onClick={handleDecorativeButtonClick}
            className="w-[44px] h-[28px] hover:bg-white/20 text-white font-sans text-[11px] transition"
          >
            ▢
          </button>
          <button 
            onClick={handleDecorativeButtonClick}
            className="w-[44px] h-[28px] hover:bg-red-600 text-white font-sans text-[11px] transition"
          >
            ✕
          </button>
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
              <div className="h-[1px] bg-slate-300 my-1"></div>
              <button onClick={handleExportSvg} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>🖼️ {mt.exportSvg}</span>
              </button>
              <button onClick={handleExportPng} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>🖼️ {mt.exportPng}</span>
              </button>
              <button onClick={handleExportPdf} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>📕 {mt.exportPdf}</span>
              </button>
              <div className="h-[1px] bg-slate-300 my-1"></div>
              <button onClick={() => { if (window.confirm('Clear saved flowchart from local storage? Your current canvas will not be affected.')) { clearLocalStorage(); } setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#FFF0F0] flex items-center text-rose-700">
                <span>🗑️ {mt.clearStorage}</span>
              </button>
            </div>
          )}
        </div>

        {/* MODIFICA MENU (Includes Zoom, Reset - completely separated from Chart Style!) */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('edit')}
            onMouseEnter={() => handleMenuMouseEnter('edit')}
            className={`px-[10px] py-[2px] h-[20px] flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
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

              {/* INTEGRATED BLOCK CLIPBOARD CONTROLS IN DROP-DOWN MENU (FLOWGORTHM WIN32 FIDELITY!) */}
              <button onClick={() => { if (selectedBlockId) cutBlock(selectedBlockId); setActiveDropdown(null); }} disabled={!selectedBlockId} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-30 text-slate-800">
                <span>✂️ {language === 'it' ? 'Taglia' : 'Cut'}</span>
                <span className="text-[10px] text-slate-400 font-mono">Ctrl+X</span>
              </button>
              <button onClick={() => { if (selectedBlockId) copyBlock(selectedBlockId); setActiveDropdown(null); }} disabled={!selectedBlockId} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-30 text-slate-800">
                <span>📋 {language === 'it' ? 'Copia' : 'Copy'}</span>
                <span className="text-[10px] text-slate-400 font-mono">Ctrl+C</span>
              </button>
              <button onClick={() => { pasteBlock(); setActiveDropdown(null); }} disabled={!copiedBlock} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-30 text-slate-800">
                <span>📥 {language === 'it' ? 'Incolla' : 'Paste'}</span>
                <span className="text-[10px] text-slate-400 font-mono">Ctrl+V</span>
              </button>
              
              <div className="h-[1px] bg-slate-300 my-1"></div>
              
              {/* Zoom options inside menu */}
              <button onClick={() => setZoom((prev) => Math.min(6.0, prev + 0.1))} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] text-slate-800 flex items-center gap-1.5">
                <span>🔍 {mt.zoomInLabel}</span>
              </button>
              <button onClick={() => setZoom((prev) => Math.max(0.4, prev - 0.1))} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] text-slate-800 flex items-center gap-1.5">
                <span>🔍 {mt.zoomOutLabel}</span>
              </button>
              <button onClick={() => setZoom(1.0)} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] text-slate-800 flex items-center gap-1.5">
                <span>🔄 {mt.zoomResetLabel}</span>
              </button>
            </div>
          )}
        </div>

        {/* DEDICATED STYLE MENU: Chart Style & Color */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('styleMenu')}
            onMouseEnter={() => handleMenuMouseEnter('styleMenu')}
            className={`px-[10px] py-[2px] h-[20px] flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'styleMenu' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            🎨 {mt.styleMenu}
          </button>
          {activeDropdown === 'styleMenu' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[200px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">{mt.colorSchemeLabel}</div>
              
              <button onClick={() => { setColorScheme('classic'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1.5 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Classic</span>
                {colorScheme === 'classic' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('pastel'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1.5 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Pastel</span>
                {colorScheme === 'pastel' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('vibrant'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1.5 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Vibrant</span>
                {colorScheme === 'vibrant' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('retro'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1.5 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Retro</span>
                {colorScheme === 'retro' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('twilight'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1.5 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Twilight (Dark Theme)</span>
                {colorScheme === 'twilight' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
              <button onClick={() => { setColorScheme('black_white'); setActiveDropdown(null); }} className="w-full text-left px-5 py-1.5 hover:bg-[#C9DEF5] text-slate-800 text-[11px] flex items-center justify-between">
                <span>Black & White</span>
                {colorScheme === 'black_white' && <span className="text-emerald-600 font-bold">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* TOOLS MENU (Export SVG / PNG / PDF) */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('tools')}
            onMouseEnter={() => handleMenuMouseEnter('tools')}
            className={`px-[10px] py-[2px] h-[20px] flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'tools' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            🛠️ {mt.tools}
          </button>
          {activeDropdown === 'tools' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[200px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <button onClick={handleExportSvg} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>🖼️ {mt.exportSvg}</span>
              </button>
              <button onClick={handleExportPng} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>🖼️ {mt.exportPng}</span>
              </button>
              <button onClick={handleExportPdf} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>📕 {mt.exportPdf}</span>
              </button>
            </div>
          )}
        </div>

        {/* PROGRAMMA MENU */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('program')}
            onMouseEnter={() => handleMenuMouseEnter('program')}
            className={`px-[10px] py-[2px] h-[20px] flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
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

        {/* DISPOSIZIONE / LAYOUT MENU (All toolbar layout options matched 100% in menu!) */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('layout')}
            onMouseEnter={() => handleMenuMouseEnter('layout')}
            className={`px-[10px] py-[2px] h-[20px] flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'layout' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            {mt.layoutLabel}
          </button>
          {activeDropdown === 'layout' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[180px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              {layoutButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => { setLayout(btn.id); setActiveDropdown(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between text-slate-800 text-xs"
                >
                  <span>{btn.label} {btn.tooltip}</span>
                  {layout === btn.id && <span className="text-emerald-600 font-bold">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* HELP / ? MENU */}
        <div className="relative ml-1">
          <button
            onClick={() => toggleDropdown('help')}
            onMouseEnter={() => handleMenuMouseEnter('help')}
            className={`px-[10px] py-[2px] h-[20px] flex items-center hover:bg-[#C9DEF5] hover:border hover:border-[#5B8DC4] rounded-[2px] ${
              activeDropdown === 'help' ? 'bg-[#C9DEF5] border border-[#5B8DC4]' : 'border border-transparent'
            }`}
          >
            {mt.help}
          </button>
          {activeDropdown === 'help' && (
            <div className="absolute left-0 top-full mt-[1px] min-w-[180px] bg-[#F5F5F5] border border-[#999] shadow-lg py-[2px] z-50 rounded-[1px]">
              <button onClick={() => { setShowChangelog(true); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800 font-bold">
                <span>📋 {mt.changelogMenuOption}</span>
              </button>
              <button onClick={() => { setShowManual(true); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800 font-bold">
                <span>📚 {mt.manualMenuOption}</span>
              </button>
              <button onClick={() => { setShowAbout(true); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span>ℹ️ {mt.about}</span>
              </button>
            </div>
          )}
        </div>

        {/* GLOBE LANGUAGE SWITCHER */}
        <div className="relative ml-auto mr-2 flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
          <span>🌐 {mt.languageLabel}:</span>
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
        className="h-[36px] border-b border-[#B0B0B0] flex items-center px-[4px] gap-[1px] justify-between"
        style={{
          background: 'linear-gradient(to bottom, #FAFAFA, #E4E4E4)'
        }}
      >
        <div className="flex items-center gap-[1px]">
          {/* NEW BUTTON */}
          <button
            onClick={handleNew}
            className="w-[32px] h-[32px] hover:bg-slate-200/50 hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-slate-700 text-sm active:scale-95 transition-all"
            title="Nuovo (Ctrl+N)"
          >
            📄
          </button>

          {/* OPEN BUTTON */}
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

          {/* SPEED CONTROL (SPEED / VELOCITÀ) */}
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

        {/* INTEGRATE ZOOM CONTROLS ON THE RIGHT SIDE OF THE TOOLBAR */}
        <div className="flex items-center gap-1.5 pr-2.5">
          <div className="w-[1px] h-[24px] bg-[#B0B0B0] mx-[4px] shadow-[1px_0_0_#FAFAFA]"></div>
          <button
            onClick={() => setZoom((prev) => Math.max(0.4, prev - 0.1))}
            className="w-[24px] h-[24px] hover:bg-slate-200/50 rounded flex items-center justify-center text-slate-600 active:scale-95 transition"
            title={mt.zoomOutLabel}
          >
            🔍-
          </button>
          <span className="text-[10px] font-bold text-slate-500 w-[42px] text-center font-mono select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(6.0, prev + 0.1))}
            className="w-[24px] h-[24px] hover:bg-slate-200/50 rounded flex items-center justify-center text-slate-600 active:scale-95 transition"
            title={mt.zoomInLabel}
          >
            🔍+
          </button>
          <button
            onClick={() => setZoom(1.0)}
            className="w-[20px] h-[20px] hover:bg-slate-200/50 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition text-[11px]"
            title={mt.zoomResetLabel}
          >
            🔄
          </button>
        </div>

      </div>

      {/* ============ WIN32 ABOUT DIALOG MODAL (ENLARGED TO EXACTLY 700x525 PIXELS! BETA 2.0.12) ============ */}
      {showAbout && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
          <div 
            className="bg-[#F0F0F0] border-2 border-slate-400 rounded-sm shadow-2xl overflow-hidden flex flex-col font-sans select-none"
            style={{ width: '700px', height: '525px' }} // EXPLICIT WIN32 SIZE SET TO 700 x 525!
          >
            {/* About Modal Title Bar */}
            <div 
              className="h-[24px] text-white flex items-center justify-between px-2 cursor-default shrink-0"
              style={{
                background: 'linear-gradient(to bottom, #5B8DC4 0%, #3E6FA8 50%, #2F5A8C 100%)'
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
            <div className="p-4 flex-1 flex flex-col justify-between bg-[#F0F0F0] text-slate-800 overflow-hidden">
              
              <div className="flex items-start gap-4">
                {/* Large Flowgorithm Colored logo */}
                <div className="w-16 h-16 bg-white rounded border border-slate-300 shadow-inner flex items-center justify-center shrink-0">
                  <svg className="w-9 h-9" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="10" height="8" fill="#84C44C" stroke="#333" strokeWidth="1.5" />
                    <rect x="18" y="4" width="10" height="8" fill="#F2A93B" stroke="#333" strokeWidth="1.5" />
                    <polygon points="4,18 14,18 12,26 6,26" fill="#E14C4C" stroke="#333" strokeWidth="1.5" />
                    <polygon points="18,18 28,18 26,26 20,26" fill="#4B9DDC" stroke="#333" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="flex flex-col gap-0.5 leading-tight text-[12px] font-sans">
                  <h4 className="font-extrabold text-[14px] text-slate-900 tracking-wide">Flowonline2</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[12px] text-slate-500 font-semibold">{mt.aboutVersion} {appVersion}</p>
                    <span className={`px-1.5 py-0.5 rounded font-mono text-[7px] font-black ${versionSource === 'repo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                      {versionSource === 'repo' ? mt.versionRepoLoaded : mt.versionFallbackLoaded}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-600 mt-2">
                    {mt.aboutAuthor}: <a href="https://piboh.github.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">PiBOH</a>
                  </p>
                  <p className="text-[12px] text-slate-500">
                    {mt.aboutWebsite}: <a href="https://piboh.github.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">piboh.github.io</a>
                  </p>
                  <p className="text-[12px] text-slate-500">
                    {mt.aboutRepo}: <a href="https://github.com/PiBOH/flowonline2" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/PiBOH/flowonline2</a>
                  </p>
                </div>
              </div>

              {/* License automatically loaded text box */}
              <div className="flex-1 flex flex-col space-y-1.5 my-3 overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">
                  <span>{mt.aboutLicense}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-sans text-[8px] font-black ${licenseSource === 'repo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                    {licenseSource === 'repo' ? mt.licenseRepoLoaded : mt.licenseFallbackLoaded}
                  </span>
                </div>
                <textarea
                  readOnly
                  value={licenseText}
                  className="w-full flex-1 border border-slate-300 rounded p-3 font-mono text-[11px] bg-white text-slate-600 focus:outline-none resize-none overflow-auto leading-relaxed shadow-inner"
                />
              </div>

              {/* OK button to close dialog (Win32 styled) */}
              <div className="flex items-center justify-end shrink-0">
                <button
                  onClick={() => setShowAbout(false)}
                  className="px-8 py-1.5 bg-white hover:bg-slate-100 border border-slate-400 hover:border-slate-500 text-slate-800 text-[11px] font-bold rounded shadow-sm focus:outline-none transition active:scale-95"
                >
                  OK
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============ WIN32 SYSTEM DIALOG MODAL FOR WINDOW CONTROLS (DECORATIVE NOTIFICATION) ============ */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
          <div className="bg-[#F0F0F0] border-2 border-slate-400 rounded-sm shadow-2xl w-[380px] overflow-hidden flex flex-col font-sans select-none">
            {/* Warning Modal Title Bar */}
            <div 
              className="h-[24px] text-white flex items-center justify-between px-2 cursor-default"
              style={{
                background: 'linear-gradient(to right, #3E6FA8 0%, #7AAFE0 100%)'
              }}
            >
              <span className="text-[11px] font-bold text-white font-sans tracking-wide">
                {mt.warningModalTitle}
              </span>
              <button 
                onClick={() => setShowWarningModal(false)}
                className="w-[14px] h-[14px] bg-[#E81123]/80 hover:bg-[#E81123] rounded-sm flex items-center justify-center text-[10px] text-white font-bold"
              >
                ×
              </button>
            </div>

            {/* Warning Body */}
            <div className="p-4 flex flex-col space-y-4 bg-[#F0F0F0] text-slate-800">
              <div className="flex items-start gap-3.5">
                {/* Yellow Win32 Warning Shield Icon */}
                <div className="w-10 h-10 bg-amber-400 border border-amber-600 rounded-full flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-white font-bold text-xl select-none font-mono">!</span>
                </div>
                <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                  {mt.decorativeWindowAlert}
                </p>
              </div>

              {/* OK button */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="px-6 py-1 bg-white hover:bg-slate-100 border border-slate-400 hover:border-slate-500 text-slate-800 text-[11px] font-bold rounded shadow-sm focus:outline-none transition active:scale-95"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ WIN32 MANUAL DIALOG MODAL (ENLARGED TO EXACTLY 800x600 PIXELS! WITH BEAUTIFUL MARKDOWN RENDER!) ============ */}
      {showManual && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
          <div 
            className="bg-[#F0F0F0] border-2 border-slate-400 rounded-sm shadow-2xl overflow-hidden flex flex-col font-sans select-none"
            style={{ width: '800px', height: '600px' }} // EXPLICIT WIN32 SIZE SET TO EXACTLY 800 x 600!
          >
            {/* Manual Modal Title Bar */}
            <div 
              className="h-[24px] text-white flex items-center justify-between px-2 cursor-default shrink-0"
              style={{
                background: 'linear-gradient(to bottom, #5B8DC4 0%, #3E6FA8 50%, #2F5A8C 100%)'
              }}
            >
              <span className="text-[11px] font-bold text-white font-sans tracking-wide">
                {mt.manualTitle}
              </span>
              <button 
                onClick={() => setShowManual(false)}
                className="w-[14px] h-[14px] bg-[#E81123]/80 hover:bg-[#E81123] rounded-sm flex items-center justify-center text-[10px] text-white font-bold"
              >
                ×
              </button>
            </div>

            {/* Manual Modal Body */}
            <div className="p-4 flex-1 flex flex-col justify-between bg-[#F0F0F0] text-slate-800 overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0 mb-1.5">
                <span>Flowonline2 Documentation</span>
                <span className={`px-2.5 py-0.5 rounded font-sans text-[7px] font-black ${manualSource === 'repo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                  {manualSource === 'repo' ? mt.manualRepoLoaded : mt.manualFallbackLoaded}
                </span>
              </div>
              
              {/* BEAUTIFULLY STYLED MARKDOWN VIEWER PANEL (Zero-dependency, high performance parser) */}
              <div
                className="w-full flex-1 border border-slate-300 rounded p-4 bg-white text-slate-800 overflow-y-auto shadow-inner select-text leading-relaxed"
                style={{ height: '480px' }}
              >
                {parseMarkdown(manualText)}
              </div>

              {/* OK button to close dialog (Win32 styled) */}
              <div className="flex items-center justify-end shrink-0 mt-3">
                <button
                  onClick={() => setShowManual(false)}
                  className="px-8 py-1.5 bg-white hover:bg-slate-100 border border-slate-400 hover:border-slate-500 text-slate-800 text-[11px] font-bold rounded shadow-sm focus:outline-none transition active:scale-95"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ WIN32 CHANGELOG DIALOG MODAL ============ */}
      {showChangelog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
          <div 
            className="bg-[#F0F0F0] border-2 border-slate-400 rounded-sm shadow-2xl overflow-hidden flex flex-col font-sans select-none"
            style={{ width: '750px', height: '550px' }}
          >
            {/* Changelog Modal Title Bar */}
            <div 
              className="h-[24px] text-white flex items-center justify-between px-2 cursor-default shrink-0"
              style={{
                background: 'linear-gradient(to bottom, #5B8DC4 0%, #3E6FA8 50%, #2F5A8C 100%)'
              }}
            >
              <span className="text-[11px] font-bold text-white font-sans tracking-wide">
                {mt.changelogTitle}
              </span>
              <button 
                onClick={() => setShowChangelog(false)}
                className="w-[14px] h-[14px] bg-[#E81123]/80 hover:bg-[#E81123] rounded-sm flex items-center justify-center text-[10px] text-white font-bold"
              >
                ×
              </button>
            </div>

            {/* Changelog Source Badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#E8E8E8] border-b border-slate-300 shrink-0">
              <span className="text-[10px] font-bold text-slate-500 font-sans">
                <span className="text-[10px] font-bold text-slate-700">CHANGELOG.md</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded font-sans text-[7px] font-black ${changelogSource === 'repo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                {changelogSource === 'repo' ? mt.changelogRepoLoaded : mt.changelogFallbackLoaded}
              </span>
            </div>
            
            {/* Changelog Content */}
            <div 
              className="flex-1 overflow-y-auto p-4 bg-white text-[11px] leading-relaxed font-sans"
              style={{
                fontFamily: '"Segoe UI", "SF Pro", Arial, sans-serif',
                lineHeight: '1.6'
              }}
            >
              {parseMarkdown(changelogText)}
            </div>

            {/* OK button */}
            <div className="flex items-center justify-end shrink-0 p-2 bg-[#F0F0F0] border-t border-slate-300">
              <button
                onClick={() => setShowChangelog(false)}
                className="px-8 py-1.5 bg-white hover:bg-slate-100 border border-slate-400 hover:border-slate-500 text-slate-800 text-[11px] font-bold rounded shadow-sm focus:outline-none transition active:scale-95"
              >
                  OK
                </button>
              </div>
            </div>
          </div>
      )}

      {/* CRITICAL FILE INPUT (Rendered outside conditional blocks so it's always in the DOM and available for toolbar click!) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".fprg,.json"
        className="hidden" 
      />

    </div>
  );
};
export default Header;
