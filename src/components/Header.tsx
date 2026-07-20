import React, { useRef, useState, useEffect } from 'react';
import { useFlow, AppLayout } from '../context/FlowContext';
import { translations } from '../utils/translations';
import { FprgParser } from '../utils/fprgParser';
import { exportToPNG, exportToPDF } from '../utils/exportUtils';
import { WinUIDialog } from './WinUIDialog';
import { Language } from '../types/flow';

import { IconChart, IconChatBubble, IconCode, IconMinimize, IconMaximize, IconClose, IconDocument, IconFolderOpen, IconSave, IconTrash, IconScissors, IconClipboard, IconInbox, IconMagnifier, IconRefresh, IconPalette, IconBooks, IconInfo, IconWarning, IdeaLightbulb, IconGlobe, IconPlay, IconStep, IconPause, IconStop, IconMonitor, FlagIcon } from './EmojiIcons';
const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English (US)', en_GB: 'English (UK)', it: 'Italiano', de: 'Deutsch',
  fr: 'Français', es: 'Español', zh: '中文', nl: 'Nederlands',
  pt: 'Português', gl: 'Galego', ru: 'Русский', uk: 'Українська',
  cs: 'Čeština', pl: 'Polski', hu: 'Magyar', sl: 'Slovenščina',
  ja: '日本語', th: 'ไทย', id: 'Bahasa Indonesia', mn: 'Монгол',
  ar: 'العربية', he: 'עברית', fa: 'فارسی'
};
// Flag emojis for each language (used in language picker)

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

  // WinUI Dialog state (replace browser alerts/confirms)
  const [winUIDialog, setWinUIDialog] = useState<{ isOpen: boolean; title: string; message: string; type: 'info' | 'warning' | 'error' | 'confirm'; onOk?: () => void }>({ isOpen: false, title: '', message: '', type: 'info' });

  // Language picker state
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  // Mobile hamburger menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Helper to show WinUI dialog from synchronous code
  const showDialog = (title: string, message: string, type: 'info' | 'warning' | 'error' | 'confirm' = 'info', onOk?: () => void) => {
    setWinUIDialog({ isOpen: true, title, message, type, onOk });
  };

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
    styleMenu: string;
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
    bugReport: string;
    featureRequest: string;
    forkContribute: string;
    selectLanguage: string;
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
    manualMenuOption: string;
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
      manualMenuOption: "User Manual...",
      manualTitle: "Flowonline2 User Manual - MANUAL.md",
      manualRepoLoaded: "Manual dynamically loaded from GitHub",
      manualFallbackLoaded: "Manual loaded from hardcoded fallback compilation code",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dynamically loaded from GitHub",
      changelogFallbackLoaded: "Changelog loaded from hardcoded fallback compilation code",
      tools: "Tools",
      bugReport: "Report a Bug",
      featureRequest: "Request a Feature",
      forkContribute: "Fork & Contribute",
      selectLanguage: "Select Language"
    },
    en_GB: {
      file: "File",
      edit: "Edit",
      program: "Program",
      styleMenu: "Chart Style & Colour",
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
      aboutLicense: "Programme Licence:",
      colorSchemeLabel: "Colour Scheme:",
      decorativeWindowAlert: "Flowonline2 is a web-based replica of Flowgorithm for Windows. These window control buttons (Minimise, Maximise, and Close) are purely decorative and have no functional purpose other than displaying this informational warning.",
      languageLabel: "Language",
      layoutLabel: "Disposal",
      zoomInLabel: "Zoom In",
      zoomOutLabel: "Zoom Out",
      zoomResetLabel: "Reset Zoom",
      licenseRepoLoaded: "Licence dynamically loaded from GitHub",
      licenseFallbackLoaded: "Licence loaded from hardcoded fallback compilation code",
      versionRepoLoaded: "Version dynamically loaded from GitHub",
      versionFallbackLoaded: "Version loaded from hardcoded fallback compilation code",
      warningModalTitle: "Windows System Information",
      manualMenuOption: "User Manual...",
      manualTitle: "Flowonline2 User Manual - MANUAL.md",
      manualRepoLoaded: "Manual dynamically loaded from GitHub",
      manualFallbackLoaded: "Manual loaded from hardcoded fallback compilation code",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dynamically loaded from GitHub",
      changelogFallbackLoaded: "Changelog loaded from hardcoded fallback compilation code",
      tools: "Tools",
      bugReport: "Report a Bug",
      featureRequest: "Request a Feature",
      forkContribute: "Fork & Contribute",
      selectLanguage: "Select Language"
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
      decorativeWindowAlert: "Flowonline2 è una replica web di Flowgorithm per Windows. Questi tasti di controllo (Riduci a icona, Ingrandisci, Chiudi) sono presenti solo a scopo estetico e non hanno alcuna funzione pratica se non quella di aprire questa finestra informativa di avviso.",
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
      manualMenuOption: "Guida d'uso...",
      manualTitle: "Guida d'uso di Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Manuale caricato dinamicamente da GitHub",
      manualFallbackLoaded: "Manuale caricato dal codice compilato di fallback",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog caricato dinamicamente da GitHub",
      changelogFallbackLoaded: "Changelog caricato dal codice compilato di fallback",
      tools: "Strumenti",
      bugReport: "Segnala un Bug",
      featureRequest: "Richiedi una Funzionalità",
      forkContribute: "Fork & Contribuisci",
      selectLanguage: "Seleziona Lingua"
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
      licenseRepoLoaded: "Lizenz dynamisch von GitHub geladen",
      licenseFallbackLoaded: "Lizenz aus Fallback-Code geladen",
      versionRepoLoaded: "Version dynamisch von GitHub geladen",
      versionFallbackLoaded: "Version aus Fallback-Code geladen",
      warningModalTitle: "Windows Systeminformationen",
      manualMenuOption: "Benutzerhandbuch...",
      manualTitle: "Flowonline2 Benutzerhandbuch - MANUAL.md",
      manualRepoLoaded: "Handbuch dynamisch von GitHub geladen",
      manualFallbackLoaded: "Handbuch aus Fallback geladen",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dynamisch von GitHub geladen",
      changelogFallbackLoaded: "Changelog aus Fallback geladen",
      tools: "Werkzeuge",
      bugReport: "Fehler melden",
      featureRequest: "Funktion vorschlagen",
      forkContribute: "Fork & Mitwirken",
      selectLanguage: "Sprache auswählen"
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
      licenseRepoLoaded: "Licence chargée dynamiquement depuis GitHub",
      licenseFallbackLoaded: "Licence de secours chargée",
      versionRepoLoaded: "Version chargée dynamiquement depuis GitHub",
      versionFallbackLoaded: "Version de secours chargée",
      warningModalTitle: "Informations Système Windows",
      manualMenuOption: "Manuel d'utilisation...",
      manualTitle: "Manuel d'utilisation de Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Manuel chargé de GitHub",
      manualFallbackLoaded: "Manuel de secours chargé",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog chargé de GitHub",
      changelogFallbackLoaded: "Changelog de secours chargé",
      tools: "Outils",
      bugReport: "Signaler un bug",
      featureRequest: "Demander une fonctionnalité",
      forkContribute: "Fork & Contribuer",
      selectLanguage: "Sélectionner la langue"
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
      aboutVersion: "Versión",
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
      manualMenuOption: "Manual de usuario...",
      manualTitle: "Manual de usuario de Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Manual cargado desde GitHub",
      manualFallbackLoaded: "Manual de reserva cargado",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog cargado desde GitHub",
      changelogFallbackLoaded: "Changelog de reserva cargado",
      tools: "Herramientas",
      bugReport: "Reportar un error",
      featureRequest: "Solicitar una función",
      forkContribute: "Fork & Contribuir",
      selectLanguage: "Seleccionar idioma"
    },
    zh: {
      file: "文件",
      edit: "编辑",
      program: "程序",
      styleMenu: "图表样式与颜色",
      help: "帮助",
      new: "新建",
      open: "打开...",
      save: "保存 (.fprg)",
      backup: "备份 JSON",
      exportSvg: "导出 SVG 图像",
      exportPng: "导出 PNG 图像",
      exportPdf: "导出 PDF 文档",
      clearStorage: "清除本地存储",
      undo: "撤销",
      redo: "重做",
      run: "运行",
      step: "单步",
      pause: "暂停",
      stop: "停止",
      about: "关于 Flowonline2...",
      aboutTitle: "关于 Flowonline2",
      aboutVersion: "版本",
      aboutAuthor: "作者",
      aboutWebsite: "网站",
      aboutRepo: "仓库",
      aboutLicense: "程序许可证:",
      colorSchemeLabel: "配色方案:",
      decorativeWindowAlert: "Flowonline2 是 Flowgorithm Windows 版的在线复刻。这些窗口控制按钮（最小化、最大化、关闭）仅作装饰，除了显示此信息警告外无实际功能。",
      languageLabel: "语言",
      layoutLabel: "布局",
      zoomInLabel: "放大",
      zoomOutLabel: "缩小",
      zoomResetLabel: "重置缩放",
      licenseRepoLoaded: "许可证已从 GitHub 动态加载",
      licenseFallbackLoaded: "许可证已从硬编码回退代码加载",
      versionRepoLoaded: "版本已从 GitHub 动态加载",
      versionFallbackLoaded: "版本已从硬编码回退代码加载",
      warningModalTitle: "Windows 系统信息",
      manualMenuOption: "用户手册...",
      manualTitle: "Flowonline2 用户手册 - MANUAL.md",
      manualRepoLoaded: "手册已从 GitHub 动态加载",
      manualFallbackLoaded: "手册已从硬编码回退代码加载",
      changelogMenuOption: "更新日志...",
      changelogTitle: "Flowonline2 更新日志 - CHANGELOG.md",
      changelogRepoLoaded: "更新日志已从 GitHub 动态加载",
      changelogFallbackLoaded: "更新日志已从硬编码回退代码加载",
      tools: "工具",
      bugReport: "报告Bug",
      featureRequest: "请求功能",
      forkContribute: "Fork 并贡献",
      selectLanguage: "选择语言"
    },
    nl: {
      file: "Bestand",
      edit: "Bewerken",
      program: "Programma",
      styleMenu: "Diagramstijl & Kleur",
      help: "Help",
      new: "Nieuw",
      open: "Openen...",
      save: "Opslaan (.fprg)",
      backup: "Backup JSON",
      exportSvg: "SVG-afbeelding exporteren",
      exportPng: "PNG-afbeelding exporteren",
      exportPdf: "PDF-document exporteren",
      clearStorage: "Lokale opslag wissen",
      undo: "Ongedaan",
      redo: "Opnieuw",
      run: "Uitvoeren",
      step: "Stap",
      pause: "Pauze",
      stop: "Stop",
      about: "Over Flowonline2...",
      aboutTitle: "Over Flowonline2",
      aboutVersion: "Versie",
      aboutAuthor: "Auteur",
      aboutWebsite: "Website",
      aboutRepo: "Repository",
      aboutLicense: "Programmalicentie:",
      colorSchemeLabel: "Kleurenschema:",
      decorativeWindowAlert: "Flowonline2 is een webgebaseerde replica van Flowgorithm voor Windows. Deze venstercontroleknoppen (Minimaliseren, Maximaliseren en Sluiten) zijn puur decoratief en hebben geen praktische functie behalve dit informatieve waarschuwingsvenster weergeven.",
      languageLabel: "Taal",
      layoutLabel: "Indeling",
      zoomInLabel: "Inzoomen",
      zoomOutLabel: "Uitzoomen",
      zoomResetLabel: "Zoom resetten",
      licenseRepoLoaded: "Licentie dynamisch geladen van GitHub",
      licenseFallbackLoaded: "Licentie geladen van fallback-code",
      versionRepoLoaded: "Versie dynamisch geladen van GitHub",
      versionFallbackLoaded: "Versie geladen van fallback-code",
      warningModalTitle: "Windows Systeeminformatie",
      manualMenuOption: "Gebruikershandleiding...",
      manualTitle: "Flowonline2 Gebruikershandleiding - MANUAL.md",
      manualRepoLoaded: "Handleiding dynamisch geladen van GitHub",
      manualFallbackLoaded: "Handleiding geladen van fallback",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dynamisch geladen van GitHub",
      changelogFallbackLoaded: "Changelog geladen van fallback",
      tools: "Tools",
      bugReport: "Bug melden",
      featureRequest: "Functie aanvragen",
      forkContribute: "Fork & Bijdragen",
      selectLanguage: "Taal selecteren"
    },
    pt: {
      file: "Ficheiro",
      edit: "Editar",
      program: "Programa",
      styleMenu: "Estilo & Cor",
      help: "Ajuda",
      new: "Novo",
      open: "Abrir...",
      save: "Guardar (.fprg)",
      backup: "Backup JSON",
      exportSvg: "Exportar Imagem SVG",
      exportPng: "Exportar Imagem PNG",
      exportPdf: "Exportar Documento PDF",
      clearStorage: "Limpar armazenamento local",
      undo: "Desfazer",
      redo: "Refazer",
      run: "Executar",
      step: "Passo a passo",
      pause: "Pausa",
      stop: "Parar",
      about: "Sobre o Flowonline2...",
      aboutTitle: "Sobre o Flowonline2",
      aboutVersion: "Versão",
      aboutAuthor: "Autor",
      aboutWebsite: "Website",
      aboutRepo: "Repositório",
      aboutLicense: "Licença:",
      colorSchemeLabel: "Esquema de cores:",
      decorativeWindowAlert: "Flowonline2 é uma réplica web do Flowgorithm para Windows. Estes botões de controlo da janela (Minimizar, Maximizar e Fechar) são puramente decorativos e não têm qualquer função prática além de mostrar este aviso informativo.",
      languageLabel: "Idioma",
      layoutLabel: "Disposição",
      zoomInLabel: "Aumentar zoom",
      zoomOutLabel: "Diminuir zoom",
      zoomResetLabel: "Repor zoom",
      licenseRepoLoaded: "Licença carregada dinamicamente do GitHub",
      licenseFallbackLoaded: "Licença carregada do código de fallback",
      versionRepoLoaded: "Versão carregada dinamicamente do GitHub",
      versionFallbackLoaded: "Versão carregada do código de fallback",
      warningModalTitle: "Informação do Sistema Windows",
      manualMenuOption: "Manual do utilizador...",
      manualTitle: "Manual do Utilizador Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Manual carregado dinamicamente do GitHub",
      manualFallbackLoaded: "Manual de fallback carregado",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog carregado dinamicamente do GitHub",
      changelogFallbackLoaded: "Changelog de fallback carregado",
      tools: "Ferramentas",
      bugReport: "Reportar um Bug",
      featureRequest: "Solicitar uma Funcionalidade",
      forkContribute: "Fork & Contribuir",
      selectLanguage: "Selecionar Idioma"
    },
    gl: {
      file: "Ficheiro",
      edit: "Editar",
      program: "Programa",
      styleMenu: "Estilo & Cor",
      help: "Axuda",
      new: "Novo",
      open: "Abrir...",
      save: "Gardar (.fprg)",
      backup: "Copia JSON",
      exportSvg: "Exportar Imaxe SVG",
      exportPng: "Exportar Imaxe PNG",
      exportPdf: "Exportar Documento PDF",
      clearStorage: "Limpar almacenamento local",
      undo: "Desfacer",
      redo: "Refacer",
      run: "Executar",
      step: "Paso a paso",
      pause: "Pausa",
      stop: "Deter",
      about: "Sobre Flowonline2...",
      aboutTitle: "Sobre Flowonline2",
      aboutVersion: "Versión",
      aboutAuthor: "Autor",
      aboutWebsite: "Website",
      aboutRepo: "Repositorio",
      aboutLicense: "Licenza:",
      colorSchemeLabel: "Esquema de cores:",
      decorativeWindowAlert: "Flowonline2 é unha réplica web de Flowgorithm para Windows. Estes botóns de control da ventá (Minimizar, Maximizar e Pechar) son puramente decorativos e non teñen ningunha función práctica máis que mostrar este aviso informativo.",
      languageLabel: "Idioma",
      layoutLabel: "Disposición",
      zoomInLabel: "Achegar",
      zoomOutLabel: "Afastar",
      zoomResetLabel: "Restablecer zoom",
      licenseRepoLoaded: "Licenza cargada dinamicamente de GitHub",
      licenseFallbackLoaded: "Licenza cargada do código de fallback",
      versionRepoLoaded: "Versión cargada dinamicamente de GitHub",
      versionFallbackLoaded: "Versión cargada do código de fallback",
      warningModalTitle: "Información do Sistema Windows",
      manualMenuOption: "Manual do usuario...",
      manualTitle: "Manual do Usuario Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Manual cargado dinamicamente de GitHub",
      manualFallbackLoaded: "Manual de fallback cargado",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog cargado dinamicamente de GitHub",
      changelogFallbackLoaded: "Changelog de fallback cargado",
      tools: "Ferramentas",
      bugReport: "Informar dun erro",
      featureRequest: "Solicitar unha función",
      forkContribute: "Fork & Contribuír",
      selectLanguage: "Seleccionar idioma"
    },
    ru: {
      file: "Файл",
      edit: "Правка",
      program: "Программа",
      styleMenu: "Стиль и цвет",
      help: "Помощь",
      new: "Новый",
      open: "Открыть...",
      save: "Сохранить (.fprg)",
      backup: "Резерв JSON",
      exportSvg: "Экспорт SVG",
      exportPng: "Экспорт PNG",
      exportPdf: "Экспорт PDF",
      clearStorage: "Очистить локальное хранилище",
      undo: "Отменить",
      redo: "Повторить",
      run: "Запуск",
      step: "Шаг",
      pause: "Пауза",
      stop: "Стоп",
      about: "О Flowonline2...",
      aboutTitle: "О Flowonline2",
      aboutVersion: "Версия",
      aboutAuthor: "Автор",
      aboutWebsite: "Сайт",
      aboutRepo: "Репозиторий",
      aboutLicense: "Лицензия:",
      colorSchemeLabel: "Цветовая схема:",
      decorativeWindowAlert: "Flowonline2 — веб-реплика Flowgorithm для Windows. Эти кнопки управления окном (свернуть, развернуть, закрыть) являются чисто декоративными и не имеют практической функции, кроме отображения этого информационного предупреждения.",
      languageLabel: "Язык",
      layoutLabel: "Расположение",
      zoomInLabel: "Увеличить",
      zoomOutLabel: "Уменьшить",
      zoomResetLabel: "Сбросить масштаб",
      licenseRepoLoaded: "Лицензия динамически загружена из GitHub",
      licenseFallbackLoaded: "Лицензия загружена из резервного кода",
      versionRepoLoaded: "Версия динамически загружена из GitHub",
      versionFallbackLoaded: "Версия загружена из резервного кода",
      warningModalTitle: "Информация о системе Windows",
      manualMenuOption: "Руководство пользователя...",
      manualTitle: "Руководство пользователя Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Руководство динамически загружено из GitHub",
      manualFallbackLoaded: "Руководство загружено из резервного кода",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog динамически загружен из GitHub",
      changelogFallbackLoaded: "Changelog загружен из резервного кода",
      tools: "Инструменты",
      bugReport: "Сообщить об ошибке",
      featureRequest: "Запросить функцию",
      forkContribute: "Форк и участие",
      selectLanguage: "Выбрать язык"
    },
    uk: {
      file: "Файл",
      edit: "Редагування",
      program: "Програма",
      styleMenu: "Стиль і колір",
      help: "Допомога",
      new: "Новий",
      open: "Відкрити...",
      save: "Зберегти (.fprg)",
      backup: "Резерв JSON",
      exportSvg: "Експорт SVG",
      exportPng: "Експорт PNG",
      exportPdf: "Експорт PDF",
      clearStorage: "Очистити локальне сховище",
      undo: "Скасувати",
      redo: "Повторити",
      run: "Запуск",
      step: "Крок",
      pause: "Пауза",
      stop: "Стоп",
      about: "Про Flowonline2...",
      aboutTitle: "Про Flowonline2",
      aboutVersion: "Версія",
      aboutAuthor: "Автор",
      aboutWebsite: "Сайт",
      aboutRepo: "Репозиторій",
      aboutLicense: "Ліцензія:",
      colorSchemeLabel: "Колірна схема:",
      decorativeWindowAlert: "Flowonline2 — веб-репліка Flowgorithm для Windows. Ці кнопки керування вікном (згорнути, розгорнути, закрити) є чисто декоративними і не мають практичної функції, окрім відображення цього інформаційного попередження.",
      languageLabel: "Мова",
      layoutLabel: "Розташування",
      zoomInLabel: "Збільшити",
      zoomOutLabel: "Зменшити",
      zoomResetLabel: "Скинути масштаб",
      licenseRepoLoaded: "Ліцензія динамічно завантажена з GitHub",
      licenseFallbackLoaded: "Ліцензія завантажена з резервного коду",
      versionRepoLoaded: "Версія динамічно завантажена з GitHub",
      versionFallbackLoaded: "Версія завантажена з резервного коду",
      warningModalTitle: "Інформація про систему Windows",
      manualMenuOption: "Посібник користувача...",
      manualTitle: "Посібник користувача Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Посібник динамічно завантажений з GitHub",
      manualFallbackLoaded: "Посібник завантажений з резервного коду",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog динамічно завантажений з GitHub",
      changelogFallbackLoaded: "Changelog завантажений з резервного коду",
      tools: "Інструменти",
      bugReport: "Повідомити про помилку",
      featureRequest: "Запросити функцію",
      forkContribute: "Форк і внесок",
      selectLanguage: "Вибрати мову"
    },
    cs: {
      file: "Soubor",
      edit: "Upravit",
      program: "Program",
      styleMenu: "Styl a barva",
      help: "Nápověda",
      new: "Nový",
      open: "Otevřít...",
      save: "Uložit (.fprg)",
      backup: "Záloha JSON",
      exportSvg: "Exportovat SVG",
      exportPng: "Exportovat PNG",
      exportPdf: "Exportovat PDF",
      clearStorage: "Vymazat lokální úložiště",
      undo: "Zpět",
      redo: "Znovu",
      run: "Spustit",
      step: "Krok",
      pause: "Pauza",
      stop: "Zastavit",
      about: "O Flowonline2...",
      aboutTitle: "O Flowonline2",
      aboutVersion: "Verze",
      aboutAuthor: "Autor",
      aboutWebsite: "Web",
      aboutRepo: "Repozitář",
      aboutLicense: "Licence:",
      colorSchemeLabel: "Barevné schéma:",
      decorativeWindowAlert: "Flowonline2 je webová replika Flowgorithm pro Windows. Tato tlačítka ovládání okna (Minimalizovat, Maximalizovat a Zavřít) jsou čistě dekorativní a nemají žádnou praktickou funkci kromě zobrazení tohoto informačního upozornění.",
      languageLabel: "Jazyk",
      layoutLabel: "Rozvržení",
      zoomInLabel: "Přiblížit",
      zoomOutLabel: "Oddálit",
      zoomResetLabel: "Resetovat zoom",
      licenseRepoLoaded: "Licence dynamicky načtena z GitHub",
      licenseFallbackLoaded: "Licence načtena z fallback kódu",
      versionRepoLoaded: "Verze dynamicky načtena z GitHub",
      versionFallbackLoaded: "Verze načtena z fallback kódu",
      warningModalTitle: "Informace o systému Windows",
      manualMenuOption: "Uživatelská příručka...",
      manualTitle: "Uživatelská příručka Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Příručka dynamicky načtena z GitHub",
      manualFallbackLoaded: "Příručka načtena z fallbacku",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dynamicky načten z GitHub",
      changelogFallbackLoaded: "Changelog načten z fallbacku",
      tools: "Nástroje",
      bugReport: "Nahlásit chybu",
      featureRequest: "Požádat o funkci",
      forkContribute: "Fork & Přispět",
      selectLanguage: "Vybrat jazyk"
    },
    pl: {
      file: "Plik",
      edit: "Edycja",
      program: "Program",
      styleMenu: "Styl i kolor",
      help: "Pomoc",
      new: "Nowy",
      open: "Otwórz...",
      save: "Zapisz (.fprg)",
      backup: "Kopia JSON",
      exportSvg: "Eksportuj SVG",
      exportPng: "Eksportuj PNG",
      exportPdf: "Eksportuj PDF",
      clearStorage: "Wyczyść pamięć lokalną",
      undo: "Cofnij",
      redo: "Ponów",
      run: "Uruchom",
      step: "Krok",
      pause: "Pauza",
      stop: "Zatrzymaj",
      about: "O Flowonline2...",
      aboutTitle: "O Flowonline2",
      aboutVersion: "Wersja",
      aboutAuthor: "Autor",
      aboutWebsite: "Strona",
      aboutRepo: "Repozytorium",
      aboutLicense: "Licencja:",
      colorSchemeLabel: "Schemat kolorów:",
      decorativeWindowAlert: "Flowonline2 to internetowa replika Flowgorithm dla Windows. Te przyciski sterowania oknem (Minimalizuj, Maksymalizuj i Zamknij) są czysto dekoracyjne i nie mają praktycznego zastosowania oprócz wyświetlenia tego ostrzeżenia informacyjnego.",
      languageLabel: "Język",
      layoutLabel: "Układ",
      zoomInLabel: "Powiększ",
      zoomOutLabel: "Pomniejsz",
      zoomResetLabel: "Resetuj zoom",
      licenseRepoLoaded: "Licencja dynamicznie załadowana z GitHub",
      licenseFallbackLoaded: "Licencja załadowana z kodu fallback",
      versionRepoLoaded: "Wersja dynamicznie załadowana z GitHub",
      versionFallbackLoaded: "Wersja załadowana z kodu fallback",
      warningModalTitle: "Informacje o systemie Windows",
      manualMenuOption: "Podręcznik użytkownika...",
      manualTitle: "Podręcznik użytkownika Flowonline2 - MANUAL.md",
      manualRepoLoaded: "Podręcznik dynamicznie załadowany z GitHub",
      manualFallbackLoaded: "Podręcznik załadowany z fallbacku",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dynamicznie załadowany z GitHub",
      changelogFallbackLoaded: "Changelog załadowany z fallbacku",
      tools: "Narzędzia",
      bugReport: "Zgłoś błąd",
      featureRequest: "Zaproponuj funkcję",
      forkContribute: "Fork i współpraca",
      selectLanguage: "Wybierz język"
    },
    hu: {
      file: "Fájl",
      edit: "Szerkesztés",
      program: "Program",
      styleMenu: "Stílus és szín",
      help: "Súgó",
      new: "Új",
      open: "Megnyitás...",
      save: "Mentés (.fprg)",
      backup: "Biztonsági JSON",
      exportSvg: "SVG exportálása",
      exportPng: "PNG exportálása",
      exportPdf: "PDF exportálása",
      clearStorage: "Helyi tároló törlése",
      undo: "Visszavonás",
      redo: "Mégis",
      run: "Futtatás",
      step: "Lépés",
      pause: "Szünet",
      stop: "Leállítás",
      about: "A Flowonline2-ről...",
      aboutTitle: "A Flowonline2-ről",
      aboutVersion: "Verzió",
      aboutAuthor: "Szerző",
      aboutWebsite: "Weboldal",
      aboutRepo: "Repository",
      aboutLicense: "Licenc:",
      colorSchemeLabel: "Színséma:",
      decorativeWindowAlert: "A Flowonline2 egy webalapú Flowgorithm-replika Windowsra. Ezek az ablakvezérlő gombok (Minimalizálás, Maximalizálás és Bezárás) csak dekoratívak, és nincs gyakorlati funkciójuk azon kívül, hogy megjelenítik ezt az információs figyelmeztetést.",
      languageLabel: "Nyelv",
      layoutLabel: "Elrendezés",
      zoomInLabel: "Nagyítás",
      zoomOutLabel: "Kicsinyítés",
      zoomResetLabel: "Zoom visszaállítása",
      licenseRepoLoaded: "Licenc dinamikusan betöltve a GitHub-ról",
      licenseFallbackLoaded: "Licenc betöltve a fallback kódból",
      versionRepoLoaded: "Verzió dinamikusan betöltve a GitHub-ról",
      versionFallbackLoaded: "Verzió betöltve a fallback kódból",
      warningModalTitle: "Windows Rendszerinformáció",
      manualMenuOption: "Felhasználói kézikönyv...",
      manualTitle: "Flowonline2 Felhasználói kézikönyv - MANUAL.md",
      manualRepoLoaded: "Kézikönyv dinamikusan betöltve a GitHub-ról",
      manualFallbackLoaded: "Kézikönyv betöltve a fallbackből",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dinamikusan betöltve a GitHub-ról",
      changelogFallbackLoaded: "Changelog betöltve a fallbackből",
      tools: "Eszközök",
      bugReport: "Hiba bejelentése",
      featureRequest: "Funkció kérése",
      forkContribute: "Fork & Közreműködés",
      selectLanguage: "Nyelv kiválasztása"
    },
    sl: {
      file: "Datoteka",
      edit: "Uredi",
      program: "Program",
      styleMenu: "Slog in barva",
      help: "Pomoč",
      new: "Novo",
      open: "Odpri...",
      save: "Shrani (.fprg)",
      backup: "Varnostna JSON",
      exportSvg: "Izvozi SVG",
      exportPng: "Izvozi PNG",
      exportPdf: "Izvozi PDF",
      clearStorage: "Počisti lokalno shrambo",
      undo: "Razveljavi",
      redo: "Uveljavi",
      run: "Zaženi",
      step: "Korak",
      pause: "Premor",
      stop: "Ustavi",
      about: "O Flowonline2...",
      aboutTitle: "O Flowonline2",
      aboutVersion: "Različica",
      aboutAuthor: "Avtor",
      aboutWebsite: "Spletna stran",
      aboutRepo: "Repozitorij",
      aboutLicense: "Licenca:",
      colorSchemeLabel: "Barvna shema:",
      decorativeWindowAlert: "Flowonline2 je spletna replika Flowgorithm za Windows. Ti gumbi za upravljanje okna (Minimiraj, Maksimiraj in Zapri) so čisto dekorativni in nimajo praktične funkcije razen prikaza tega informativnega opozorila.",
      languageLabel: "Jezik",
      layoutLabel: "Razporeditev",
      zoomInLabel: "Povečaj",
      zoomOutLabel: "Pomanjšaj",
      zoomResetLabel: "Ponastavi zoom",
      licenseRepoLoaded: "Licenca dinamično naložena iz GitHub",
      licenseFallbackLoaded: "Licenca naložena iz fallback kode",
      versionRepoLoaded: "Različica dinamično naložena iz GitHub",
      versionFallbackLoaded: "Različica naložena iz fallback kode",
      warningModalTitle: "Informacije o sistemu Windows",
      manualMenuOption: "Uporabniški priročnik...",
      manualTitle: "Flowonline2 Uporabniški priročnik - MANUAL.md",
      manualRepoLoaded: "Priročnik dinamično naložen iz GitHub",
      manualFallbackLoaded: "Priročnik naložen iz fallbacka",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dinamično naložen iz GitHub",
      changelogFallbackLoaded: "Changelog naložen iz fallbacka",
      tools: "Orodja",
      bugReport: "Prijavi napako",
      featureRequest: "Zahtevaj funkcijo",
      forkContribute: "Fork & Prispevaj",
      selectLanguage: "Izberi jezik"
    },
    ja: {
      file: "ファイル",
      edit: "編集",
      program: "プログラム",
      styleMenu: "スタイルと色",
      help: "ヘルプ",
      new: "新規",
      open: "開く...",
      save: "保存 (.fprg)",
      backup: "JSON バックアップ",
      exportSvg: "SVG としてエクスポート",
      exportPng: "PNG としてエクスポート",
      exportPdf: "PDF としてエクスポート",
      clearStorage: "ローカルストレージをクリア",
      undo: "元に戻す",
      redo: "やり直し",
      run: "実行",
      step: "ステップ",
      pause: "一時停止",
      stop: "停止",
      about: "Flowonline2 について...",
      aboutTitle: "Flowonline2 について",
      aboutVersion: "バージョン",
      aboutAuthor: "作者",
      aboutWebsite: "ウェブサイト",
      aboutRepo: "リポジトリ",
      aboutLicense: "ライセンス:",
      colorSchemeLabel: "カラースキーム:",
      decorativeWindowAlert: "Flowonline2 は Windows 用 Flowgorithm の Web ベースの複製です。これらのウィンドウ制御ボタン（最小化、最大化、閉じる）は純粋に装飾的なものであり、この情報警告を表示すること以外に実用的な目的はありません。",
      languageLabel: "言語",
      layoutLabel: "レイアウト",
      zoomInLabel: "拡大",
      zoomOutLabel: "縮小",
      zoomResetLabel: "ズームをリセット",
      licenseRepoLoaded: "ライセンスは GitHub から動的に読み込まれました",
      licenseFallbackLoaded: "ライセンスはハードコードされたフォールバックコードから読み込まれました",
      versionRepoLoaded: "バージョンは GitHub から動的に読み込まれました",
      versionFallbackLoaded: "バージョンはハードコードされたフォールバックコードから読み込まれました",
      warningModalTitle: "Windows システム情報",
      manualMenuOption: "ユーザーマニュアル...",
      manualTitle: "Flowonline2 ユーザーマニュアル - MANUAL.md",
      manualRepoLoaded: "マニュアルは GitHub から動的に読み込まれました",
      manualFallbackLoaded: "マニュアルはハードコードされたフォールバックコードから読み込まれました",
      changelogMenuOption: "更新ログ...",
      changelogTitle: "Flowonline2 更新ログ - CHANGELOG.md",
      changelogRepoLoaded: "更新ログは GitHub から動的に読み込まれました",
      changelogFallbackLoaded: "更新ログはハードコードされたフォールバックコードから読み込まれました",
      tools: "ツール",
      bugReport: "バグを報告",
      featureRequest: "機能をリクエスト",
      forkContribute: "フォークして貢献",
      selectLanguage: "言語を選択"
    },
    th: {
      file: "ไฟล์",
      edit: "แก้ไข",
      program: "โปรแกรม",
      styleMenu: "สไตล์และสี",
      help: "ช่วยเหลือ",
      new: "ใหม่",
      open: "เปิด...",
      save: "บันทึก (.fprg)",
      backup: "สำรอง JSON",
      exportSvg: "ส่งออก SVG",
      exportPng: "ส่งออก PNG",
      exportPdf: "ส่งออก PDF",
      clearStorage: "ล้างที่จัดเก็บข้อมูลในเครื่อง",
      undo: "เลิกทำ",
      redo: "ทำซ้ำ",
      run: "เริ่ม",
      step: "ทีละขั้น",
      pause: "หยุดชั่วคราว",
      stop: "หยุด",
      about: "เกี่ยวกับ Flowonline2...",
      aboutTitle: "เกี่ยวกับ Flowonline2",
      aboutVersion: "เวอร์ชัน",
      aboutAuthor: "ผู้เขียน",
      aboutWebsite: "เว็บไซต์",
      aboutRepo: "Repository",
      aboutLicense: "ใบอนุญาต:",
      colorSchemeLabel: "ธีมสี:",
      decorativeWindowAlert: "Flowonline2 เป็นรีปลิกาของ Flowgorithm สำหรับ Windows บนเว็บ ปุ่มควบคุมหน้าต่างเหล่านี้ (ย่อ, ขยาย, ปิด) เป็นเพียงการตกแต่งและไม่มีฟังก์ชันจริง นอกจากแสดงคำเตือนข้อมูลนี้",
      languageLabel: "ภาษา",
      layoutLabel: "เค้าโครง",
      zoomInLabel: "ขยาย",
      zoomOutLabel: "ย่อ",
      zoomResetLabel: "รีเซ็ตซูม",
      licenseRepoLoaded: "โหลดใบอนุญาตจาก GitHub แบบไดนามิก",
      licenseFallbackLoaded: "โหลดใบอนุญาตจากโค้ด fallback ที่ฝังไว้",
      versionRepoLoaded: "โหลดเวอร์ชันจาก GitHub แบบไดนามิก",
      versionFallbackLoaded: "โหลดเวอร์ชันจากโค้ด fallback ที่ฝังไว้",
      warningModalTitle: "ข้อมูลระบบ Windows",
      manualMenuOption: "คู่มือผู้ใช้...",
      manualTitle: "Flowonline2 คู่มือผู้ใช้ - MANUAL.md",
      manualRepoLoaded: "โหลดคู่มือจาก GitHub แบบไดนามิก",
      manualFallbackLoaded: "โหลดคู่มือจากโค้ด fallback ที่ฝังไว้",
      changelogMenuOption: "บันทึกการเปลี่ยนแปลง...",
      changelogTitle: "Flowonline2 บันทึกการเปลี่ยนแปลง - CHANGELOG.md",
      changelogRepoLoaded: "โหลดบันทึกการเปลี่ยนแปลงจาก GitHub แบบไดนามิก",
      changelogFallbackLoaded: "โหลดบันทึกการเปลี่ยนแปลงจากโค้ด fallback ที่ฝังไว้",
      tools: "เครื่องมือ",
      bugReport: "รายงานข้อผิดพลาด",
      featureRequest: "ขอคุณสมบัติใหม่",
      forkContribute: "Fork & มีส่วนร่วม",
      selectLanguage: "เลือกภาษา"
    },
    id: {
      file: "Berkas",
      edit: "Edit",
      program: "Program",
      styleMenu: "Gaya & Warna",
      help: "Bantuan",
      new: "Baru",
      open: "Buka...",
      save: "Simpan (.fprg)",
      backup: "Cadangan JSON",
      exportSvg: "Ekspor SVG",
      exportPng: "Ekspor PNG",
      exportPdf: "Ekspor PDF",
      clearStorage: "Hapus Penyimpanan Lokal",
      undo: "Urungkan",
      redo: "Ulangi",
      run: "Jalankan",
      step: "Langkah",
      pause: "Jeda",
      stop: "Berhenti",
      about: "Tentang Flowonline2...",
      aboutTitle: "Tentang Flowonline2",
      aboutVersion: "Versi",
      aboutAuthor: "Penulis",
      aboutWebsite: "Situs Web",
      aboutRepo: "Repositori",
      aboutLicense: "Lisensi:",
      colorSchemeLabel: "Skema Warna:",
      decorativeWindowAlert: "Flowonline2 adalah replika berbasis web dari Flowgorithm untuk Windows. Tombol kontrol jendela ini (Minimalkan, Maksimalkan, dan Tutup) hanya bersifat dekoratif dan tidak memiliki fungsi praktis selain menampilkan peringatan informasi ini.",
      languageLabel: "Bahasa",
      layoutLabel: "Tata Letak",
      zoomInLabel: "Perbesar",
      zoomOutLabel: "Perkecil",
      zoomResetLabel: "Reset Zoom",
      licenseRepoLoaded: "Lisensi dimuat secara dinamis dari GitHub",
      licenseFallbackLoaded: "Lisensi dimuat dari kode fallback",
      versionRepoLoaded: "Versi dimuat secara dinamis dari GitHub",
      versionFallbackLoaded: "Versi dimuat dari kode fallback",
      warningModalTitle: "Informasi Sistem Windows",
      manualMenuOption: "Manual Pengguna...",
      manualTitle: "Flowonline2 Manual Pengguna - MANUAL.md",
      manualRepoLoaded: "Manual dimuat secara dinamis dari GitHub",
      manualFallbackLoaded: "Manual dimuat dari fallback",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog dimuat secara dinamis dari GitHub",
      changelogFallbackLoaded: "Changelog dimuat dari fallback",
      tools: "Alat",
      bugReport: "Laporkan Bug",
      featureRequest: "Minta Fitur",
      forkContribute: "Fork & Berkontribusi",
      selectLanguage: "Pilih Bahasa"
    },
    mn: {
      file: "Файл",
      edit: "Засах",
      program: "Програм",
      styleMenu: "Стиль & Өнгө",
      help: "Тусламж",
      new: "Шинэ",
      open: "Нээх...",
      save: "Хадгалах (.fprg)",
      backup: "JSON Нөөц",
      exportSvg: "SVG экспорт",
      exportPng: "PNG экспорт",
      exportPdf: "PDF экспорт",
      clearStorage: "Локал хадгалалтыг цэвэрлэх",
      undo: "Буцаах",
      redo: "Дахих",
      run: "Ажиллуулах",
      step: "Алхам",
      pause: "Түр зогсоох",
      stop: "Зогсоох",
      about: "Flowonline2-ийн тухай...",
      aboutTitle: "Flowonline2-ийн тухай",
      aboutVersion: "Хувилбар",
      aboutAuthor: "Зохиогч",
      aboutWebsite: "Вэбсайт",
      aboutRepo: "Репозиторий",
      aboutLicense: "Лиценз:",
      colorSchemeLabel: "Өнгийн схем:",
      decorativeWindowAlert: "Flowonline2 бол Windows-ийн Flowgorithm-ийн вэб суурилсан хуулбар юм. Эдгээр цонхны удирдлагын товчлуурууд (Багасгах, Дэлгэц дүүрэн, Хаах) зөвхөн чимэглэлийн зориулалттай бөгөөд энэ мэдээллийн анхааруулгыг харуулахээс өөр практик үүрэггүй.",
      languageLabel: "Хэл",
      layoutLabel: "Зохион байгуулалт",
      zoomInLabel: "Томруулах",
      zoomOutLabel: "Багасгах",
      zoomResetLabel: "Zoom-г reset хийх",
      licenseRepoLoaded: "Лиценз GitHub-ээс динамикаар ачаалагдсан",
      licenseFallbackLoaded: "Лиценз fallback кодоос ачаалагдсан",
      versionRepoLoaded: "Хувилбар GitHub-ээс динамикаар ачаалагдсан",
      versionFallbackLoaded: "Хувилбар fallback кодоос ачаалагдсан",
      warningModalTitle: "Windows Системийн Мэдээлэл",
      manualMenuOption: "Хэрэглэгчийн гарын авлага...",
      manualTitle: "Flowonline2 Хэрэглэгчийн гарын авлага - MANUAL.md",
      manualRepoLoaded: "Гарын авлага GitHub-ээс динамикаар ачаалагдсан",
      manualFallbackLoaded: "Гарын авлага fallback-ээс ачаалагдсан",
      changelogMenuOption: "Changelog...",
      changelogTitle: "Flowonline2 Changelog - CHANGELOG.md",
      changelogRepoLoaded: "Changelog GitHub-ээс динамикаар ачаалагдсан",
      changelogFallbackLoaded: "Changelog fallback-ээс ачаалагдсан",
      tools: "Багаж",
      bugReport: "Алдаа мэдээлэх",
      featureRequest: "Функц хүсэх",
      forkContribute: "Форк & Хувь нэмэр",
      selectLanguage: "Хэл сонгох"
    },
    ar: {
      file: "ملف",
      edit: "تحرير",
      program: "برنامج",
      styleMenu: "النمط واللون",
      help: "مساعدة",
      new: "جديد",
      open: "فتح...",
      save: "حفظ (.fprg)",
      backup: "نسخ JSON احتياطي",
      exportSvg: "تصدير SVG",
      exportPng: "تصدير PNG",
      exportPdf: "تصدير PDF",
      clearStorage: "مسح التخزين المحلي",
      undo: "تراجع",
      redo: "إعادة",
      run: "تشغيل",
      step: "خطوة",
      pause: "إيقاف مؤقت",
      stop: "إيقاف",
      about: "حول Flowonline2...",
      aboutTitle: "حول Flowonline2",
      aboutVersion: "الإصدار",
      aboutAuthor: "المؤلف",
      aboutWebsite: "الموقع",
      aboutRepo: "المستودع",
      aboutLicense: "الترخيص:",
      colorSchemeLabel: "نظام الألوان:",
      decorativeWindowAlert: "Flowonline2 هو نسخة ويب من Flowgorithm لنظام Windows. أزرار التحكم في النافذة (تصغير، تكبير، إغلاق) زخرفية فقط وليس لها أي وظيفة عملية بخلاف عرض هذا التحذير الإعلامي.",
      languageLabel: "اللغة",
      layoutLabel: "التخطيط",
      zoomInLabel: "تكبير",
      zoomOutLabel: "تصغير",
      zoomResetLabel: "إعادة تعيين التكبير",
      licenseRepoLoaded: "تم تحميل الترخيص ديناميكيًا من GitHub",
      licenseFallbackLoaded: "تم تحميل الترخيص من كود fallback",
      versionRepoLoaded: "تم تحميل الإصدار ديناميكيًا من GitHub",
      versionFallbackLoaded: "تم تحميل الإصدار من كود fallback",
      warningModalTitle: "معلومات نظام Windows",
      manualMenuOption: "دليل المستخدم...",
      manualTitle: "Flowonline2 دليل المستخدم - MANUAL.md",
      manualRepoLoaded: "تم تحميل الدليل ديناميكيًا من GitHub",
      manualFallbackLoaded: "تم تحميل الدليل من كود fallback",
      changelogMenuOption: "سجل التغييرات...",
      changelogTitle: "Flowonline2 سجل التغييرات - CHANGELOG.md",
      changelogRepoLoaded: "تم تحميل سجل التغييرات ديناميكيًا من GitHub",
      changelogFallbackLoaded: "تم تحميل سجل التغييرات من كود fallback",
      tools: "أدوات",
      bugReport: "الإبلاغ عن خطأ",
      featureRequest: "طلب ميزة",
      forkContribute: "شوكة ومساهمة",
      selectLanguage: "اختر اللغة"
    },
    he: {
      file: "קובץ",
      edit: "עריכה",
      program: "תוכנית",
      styleMenu: "סגנון וצבע",
      help: "עזרה",
      new: "חדש",
      open: "פתח...",
      save: "שמור (.fprg)",
      backup: "גיבוי JSON",
      exportSvg: "ייצוא SVG",
      exportPng: "ייצוא PNG",
      exportPdf: "ייצוא PDF",
      clearStorage: "נקה אחסון מקומי",
      undo: "בטל",
      redo: "בצע שוב",
      run: "הפעל",
      step: "צעד",
      pause: "השהה",
      stop: "עצור",
      about: "אודות Flowonline2...",
      aboutTitle: "אודות Flowonline2",
      aboutVersion: "גרסה",
      aboutAuthor: "מחבר",
      aboutWebsite: "אתר",
      aboutRepo: "מאגר",
      aboutLicense: "רישיון:",
      colorSchemeLabel: "ערכת צבעים:",
      decorativeWindowAlert: "Flowonline2 הוא רפליקה מבוססת אינטרנט של Flowgorithm עבור Windows. כפתורי הבקרה של החלון (מזעור, הגדלה וסגירה) הם דקורטיביים בלבד ואין להם כל תפקוד מעשי מלבד הצגת אזהרה מידע זו.",
      languageLabel: "שפה",
      layoutLabel: "פריסה",
      zoomInLabel: "הגדל",
      zoomOutLabel: "הקטן",
      zoomResetLabel: "אפס זום",
      licenseRepoLoaded: "רישיון נטען דינמית מ-GitHub",
      licenseFallbackLoaded: "רישיון נטען מקוד fallback",
      versionRepoLoaded: "גרסה נטענת דינמית מ-GitHub",
      versionFallbackLoaded: "גרסה נטענת מקוד fallback",
      warningModalTitle: "מידע על מערכת Windows",
      manualMenuOption: "מדריך משתמש...",
      manualTitle: "Flowonline2 מדריך משתמש - MANUAL.md",
      manualRepoLoaded: "מדריך נטען דינמית מ-GitHub",
      manualFallbackLoaded: "מדריך נטען מקוד fallback",
      changelogMenuOption: "יומן שינויים...",
      changelogTitle: "Flowonline2 יומן שינויים - CHANGELOG.md",
      changelogRepoLoaded: "יומן שינויים נטען דינמית מ-GitHub",
      changelogFallbackLoaded: "יומן שינויים נטען מקוד fallback",
      tools: "כלים",
      bugReport: "דווח על באג",
      featureRequest: "בקש תכונה",
      forkContribute: "מזלג ותרומה",
      selectLanguage: "בחר שפה"
    },
    fa: {
      file: "فایل",
      edit: "ویرایش",
      program: "برنامه",
      styleMenu: "سبک و رنگ",
      help: "راهنما",
      new: "جدید",
      open: "باز کردن...",
      save: "ذخیره (.fprg)",
      backup: "پشتیبان JSON",
      exportSvg: "صادرات SVG",
      exportPng: "صادرات PNG",
      exportPdf: "صادرات PDF",
      clearStorage: "پاک کردن ذخیره‌سازی محلی",
      undo: "واگرد",
      redo: "انجام دوباره",
      run: "اجرا",
      step: "گام",
      pause: "مکث",
      stop: "توقف",
      about: "درباره Flowonline2...",
      aboutTitle: "درباره Flowonline2",
      aboutVersion: "نسخه",
      aboutAuthor: "نویسنده",
      aboutWebsite: "وب‌سایت",
      aboutRepo: "مخزن",
      aboutLicense: "مجوز:",
      colorSchemeLabel: "طرح رنگ:",
      decorativeWindowAlert: "Flowonline2 یک نسخه وب‌محور از Flowgorithm برای ویندوز است. این دکمه‌های کنترل پنجره (حداقل کردن، حداکثر کردن و بستن) صرفاً تزئینی هستند و هیچ هدف عملی جز نمایش این هشدار اطلاعاتی ندارند.",
      languageLabel: "زبان",
      layoutLabel: "چیدمان",
      zoomInLabel: "بزرگنمایی",
      zoomOutLabel: "کوچک‌نمایی",
      zoomResetLabel: "بازنشانی بزرگنمایی",
      licenseRepoLoaded: "مجوز به صورت پویا از GitHub بارگیری شد",
      licenseFallbackLoaded: "مجوز از کد fallback بارگیری شد",
      versionRepoLoaded: "نسخه به صورت پویا از GitHub بارگیری شد",
      versionFallbackLoaded: "نسخه از کد fallback بارگیری شد",
      warningModalTitle: "اطلاعات سیستم Windows",
      manualMenuOption: "راهنمای کاربر...",
      manualTitle: "Flowonline2 راهنمای کاربر - MANUAL.md",
      manualRepoLoaded: "راهنمای کاربر به صورت پویا از GitHub بارگیری شد",
      manualFallbackLoaded: "راهنمای کاربر از کد fallback بارگیری شد",
      changelogMenuOption: "تغییرات...",
      changelogTitle: "Flowonline2 تغییرات - CHANGELOG.md",
      changelogRepoLoaded: "تغییرات به صورت پویا از GitHub بارگیری شد",
      changelogFallbackLoaded: "تغییرات از کد fallback بارگیری شد",
      tools: "ابزار",
      bugReport: "گزارش باگ",
      featureRequest: "درخواست ویژگی",
      forkContribute: "فورک و مشارکت",
      selectLanguage: "انتخاب زبان"
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
          showDialog('Open Error', `Error opening .json file: ${err.message}`, 'error');
        } else {
          showDialog('Open Error', `Error opening .fprg file: ${err.message}`, 'error');
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
      showDialog('Save Error', `Error saving file: ${err.message}`, 'error');
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
      showDialog('Export Error', 'Unable to find SVG flowchart elements for export.', 'error');
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

  const handleExportPng = async () => {
    setActiveDropdown(null);
    const result = await exportToPNG(programTitle || 'diagram');
    setWinUIDialog({
      isOpen: true,
      title: result.success ? 'Export PNG' : 'Export Error',
      message: result.message,
      type: result.success ? 'info' : 'error',
    });
  };

  const handleExportPdf = async () => {
    setActiveDropdown(null);
    const result = await exportToPDF(programTitle || 'diagram');
    setWinUIDialog({
      isOpen: true,
      title: result.success ? 'Export PDF' : 'Export Error',
      message: result.message,
      type: result.success ? 'info' : 'error',
    });
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

  const layoutButtons: Array<{ id: AppLayout; label: React.ReactNode; tooltip: string }> = [
    { id: 'flowchart_only', label: <IconMonitor size={15} />, tooltip: 'Flowchart Only' },
    { id: 'flow_variables', label: <IconChart size={15} />, tooltip: 'Flowchart & Watch' },
    { id: 'flow_console', label: <IconChatBubble size={15} />, tooltip: 'Flowchart & Console' },
    { id: 'triple_split', label: '🚀', tooltip: 'Triple Split View' },
    { id: 'flow_code', label: <IconCode size={15} />, tooltip: 'Flowchart & Source Code' }
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
<svg className="w-[16px] h-[16px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" >
  <defs>
    <linearGradient id="grad-yellow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff568"/>
      <stop offset="20%" stop-color="#ffdd00"/>
      <stop offset="100%" stop-color="#cca100"/>
    </linearGradient>
    <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b8b"/>
      <stop offset="30%" stop-color="#ff1a40"/>
      <stop offset="100%" stop-color="#b30022"/>
    </linearGradient>
    <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6bebff"/>
      <stop offset="30%" stop-color="#00aaff"/>
      <stop offset="100%" stop-color="#0066cc"/>
    </linearGradient>
    <linearGradient id="grad-green" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8eff70"/>
      <stop offset="20%" stop-color="#26e600"/>
      <stop offset="100%" stop-color="#178a00"/>
    </linearGradient>

    <linearGradient id="grad-ring-top" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4ae034"/>
      <stop offset="50%" stop-color="#e6dc38"/>
      <stop offset="100%" stop-color="#e63838"/>
    </linearGradient>
    <linearGradient id="grad-ring-bottom" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#e63838"/>
      <stop offset="50%" stop-color="#2660e6"/>
      <stop offset="100%" stop-color="#4ae034"/>
    </linearGradient>

    <linearGradient id="gloss-white" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <g stroke="#777" stroke-width="1.2" fill="none" opacity="0.5" stroke-linecap="round">
    <path d="M 330 90 A 185 185 0 0 1 405 155" />
    <path d="M 405 345 A 185 185 0 0 1 350 395" />
    <path d="M 160 405 A 185 185 0 0 1 105 365" />
    <path d="M 90 170 A 185 185 0 0 1 145 105" />
    <path d="M 210 160 A 90 90 0 0 1 290 160" />
    <path d="M 285 330 A 90 90 0 0 1 240 345" />
  </g>

  <path d="M 90 250 A 160 160 0 0 1 410 250" fill="none" stroke="url(#grad-ring-top)" stroke-width="24" opacity="0.9"/>
  <path d="M 410 250 A 160 160 0 0 1 90 250" fill="none" stroke="url(#grad-ring-bottom)" stroke-width="24" opacity="0.9"/>

  <g transform="translate(40, 210)" filter="url(#glow)">
    <rect x="0" y="0" width="120" height="80" rx="5" fill="none" stroke="#63ff42" stroke-width="1.5" opacity="0.7"/>
    <rect x="1" y="1" width="118" height="78" rx="4" fill="url(#grad-green)"/>
    <path d="M 1 1 L 119 1 L 119 45 L 1 15 Z" fill="url(#gloss-white)"/>
  </g>

  <g transform="translate(190, 45)" filter="url(#glow)">
    <rect x="0" y="0" width="120" height="80" rx="5" fill="none" stroke="#fff152" stroke-width="1.5" opacity="0.7"/>
    <rect x="1" y="1" width="118" height="78" rx="4" fill="url(#grad-yellow)"/>
    <path d="M 1 1 L 119 1 L 119 35 L 1 50 Z" fill="url(#gloss-white)"/>
  </g>

  <g transform="translate(315, 215)" filter="url(#glow)">
    <path d="M 35 0 L 145 0 L 110 75 L 0 75 Z" fill="none" stroke="#ff4d6a" stroke-width="1.5" opacity="0.7"/>
    <path d="M 35 1 L 144 1 L 109 74 L 1 74 Z" fill="url(#grad-red)"/>
    <path d="M 35 1 L 144 1 L 126 38 L 18 38 Z" fill="url(#gloss-white)"/>
  </g>

  <g transform="translate(180, 360)" filter="url(#glow)">
    <path d="M 30 0 L 140 0 L 110 75 L 0 75 Z" fill="none" stroke="#46cfff" stroke-width="1.5" opacity="0.7"/>
    <path d="M 30 1 L 139 1 L 109 74 L 1 74 Z" fill="url(#grad-blue)"/>
    <path d="M 30 1 L 139 1 L 124 35 L 15 35 Z" fill="url(#gloss-white)"/>
  </g>
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
            <IconMinimize size={10} />
          </button>
          <button 
            onClick={handleDecorativeButtonClick}
            className="w-[44px] h-[28px] hover:bg-white/20 text-white font-sans text-[11px] transition"
          >
            <IconMaximize size={10} />
          </button>
          <button 
            onClick={handleDecorativeButtonClick}
            className="w-[44px] h-[28px] hover:bg-red-600 text-white font-sans text-[11px] transition"
          >
            <IconClose size={10} />
          </button>
        </div>
      </div>

      {/* ============ MENU BAR (Faithful Windows Desktop Style with hover sliding) ============ */}
      <div 
        ref={menuBarRef}
        className="h-[24px] bg-[#F0F0F0] border-b border-[#C8C8C8] flex items-center px-[4px] relative z-40 text-slate-800 text-[12px] font-sans"
      >
        {/* HAMBURGER BUTTON — visible only on mobile */}
        <button
          className="mobile-only hamburger-btn"
          onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
          aria-label="Menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <rect x="2" y="3" width="14" height="2" rx="0.5" />
            <rect x="2" y="8" width="14" height="2" rx="0.5" />
            <rect x="2" y="13" width="14" height="2" rx="0.5" />
          </svg>
        </button>

        {/* DESKTOP MENU ITEMS (hidden on mobile via CSS) */}
        <div className="desktop-menu flex items-center">
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
                <span><IconDocument size={14} /> {mt.new}</span>
                <span className="text-[10px] text-slate-400">Ctrl+N</span>
              </button>
              <button onClick={() => { fileInputRef.current?.click(); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between text-slate-800">
                <span><IconFolderOpen size={14} /> {mt.open}</span>
                <span className="text-[10px] text-slate-400">Ctrl+O</span>
              </button>
              <div className="h-[1px] bg-slate-300 my-1"></div>
              <button onClick={handleExportFprg} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between text-slate-800">
                <span><IconSave size={14} /> {mt.save}</span>
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
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4B9DDC" strokeWidth="2" fill="#E8F4FD"/>
                    <path d="M3 15L8 10L12 14L17 9L21 13V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V15Z" fill="#4B9DDC"/>
                    <circle cx="7" cy="7" r="2" fill="#F2A93B"/>
                  </svg>
                  {mt.exportPng}
                </span>
              </button>
              <button onClick={handleExportPdf} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#E14C4C" strokeWidth="2" fill="#FDEBEB"/>
                    <path d="M14 2V8H20" stroke="#E14C4C" strokeWidth="2"/>
                    <rect x="7" y="13" width="10" height="6" rx="1" fill="#E14C4C"/>
                    <text x="8.5" y="17.5" fill="white" fontSize="5" fontWeight="bold" fontFamily="sans-serif">PDF</text>
                  </svg>
                  {mt.exportPdf}
                </span>
              </button>
              <div className="h-[1px] bg-slate-300 my-1"></div>
              <button onClick={() => { setWinUIDialog({ isOpen: true, title: mt.clearStorage, message: 'Clear saved flowchart from local storage? Your current canvas will not be affected.', type: 'confirm', onOk: () => clearLocalStorage() }); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#FFF0F0] flex items-center text-rose-700">
                <span><IconTrash size={14} /> {mt.clearStorage}</span>
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
              <button onClick={() => { if (selectedBlockId) cutBlock(selectedBlockId); setActiveDropdown(null); }} disabled={!selectedBlockId} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-30 text-slate-800">                  <span><IconScissors size={13} /> {language === 'it' ? 'Taglia' : 'Cut'}</span>
                <span className="text-[10px] text-slate-400 font-mono">Ctrl+X</span>
              </button>
              <button onClick={() => { if (selectedBlockId) copyBlock(selectedBlockId); setActiveDropdown(null); }} disabled={!selectedBlockId} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-30 text-slate-800">                  <span><IconClipboard size={13} /> {language === 'it' ? 'Copia' : 'Copy'}</span>
                <span className="text-[10px] text-slate-400 font-mono">Ctrl+C</span>
              </button>
              <button onClick={() => { pasteBlock(); setActiveDropdown(null); }} disabled={!copiedBlock} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center justify-between disabled:opacity-30 text-slate-800">                  <span><IconInbox size={13} /> {language === 'it' ? 'Incolla' : 'Paste'}</span>
                <span className="text-[10px] text-slate-400 font-mono">Ctrl+V</span>
              </button>
              
              <div className="h-[1px] bg-slate-300 my-1"></div>
              
              {/* Zoom options inside menu */}
              <button onClick={() => setZoom((prev) => Math.min(6.0, prev + 0.1))} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] text-slate-800 flex items-center gap-1.5">
                <span><IconMagnifier size={14} /> {mt.zoomInLabel}</span>
              </button>
              <button onClick={() => setZoom((prev) => Math.max(0.4, prev - 0.1))} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] text-slate-800 flex items-center gap-1.5">
                <span><IconMagnifier size={14} /> {mt.zoomOutLabel}</span>
              </button>
              <button onClick={() => setZoom(1.0)} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] text-slate-800 flex items-center gap-1.5">
                <span><IconRefresh size={14} /> {mt.zoomResetLabel}</span>
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
            <IconPalette size={14} /> {mt.styleMenu}
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
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4B9DDC" strokeWidth="2" fill="#E8F4FD"/>
                    <path d="M3 15L8 10L12 14L17 9L21 13V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V15Z" fill="#4B9DDC"/>
                    <circle cx="7" cy="7" r="2" fill="#F2A93B"/>
                  </svg>
                  {mt.exportPng}
                </span>
              </button>
              <button onClick={handleExportPdf} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#E14C4C" strokeWidth="2" fill="#FDEBEB"/>
                    <path d="M14 2V8H20" stroke="#E14C4C" strokeWidth="2"/>
                    <rect x="7" y="13" width="10" height="6" rx="1" fill="#E14C4C"/>
                    <text x="8.5" y="17.5" fill="white" fontSize="5" fontWeight="bold" fontFamily="sans-serif">PDF</text>
                  </svg>
                  {mt.exportPdf}
                </span>
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
                <span><IconPlay size={14} /> {mt.run}</span>
              </button>
              <button onClick={() => { stepRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span><IconStep size={14} /> {mt.step}</span>
              </button>
              <button onClick={() => { pauseRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span><IconPause size={14} /> {mt.pause}</span>
              </button>
              <button onClick={() => { stopRun(); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span><IconStop size={14} /> {mt.stop}</span>
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
                <span><IconClipboard size={14} /> {mt.changelogMenuOption}</span>
              </button>
              <button onClick={() => { setShowManual(true); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800 font-bold">
                <span><IconBooks size={14} /> {mt.manualMenuOption}</span>
              </button>
              <button onClick={() => { setShowAbout(true); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800">
                <span><IconInfo size={14} /> {mt.about}</span>
              </button>
              <div className="border-t border-[#DDD] my-0.5"></div>
              <a href="https://github.com/PiBOH/flowonline2/issues/new/choose" target="_blank" rel="noopener noreferrer" onClick={() => setActiveDropdown(null)} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800 no-underline">
                <span>🐛 {mt.bugReport}</span>
              </a>
              <a href="https://github.com/PiBOH/flowonline2/issues/new/choose" target="_blank" rel="noopener noreferrer" onClick={() => setActiveDropdown(null)} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800 no-underline">                  <span><IdeaLightbulb size={14} /> {mt.featureRequest}</span>
              </a>
              <a href="https://github.com/PiBOH/flowonline2/fork" target="_blank" rel="noopener noreferrer" onClick={() => setActiveDropdown(null)} className="w-full text-left px-3 py-1.5 hover:bg-[#C9DEF5] flex items-center text-slate-800 no-underline">
                <span>🔀 {mt.forkContribute}</span>
              </a>
            </div>
          )}
        </div>

        {/* GLOBE LANGUAGE SWITCHER */}
        <div className="relative ml-auto mr-2 flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
          <span>            <IconGlobe size={14} /> {mt.languageLabel}:</span>
          <button
            onClick={() => setShowLanguagePicker(true)}
            className="border border-[#B0B0B0] bg-white rounded-md py-0.5 px-2 text-slate-700 font-bold hover:bg-[#C9DEF5] focus:outline-none cursor-pointer transition"
          >
            {LANGUAGE_NAMES[language] || language}
          </button>
        </div>
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
              <IconDocument size={16} />
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
              <IconFolderOpen size={16} />
          </button>

          {/* SAVE BUTTON */}
          <button
            onClick={handleExportFprg}
            className="w-[32px] h-[32px] hover:bg-slate-200/50 hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-slate-700 text-sm active:scale-95 transition-all"
            title="Salva (Ctrl+S)"
          >
              <IconSave size={16} />
          </button>

          <div className="w-[1px] h-[24px] bg-[#B0B0B0] mx-[6px] shadow-[1px_0_0_#FAFAFA]"></div>

          {/* RUN BUTTON */}
          <button
            onClick={startRun}
            disabled={isRunning}
            className="w-[32px] h-[32px] hover:bg-[#D5EAFA] hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-emerald-600 font-bold active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
            title={t.toolbar.run}
          >
            <IconPlay size={13} />
          </button>

          {/* STEP BUTTON */}
          <button
            onClick={stepRun}
            className="w-[32px] h-[32px] hover:bg-[#D5EAFA] hover:border hover:border-[#5B8DC4] hover:shadow-sm rounded-[3px] flex items-center justify-center text-blue-600 font-bold active:scale-95 transition-all"
            title={t.toolbar.step}
          >
            <IconStep size={13} />
          </button>

          {/* PAUSE BUTTON */}
          <button
            onClick={pauseRun}
            disabled={!isRunning}
            className="w-[32px] h-[32px] hover:bg-[#FCD2E6] hover:border hover:border-[#B03F70] hover:shadow-sm rounded-[3px] flex items-center justify-center text-amber-600 font-bold active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
            title={t.toolbar.pause}
          >
            <IconPause size={13} />
          </button>

          {/* STOP BUTTON */}
          <button
            onClick={stopRun}
            disabled={isStopped}
            className="w-[32px] h-[32px] hover:bg-rose-100 hover:border hover:border-red-400 hover:shadow-sm rounded-[3px] flex items-center justify-center text-red-600 font-bold active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
            title={t.toolbar.stop}
          >
            <IconStop size={13} />
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
              <IconMagnifier size={13} />-
          </button>
          <span className="text-[10px] font-bold text-slate-500 w-[42px] text-center font-mono select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(6.0, prev + 0.1))}
            className="w-[24px] h-[24px] hover:bg-slate-200/50 rounded flex items-center justify-center text-slate-600 active:scale-95 transition"
            title={mt.zoomInLabel}
          >
              <IconMagnifier size={13} />+
          </button>
          <button
            onClick={() => setZoom(1.0)}
            className="w-[20px] h-[20px] hover:bg-slate-200/50 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition text-[11px]"
            title={mt.zoomResetLabel}
          >
              <IconRefresh size={13} />
          </button>
        </div>

      </div>

      {/* ============ WIN32 ABOUT DIALOG MODAL - WinUI (original layout restored) ============ */}
      {showAbout && (
        <WinUIDialog
          isOpen={showAbout}
          onClose={() => setShowAbout(false)}
          title={mt.aboutTitle}
          message=""
          type="info"
          defaultWidth={700}
          defaultHeight={525}
          okLabel={t.modals.ok}
          onOk={() => setShowAbout(false)}
        >
          <div className="flex flex-col gap-3 select-text">
            {/* Logo + App Info (original horizontal flex layout) */}
            <div className="flex items-start gap-4">
              {/* Logo - using logo_crop.png */}
              <div className="w-16 h-16 bg-white rounded border border-slate-300 shadow-inner flex items-center justify-center shrink-0">
                <svg className="w-9 h-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" >
  <defs>
    <linearGradient id="grad-yellow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff568"/>
      <stop offset="20%" stop-color="#ffdd00"/>
      <stop offset="100%" stop-color="#cca100"/>
    </linearGradient>
    <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b8b"/>
      <stop offset="30%" stop-color="#ff1a40"/>
      <stop offset="100%" stop-color="#b30022"/>
    </linearGradient>
    <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6bebff"/>
      <stop offset="30%" stop-color="#00aaff"/>
      <stop offset="100%" stop-color="#0066cc"/>
    </linearGradient>
    <linearGradient id="grad-green" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8eff70"/>
      <stop offset="20%" stop-color="#26e600"/>
      <stop offset="100%" stop-color="#178a00"/>
    </linearGradient>

    <linearGradient id="grad-ring-top" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4ae034"/>
      <stop offset="50%" stop-color="#e6dc38"/>
      <stop offset="100%" stop-color="#e63838"/>
    </linearGradient>
    <linearGradient id="grad-ring-bottom" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#e63838"/>
      <stop offset="50%" stop-color="#2660e6"/>
      <stop offset="100%" stop-color="#4ae034"/>
    </linearGradient>

    <linearGradient id="gloss-white" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <g stroke="#777" stroke-width="1.2" fill="none" opacity="0.5" stroke-linecap="round">
    <path d="M 330 90 A 185 185 0 0 1 405 155" />
    <path d="M 405 345 A 185 185 0 0 1 350 395" />
    <path d="M 160 405 A 185 185 0 0 1 105 365" />
    <path d="M 90 170 A 185 185 0 0 1 145 105" />
    <path d="M 210 160 A 90 90 0 0 1 290 160" />
    <path d="M 285 330 A 90 90 0 0 1 240 345" />
  </g>

  <path d="M 90 250 A 160 160 0 0 1 410 250" fill="none" stroke="url(#grad-ring-top)" stroke-width="24" opacity="0.9"/>
  <path d="M 410 250 A 160 160 0 0 1 90 250" fill="none" stroke="url(#grad-ring-bottom)" stroke-width="24" opacity="0.9"/>

  <g transform="translate(40, 210)" filter="url(#glow)">
    <rect x="0" y="0" width="120" height="80" rx="5" fill="none" stroke="#63ff42" stroke-width="1.5" opacity="0.7"/>
    <rect x="1" y="1" width="118" height="78" rx="4" fill="url(#grad-green)"/>
    <path d="M 1 1 L 119 1 L 119 45 L 1 15 Z" fill="url(#gloss-white)"/>
  </g>

  <g transform="translate(190, 45)" filter="url(#glow)">
    <rect x="0" y="0" width="120" height="80" rx="5" fill="none" stroke="#fff152" stroke-width="1.5" opacity="0.7"/>
    <rect x="1" y="1" width="118" height="78" rx="4" fill="url(#grad-yellow)"/>
    <path d="M 1 1 L 119 1 L 119 35 L 1 50 Z" fill="url(#gloss-white)"/>
  </g>

  <g transform="translate(315, 215)" filter="url(#glow)">
    <path d="M 35 0 L 145 0 L 110 75 L 0 75 Z" fill="none" stroke="#ff4d6a" stroke-width="1.5" opacity="0.7"/>
    <path d="M 35 1 L 144 1 L 109 74 L 1 74 Z" fill="url(#grad-red)"/>
    <path d="M 35 1 L 144 1 L 126 38 L 18 38 Z" fill="url(#gloss-white)"/>
  </g>

  <g transform="translate(180, 360)" filter="url(#glow)">
    <path d="M 30 0 L 140 0 L 110 75 L 0 75 Z" fill="none" stroke="#46cfff" stroke-width="1.5" opacity="0.7"/>
    <path d="M 30 1 L 139 1 L 109 74 L 1 74 Z" fill="url(#grad-blue)"/>
    <path d="M 30 1 L 139 1 L 124 35 L 15 35 Z" fill="url(#gloss-white)"/>
  </g>
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

            {/* License text box (original layout) */}
            <div className="flex-1 flex flex-col space-y-1.5 my-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">
                <span>{mt.aboutLicense}</span>
                <span className={`px-2.5 py-0.5 rounded-full font-sans text-[8px] font-black ${licenseSource === 'repo' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                  {licenseSource === 'repo' ? mt.licenseRepoLoaded : mt.licenseFallbackLoaded}
                </span>
              </div>
              <textarea
                readOnly
                value={licenseText}
                className="w-full h-[300px] border border-slate-300 rounded p-3 font-mono text-[11px] bg-white text-slate-600 focus:outline-none resize-none overflow-auto leading-relaxed shadow-inner select-text"
              />
            </div>
          </div>
        </WinUIDialog>
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
            <div className="p-4 flex flex-col space-y-4 bg-[#F0F0F0] text-slate-800 select-text">
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

      {/* ============ WIN32 MANUAL DIALOG MODAL - WinUI (BETA 2.3.2) ============ */}
      {showManual && (
        <WinUIDialog
          isOpen={showManual}
          onClose={() => setShowManual(false)}
          title={mt.manualTitle}
          message=""
          type="info"
          defaultWidth={800}
          defaultHeight={600}
          okLabel={t.modals.ok}
          onOk={() => setShowManual(false)}
        >
          <div className="flex flex-col gap-2 select-text">
            {/* Documentation source badge */}
            <div className={`text-[9px] px-2 py-1 rounded font-semibold text-center ${manualSource === 'repo' ? 'bg-emerald-200 text-emerald-800' : 'bg-yellow-200 text-yellow-800'}`}>
              {manualSource === 'repo' ? 'Documentation: ' + mt.manualRepoLoaded : mt.manualFallbackLoaded}
              <span className="font-mono ml-2 text-slate-500">MANUAL.md</span>
            </div>

            {/* BEAUTIFULLY STYLED MARKDOWN VIEWER PANEL */}
            <div className="w-full flex-1 border border-slate-300 rounded p-4 bg-white text-slate-800 overflow-y-auto shadow-inner select-text leading-relaxed" style={{ height: '480px' }}>
              {parseMarkdown(manualText)}
            </div>
          </div>
        </WinUIDialog>
      )}

      {/* ============ WIN32 CHANGELOG DIALOG MODAL - WinUI (BETA 2.3.2) ============ */}
      {showChangelog && (
        <WinUIDialog
          isOpen={showChangelog}
          onClose={() => setShowChangelog(false)}
          title={mt.changelogTitle}
          message=""
          type="info"
          defaultWidth={750}
          defaultHeight={550}
          okLabel={t.modals.ok}
          onOk={() => setShowChangelog(false)}
        >
          <div className="flex flex-col gap-2 select-text">
            {/* Changelog Source Badge */}
            <div className={`text-[9px] px-2 py-1 rounded font-semibold text-center ${changelogSource === 'repo' ? 'bg-emerald-200 text-emerald-800' : 'bg-yellow-200 text-yellow-800'}`}>
              {changelogSource === 'repo' ? mt.changelogRepoLoaded : mt.changelogFallbackLoaded}
              <span className="font-mono ml-2 text-slate-500">CHANGELOG.md</span>
            </div>

            {/* Content Viewer */}
            <div className="flex-1 overflow-y-auto select-text p-4 bg-white border border-[#C0C0C0] rounded text-[11px] leading-relaxed font-sans text-slate-800" style={{ minHeight: '400px' }}>
              {parseMarkdown(changelogText)}
            </div>
          </div>
        </WinUIDialog>
      )}

      {/* CRITICAL FILE INPUT (Rendered outside conditional blocks so it's always in the DOM and available for toolbar click!) */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".fprg,.json"
        className="hidden"      />

      {/* WinUI Dialog for alerts/confirms */}
      <WinUIDialog
        isOpen={winUIDialog.isOpen}
        onClose={() => setWinUIDialog(prev => ({ ...prev, isOpen: false }))}
        title={winUIDialog.title}
        message={winUIDialog.message}
        type={winUIDialog.type}
        onOk={() => { winUIDialog.onOk?.(); setWinUIDialog(prev => ({ ...prev, isOpen: false })); }}
        onCancel={() => setWinUIDialog(prev => ({ ...prev, isOpen: false }))}
        okLabel={t.modals.ok}
        cancelLabel={t.modals.cancel}
      />

      {/* Language Picker WinUI Dialog */}
      {showLanguagePicker && (
        <WinUIDialog
          isOpen={showLanguagePicker}
          onClose={() => setShowLanguagePicker(false)}
          title={mt.selectLanguage}
          message=""
          type="info"
          defaultWidth={480}
          defaultHeight={400}
          okLabel={t.modals.ok}
          cancelLabel={t.modals.cancel}
          onOk={() => setShowLanguagePicker(false)}
        >
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(LANGUAGE_NAMES) as Language[]).map((code) => (
              <button
                key={code}
                onClick={() => { setLanguage(code); setShowLanguagePicker(false); }}
                className={`px-3 py-2 rounded-md text-[11px] font-semibold transition border ${
                  language === code
                    ? 'bg-[#5B8DC4] text-white border-[#3E6FA8]'
                    : 'bg-white text-slate-700 border-[#C0C0C0] hover:bg-[#C9DEF5]'
                }`}
              >
                <FlagIcon code={code} size={14} /> {LANGUAGE_NAMES[code]}
              </button>
            ))}
            {/* Translation Disclaimer */}
            <div className="mt-3 pt-2 border-t border-[#D0D0D0] text-[9px] text-amber-600 italic text-center px-4">
              <IconWarning size={14} /> Notice: The translations of Flowonline2 and all other local project files might not be 100% accurate.
            </div>
          </div>
        </WinUIDialog>
      )}
      {/* MOBILE HAMBURGER SLIDE-OUT MENU */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="mobile-menu-panel">
            <div className="flex justify-between items-center p-3 border-b border-slate-200">
              <span className="font-bold text-sm text-slate-700">Flowonline2</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="2" y1="2" x2="14" y2="14" />
                  <line x1="14" y1="2" x2="2" y2="14" />
                </svg>
              </button>
            </div>
            <div className="p-3 border-b border-slate-200 flex gap-2 flex-wrap">
              <button onClick={() => { startRun(); setMobileMenuOpen(false); }} disabled={executionStatus === 'running'} className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-semibold disabled:opacity-40">{mt.run}</button>
              <button onClick={() => { stepRun(); setMobileMenuOpen(false); }} disabled={executionStatus === 'running'} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold disabled:opacity-40">{mt.step}</button>
              <button onClick={() => { pauseRun(); setMobileMenuOpen(false); }} disabled={executionStatus !== 'running'} className="px-3 py-1.5 bg-amber-500 text-white rounded text-xs font-semibold disabled:opacity-40">{mt.pause}</button>
              <button onClick={() => { stopRun(); setMobileMenuOpen(false); }} disabled={executionStatus === 'stopped' || executionStatus === 'idle'} className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold disabled:opacity-40">{mt.stop}</button>
            </div>
            <div className="p-3 space-y-0.5 max-h-[55vh] overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">{mt.file}</div>
              <button onClick={() => { clearAll(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.new}</button>
              <button onClick={() => { fileInputRef.current?.click(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.open}</button>
              <button onClick={() => { handleExportFprg(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.save}</button>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 pb-1">{mt.edit}</div>
              <button onClick={() => { undo(); setMobileMenuOpen(false); }} disabled={!canUndo} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm disabled:opacity-30">• {mt.undo}</button>
              <button onClick={() => { redo(); setMobileMenuOpen(false); }} disabled={!canRedo} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm disabled:opacity-30">• {mt.redo}</button>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 pb-1">{mt.tools}</div>
              <button onClick={() => { handleExportSvg(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.exportSvg}</button>
              <button onClick={() => { handleExportPng(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.exportPng}</button>
              <button onClick={() => { clearLocalStorage(); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.clearStorage}</button>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-2 pb-1">{mt.help}</div>
              <button onClick={() => { setShowLanguagePicker(true); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.selectLanguage}</button>
              <button onClick={() => { setShowAbout(true); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.about}</button>
              <button onClick={() => { setShowManual(true); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.manualMenuOption}</button>
              <button onClick={() => { setShowChangelog(true); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.changelogMenuOption}</button>
              <a href="https://github.com/PiBOH/flowonline2/issues/new/choose" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.bugReport}</a>
              <a href="https://github.com/PiBOH/flowonline2/issues/new/choose" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded hover:bg-slate-100 text-sm">• {mt.featureRequest}</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
