import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Statement,
  VariableSymbol,
  Instruction,
  ConsoleMessage,
  Language,
  DeclareBlock,
  AssignBlock,
  InputBlock,
  OutputBlock,
  ForBlock,
  CallBlock
} from '../types/flow';
import { ExpressionParser } from '../utils/parser';
import { generateId } from '../utils/fprgParser';

export type AppLayout = 'flowchart_only' | 'flow_console' | 'flow_variables' | 'triple_split' | 'flow_code';

// LOCALSTORAGE PERSISTENCE CONFIGURATION
const STORAGE_KEY = 'flowonline2_program';
const AUTHOR_KEY = 'flowonline2_author';
const STORAGE_VERSION = 1;

interface SavedProgram {
  statements: Statement[];
  programTitle: string;
  programAuthor: string;
  version: number;
}

const isValidStatement = (value: unknown): value is Statement => {
  if (value === null || typeof value !== 'object') return false;
  const stmt = value as Partial<Statement>;
  return typeof stmt.id === 'string' && typeof stmt.type === 'string';
};

const loadSavedProgram = (): SavedProgram | null => {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedProgram;
    if (!Array.isArray(parsed.statements) || !parsed.statements.every(isValidStatement)) {
      // Corrupted data: clear it so the app doesn't crash
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (typeof parsed.programTitle !== 'string') parsed.programTitle = 'Untitled Program';
    if (typeof parsed.programAuthor !== 'string') parsed.programAuthor = '';
    return parsed;
  } catch {
    return null;
  }
};
export type ColorSchemeType = 'classic' | 'pastel' | 'vibrant' | 'retro' | 'twilight' | 'black_white';

interface FlowContextType {
  // Flowchart state
  statements: Statement[];
  programTitle: string;
  programAuthor: string;
  setProgramTitle: (t: string) => void;
  setProgramAuthor: (a: string) => void;
  
  // App Layout MDI Splitting
  layout: AppLayout;
  setLayout: (l: AppLayout) => void;
  
  // Color Scheme (Flowchart Styles)
  colorScheme: ColorSchemeType;
  setColorScheme: (s: ColorSchemeType) => void;

  // Global shared zoom state
  zoom: number;
  setZoom: (z: number | ((prev: number) => number)) => void;
  
  // Execution state
  variables: Record<string, VariableSymbol>;
  currentBlockId: string | null;
  executionStatus: 'idle' | 'running' | 'paused' | 'stopped' | 'input_pause' | 'error' | 'finished';
  consoleMessages: ConsoleMessage[];
  speed: number; // 1 to 100
  setSpeed: (s: number) => void;
  
  // Interactivity
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Flowchart Editing Actions
  addBlock: (targetId: string | 'main_start' | 'main_end', type: 'declare' | 'assign' | 'input' | 'output' | 'if' | 'while' | 'for' | 'do' | 'call' | 'comment') => void;
  deleteBlock: (id: string) => void;
  updateBlock: (id: string, updatedFields: Partial<Statement>) => void;
  clearAll: () => void;
  clearLocalStorage: () => void;
  loadProgram: (statements: Statement[], title: string, author: string) => void;
  
  // Modal Editor state
  editingBlock: Statement | null;
  openEditor: (block: Statement) => void;
  closeEditor: () => void;
  saveBlockFields: (fields: Partial<Statement>) => void;
  
  // Execution actions
  startRun: () => void;
  stepRun: () => void;
  pauseRun: () => void;
  stopRun: () => void;
  submitInput: (val: string) => void;
  clearConsole: () => void;

  // SINGLE BLOCK SELECTION, COPY & PASTE (FOR 100% BACKWARDS COMPATIBILITY!)
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  copiedBlock: Statement | null;
  setCopiedBlock: (block: Statement | null) => void;
  copyBlock: (id: string) => void;
  cutBlock: (id: string) => void;
  pasteBlock: (targetId?: string | 'main_start' | 'main_end') => void;

  // MULTIPLE BLOCK SELECTION, COPY & PASTE (FLOWGORTHM WIN32 FIDELITY!)
  selectedBlockIds: string[];
  setSelectedBlockIds: (ids: string[]) => void;
  copiedBlocks: Statement[];
  setCopiedBlocks: (blocks: Statement[]) => void;
  copyBlocks: (ids: string[]) => void;
  cutBlocks: (ids: string[]) => void;
  pasteBlocks: (targetId?: string | 'main_start' | 'main_end') => void;
  deleteBlocks: (ids: string[]) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

// CASE INSENSITIVE VARIABLE LOOKUP HELPER
export const getVariableSymbol = (name: string, env: Record<string, VariableSymbol>): VariableSymbol | undefined => {
  const lowerName = name.toLowerCase();
  const matchedKey = Object.keys(env).find(k => k.toLowerCase() === lowerName);
  return matchedKey ? env[matchedKey] : undefined;
};

// RECURSIVE DEEP COPY BLOCK ID GENERATOR (PREVENTS ID COLLISION CONFLICTS ON PASTE!)
export function regenerateBlockIds(stmt: Statement): Statement {
  const copy = JSON.parse(JSON.stringify(stmt)) as Statement;
  
  const recurse = (s: Statement) => {
    s.id = generateId();
    if (s.type === 'if') {
      s.thenBranch.forEach(recurse);
      s.elseBranch.forEach(recurse);
    } else if (s.type === 'while' || s.type === 'for' || s.type === 'do') {
      s.body.forEach(recurse);
    }
  };
  
  recurse(copy);
  return copy;
}

// RECURSIVE TREE SEARCH FIND BY ID HELPER
export const findBlockById = (list: Statement[], id: string): Statement | null => {
  for (const item of list) {
    if (item.id === id) return item;
    if (item.type === 'if') {
      const found = findBlockById(item.thenBranch, id);
      if (found) return found;
      const foundElse = findBlockById(item.elseBranch, id);
      if (foundElse) return foundElse;
    } else if (item.type === 'while' || item.type === 'for' || item.type === 'do') {
      const found = findBlockById(item.body, id);
      if (found) return found;
    }
  }
  return null;
};

// RECURSIVE INSERT AFTER NODE (Used for Pasting blocks in correct order!)
export const recursiveInsertAfter = (list: Statement[], targetId: string, newBlock: Statement): boolean => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.id === targetId) {
      list.splice(i + 1, 0, newBlock);
      return true;
    }
    if (item.type === 'if') {
      if (recursiveInsertAfter(item.thenBranch, targetId, newBlock)) return true;
      if (recursiveInsertAfter(item.elseBranch, targetId, newBlock)) return true;
    } else if (item.type === 'while' || item.type === 'do' || item.type === 'for') {
      if (recursiveInsertAfter(item.body, targetId, newBlock)) return true;
    }
  }
  return false;
};

// RECURSIVE INSERT BEFORE NODE (Used for + Inserters above nodes — solves visual bug!)
export const recursiveInsertBefore = (list: Statement[], targetId: string, newBlock: Statement): boolean => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (item.id === targetId) {
      list.splice(i, 0, newBlock);
      return true;
    }
    if (item.type === 'if') {
      if (recursiveInsertBefore(item.thenBranch, targetId, newBlock)) return true;
      if (recursiveInsertBefore(item.elseBranch, targetId, newBlock)) return true;
    } else if (item.type === 'while' || item.type === 'do' || item.type === 'for') {
      if (recursiveInsertBefore(item.body, targetId, newBlock)) return true;
    }
  }
  return false;
};

// RECURSIVE APPEND BLOCK TO END OF CORRESPONDING BRANCH
export const insertIntoBranch = (list: Statement[], parentId: string, branchType: string, newBlock: Statement): boolean => {
  for (const item of list) {
    if (item.id === parentId) {
      if (item.type === 'if') {
        if (branchType === 'then') {
          item.thenBranch.push(newBlock);
          return true;
        } else if (branchType === 'else') {
          item.elseBranch.push(newBlock);
          return true;
        }
      } else if (item.type === 'while' || item.type === 'for' || item.type === 'do') {
        if (branchType === 'body') {
          item.body.push(newBlock);
          return true;
        }
      }
    }
    if (item.type === 'if') {
      if (insertIntoBranch(item.thenBranch, parentId, branchType, newBlock)) return true;
      if (insertIntoBranch(item.elseBranch, parentId, branchType, newBlock)) return true;
    } else if (item.type === 'while' || item.type === 'for' || item.type === 'do') {
      if (insertIntoBranch(item.body, parentId, branchType, newBlock)) return true;
    }
  }
  return false;
};

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detect persisted author name (survives flowchart clear)
  const detectAuthor = (): string => {
    try {
      if (typeof window === 'undefined') return '';
      return window.localStorage.getItem(AUTHOR_KEY) || '';
    } catch {
      return '';
    }
  };

  // Master diagram states (loaded once from localStorage to avoid race conditions and extra renders)
  const [savedData] = useState(() => loadSavedProgram());
  const [statements, setStatements] = useState<Statement[]>(() => savedData?.statements ?? []);
  const [programTitle, setProgramTitleState] = useState(() => savedData?.programTitle ?? 'Untitled Program');
  const [programAuthor, setProgramAuthorState] = useState(() => savedData?.programAuthor || detectAuthor());

  // Win32 MDI Layout split state
  const [layout, setLayout] = useState<AppLayout>('triple_split');

  // Color Scheme (Flowchart Styles)
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>('classic');

  // Shared zoom state
  const [zoom, setZoom] = useState<number>(1.0);

  // MULTIPLE BLOCK SELECTION, COPY & PASTE (WINDOWS FIDELITY STATES!)
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [copiedBlocks, setCopiedBlocks] = useState<Statement[]>([]);

  // BACKWARDS-COMPATIBLE GETTERS & SETTERS (Keeps other modules working flawlessly!)
  const selectedBlockId = selectedBlockIds.length > 0 ? selectedBlockIds[selectedBlockIds.length - 1] : null;
  const setSelectedBlockId = (id: string | null) => {
    setSelectedBlockIds(id ? [id] : []);
  };

  const copiedBlock = copiedBlocks.length > 0 ? copiedBlocks[copiedBlocks.length - 1] : null;
  const setCopiedBlock = (block: Statement | null) => {
    setCopiedBlocks(block ? [block] : []);
  };

  // History for undo/redo
  const [undoStack, setUndoStack] = useState<Array<{ statements: Statement[]; title: string; author: string }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ statements: Statement[]; title: string; author: string }>>([]);

  // Language translation selector (DEFAULT: English US!)
  const [language, setLanguage] = useState<Language>('en');

  // VM Execution state
  const [variables, setVariables] = useState<Record<string, VariableSymbol>>({});
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] = useState<FlowContextType['executionStatus']>('idle');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  
  // Default speed set to maximum (100) as requested!
  const [speed, setSpeed] = useState<number>(100); 

  // Editor states
  const [editingBlock, setEditingBlock] = useState<Statement | null>(null);

  // Persist program to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const data: SavedProgram = {
        statements,
        programTitle,
        programAuthor,
        version: STORAGE_VERSION,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Also persist author name independently (survives clearAll)
      if (programAuthor) {
        window.localStorage.setItem(AUTHOR_KEY, programAuthor);
      }
    } catch (e) {
      console.warn('Failed to save flowchart to localStorage:', e);
    }
  }, [statements, programTitle, programAuthor]);

  // VM Compiler execution references
  const instructionsRef = useRef<Instruction[]>([]);
  const pcRef = useRef<number>(0);
  const variablesRef = useRef<Record<string, VariableSymbol>>({});
  const intervalIdRef = useRef<number | null>(null);

  // Push history state helper
  const pushHistory = (newStmts: Statement[], newTitle = programTitle, newAuthor = programAuthor) => {
    setUndoStack((prev) => [...prev, { statements, title: programTitle, author: programAuthor }]);
    setRedoStack([]); // clear redo
    setStatements(newStmts);
    setProgramTitleState(newTitle);
    setProgramAuthorState(newAuthor);
  };

  const setProgramTitle = (t: string) => {
    pushHistory(statements, t, programAuthor);
  };
  
  const setProgramAuthor = (a: string) => {
    pushHistory(statements, programTitle, a);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [...prev, { statements, title: programTitle, author: programAuthor }]);
    setStatements(previous.statements);
    setProgramTitleState(previous.title);
    setProgramAuthorState(previous.author);
    stopRun();
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setUndoStack((prev) => [...prev, { statements, title: programTitle, author: programAuthor }]);
    setStatements(next.statements);
    setProgramTitleState(next.title);
    setProgramAuthorState(next.author);
    stopRun();
  };

  // CLEAR ALL
  const clearAll = () => {
    pushHistory([]);
    setSelectedBlockIds([]);
    stopRun();
  };

  // LOAD PROGRAM
  const loadProgram = (newStatements: Statement[], title: string, author: string) => {
    pushHistory(newStatements, title, author);
    setSelectedBlockIds([]);
    stopRun();
  };

  // CLEAR LOCAL STORAGE (remove saved flowchart history without clearing current work)
  const clearLocalStorage = () => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
  };

  // FLOWCHART EDIT ACTIONS (INSERT / REMOVE / UPDATE)
  const addBlock = (targetId: string | 'main_start' | 'main_end', type: 'declare' | 'assign' | 'input' | 'output' | 'if' | 'while' | 'for' | 'do' | 'call' | 'comment') => {
    let newBlock: Statement;
    const randomId = generateId();

    switch (type) {
      case 'declare':
        newBlock = { id: randomId, type: 'declare', variableName: 'x', variableType: 'Integer', isArray: false, arraySize: '' };
        break;
      case 'assign':
        newBlock = { id: randomId, type: 'assign', variableName: 'x', expression: '0' };
        break;
      case 'input':
        newBlock = { id: randomId, type: 'input', variableName: 'x' };
        break;
      case 'output':
        newBlock = { id: randomId, type: 'output', expression: '"Output"', newline: true };
        break;
      case 'if':
        newBlock = { id: randomId, type: 'if', condition: 'True', thenBranch: [], elseBranch: [] };
        break;
      case 'while':
        newBlock = { id: randomId, type: 'while', condition: 'False', body: [] };
        break;
      case 'for':
        newBlock = { id: randomId, type: 'for', variableName: 'i', startValue: '1', endValue: '10', direction: 'inc', stepValue: '1', body: [] };
        break;
      case 'do':
        newBlock = { id: randomId, type: 'do', condition: 'False', body: [] };
        break;
      case 'call':
        newBlock = { id: randomId, type: 'call', functionName: 'MyFunction', arguments: '' };
        break;
      case 'comment':
        newBlock = { id: randomId, type: 'comment', text: 'Write comment here' };
        break;
    }

    const copy = JSON.parse(JSON.stringify(statements)) as Statement[];

    if (targetId === 'main_start') {
      copy.unshift(newBlock);
    } else if (targetId === 'main_end') {
      copy.push(newBlock);
    } else if (targetId.startsWith('branch_end:')) {
      // Append block to end of nested branch/body!
      const [, parentId, branchType] = targetId.split(':');
      const inserted = insertIntoBranch(copy, parentId, branchType, newBlock);
      if (!inserted) {
        console.warn(`Could not insert block at branch end of parent ${parentId}.`);
      }
    } else {
      // Insert BEFORE node targetId (Solves ordering and nested-list bugs!)
      const inserted = recursiveInsertBefore(copy, targetId, newBlock);
      if (!inserted) {
        console.warn(`Could not find target ID ${targetId} to insert before.`);
      }
    }

    pushHistory(copy);
    stopRun();

    // Auto-open editing modal for the newly added block for extremely high developer-UX!
    setEditingBlock(newBlock);
  };

  const deleteBlock = (id: string) => {
    deleteBlocks([id]);
  };

  const updateBlock = (id: string, updatedFields: Partial<Statement>) => {
    const copy = JSON.parse(JSON.stringify(statements)) as Statement[];
    const updated = recursiveUpdate(copy, id, updatedFields);
    if (updated) {
      pushHistory(copy);
      stopRun();
    }
  };

  // RECURSIVE FLOWCHART MODIFIERS
  const recursiveDelete = (list: Statement[], id: string): boolean => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.id === id) {
        list.splice(i, 1);
        return true;
      }

      if (item.type === 'if') {
        if (recursiveDelete(item.thenBranch, id)) return true;
        if (recursiveDelete(item.elseBranch, id)) return true;
      } else if (item.type === 'while' || item.type === 'do' || item.type === 'for') {
        if (recursiveDelete(item.body, id)) return true;
      }
    }
    return false;
  };

  const recursiveUpdate = (list: Statement[], id: string, updatedFields: Partial<Statement>): boolean => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.id === id) {
        list[i] = { ...item, ...updatedFields } as Statement;
        return true;
      }

      if (item.type === 'if') {
        if (recursiveUpdate(item.thenBranch, id, updatedFields)) return true;
        if (recursiveUpdate(item.elseBranch, id, updatedFields)) return true;
      } else if (item.type === 'while' || item.type === 'do' || item.type === 'for') {
        if (recursiveUpdate(item.body, id, updatedFields)) return true;
      }
    }
    return false;
  };

  // MULTIPLE BLOCKS COPY, CUT, PASTE AND DELETE (FLOWGORTHM FULL FIDELITY!)
  const copyBlock = (id: string) => copyBlocks([id]);
  const cutBlock = (id: string) => cutBlocks([id]);
  const pasteBlock = (targetId?: string | 'main_start' | 'main_end') => pasteBlocks(targetId);

  const copyBlocks = (ids: string[]) => {
    const list: Statement[] = [];
    for (const id of ids) {
      const block = findBlockById(statements, id);
      if (block) list.push(block);
    }
    if (list.length > 0) {
      setCopiedBlocks(list);
    }
  };

  const cutBlocks = (ids: string[]) => {
    copyBlocks(ids);
    deleteBlocks(ids);
  };

  const deleteBlocks = (ids: string[]) => {
    const copy = JSON.parse(JSON.stringify(statements)) as Statement[];
    let anyDeleted = false;
    for (const id of ids) {
      if (recursiveDelete(copy, id)) {
        anyDeleted = true;
      }
    }
    if (anyDeleted) {
      pushHistory(copy);
      setSelectedBlockIds([]); // Reset selection
      stopRun();
    }
  };

  const pasteBlocks = (targetId?: string | 'main_start' | 'main_end') => {
    if (copiedBlocks.length === 0) return;

    // Default to pasting after the last selected block if any, or main_end
    const resolvedTargetId = targetId || (selectedBlockIds.length > 0 ? selectedBlockIds[selectedBlockIds.length - 1] : 'main_end');

    const copy = JSON.parse(JSON.stringify(statements)) as Statement[];
    const pastedIds: string[] = [];

    let activeTargetId = resolvedTargetId;
    for (const blockToPaste of copiedBlocks) {
      const newBlock = regenerateBlockIds(blockToPaste);
      pastedIds.push(newBlock.id);

      if (activeTargetId === 'main_start') {
        copy.unshift(newBlock);
        activeTargetId = newBlock.id;
      } else if (activeTargetId === 'main_end') {
        copy.push(newBlock);
        activeTargetId = newBlock.id;
      } else if (activeTargetId.startsWith('branch_end:')) {
        const [, parentId, branchType] = activeTargetId.split(':');
        const inserted = insertIntoBranch(copy, parentId, branchType, newBlock);
        if (inserted) {
          activeTargetId = newBlock.id; // next block pastes AFTER newly pasted block!
        }
      } else {
        // Paste AFTER activeTargetId
        const inserted = recursiveInsertAfter(copy, activeTargetId, newBlock);
        if (inserted) {
          activeTargetId = newBlock.id;
        }
      }
    }

    pushHistory(copy);
    stopRun();
    setSelectedBlockIds(pastedIds); // Select the pasted blocks altogether!
  };

  // KEYBOARD DELETION & CLIPBOARD COMMANDS EMULATION (SUPPORT MULTI-SELECTION BATCHES!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an active form/input/textarea/select
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (selectedBlockIds.length > 0) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          deleteBlocks(selectedBlockIds);
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
          e.preventDefault();
          copyBlocks(selectedBlockIds);
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
          e.preventDefault();
          cutBlocks(selectedBlockIds);
        }
      }

      // Ctrl+V Paste anywhere on the graph (defaults to inserting after selected or at the end!)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        if (copiedBlocks.length > 0) {
          e.preventDefault();
          pasteBlocks();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedBlockIds, copiedBlocks, statements]);

  // MODAL EDITOR HANDLERS
  const openEditor = (block: Statement) => setEditingBlock(block);
  const closeEditor = () => setEditingBlock(null);
  const saveBlockFields = (fields: Partial<Statement>) => {
    if (editingBlock) {
      updateBlock(editingBlock.id, fields);
      setEditingBlock(null);
    }
  };

  // VIRTUAL MACHINE COMPILER
  const compileProgram = (): Instruction[] => {
    const insts: Instruction[] = [];
    
    // Add start execution block highlight
    insts.push({ op: 'HIGHLIGHT', blockId: 'main_start' });
    
    compileList(statements, insts);
    
    // Add final end execution block highlight
    insts.push({ op: 'HIGHLIGHT', blockId: 'main_end' });
    
    return insts;
  };

  const compileList = (list: Statement[], insts: Instruction[]) => {
    for (const s of list) {
      insts.push({ op: 'HIGHLIGHT', blockId: s.id });

      switch (s.type) {
        case 'declare':
          insts.push({ op: 'DECLARE', blockId: s.id, args: s });
          break;
        case 'assign':
          insts.push({ op: 'ASSIGN', blockId: s.id, args: s });
          break;
        case 'input':
          insts.push({ op: 'INPUT_PROMPT', blockId: s.id, args: s });
          break;
        case 'output':
          insts.push({ op: 'OUTPUT', blockId: s.id, args: s });
          break;
        case 'call':
          insts.push({ op: 'CALL_FUNC', blockId: s.id, args: s });
          break;
        case 'comment':
          // No-op execution
          break;
        case 'if': {
          const jumpIfFalseIdx = insts.length;
          insts.push({ op: 'JUMP_IF_FALSE', blockId: s.id, args: { condition: s.condition, targetIdx: -1 } });
          
          compileList(s.thenBranch, insts);
          
          const jumpToEndIdx = insts.length;
          insts.push({ op: 'JUMP', blockId: s.id, args: { targetIdx: -1 } });
          
          const elseStartIdx = insts.length;
          compileList(s.elseBranch, insts);
          
          const endIdx = insts.length;
          
          // Patch offsets
          insts[jumpIfFalseIdx].args.targetIdx = elseStartIdx;
          insts[jumpToEndIdx].args.targetIdx = endIdx;
          break;
        }
        case 'while': {
          const loopHeaderIdx = insts.length - 1; // highlight is already compiled
          const jumpIfFalseIdx = insts.length;
          insts.push({ op: 'JUMP_IF_FALSE', blockId: s.id, args: { condition: s.condition, targetIdx: -1 } });
          
          compileList(s.body, insts);
          
          // Loop back to check condition
          insts.push({ op: 'JUMP', blockId: s.id, args: { targetIdx: loopHeaderIdx } });
          
          const endIdx = insts.length;
          insts[jumpIfFalseIdx].args.targetIdx = endIdx;
          break;
        }
        case 'for': {
          // 1. Assign loop variable its initial value
          insts.push({ op: 'INIT_FOR', blockId: s.id, args: s });
          
          const conditionCheckIdx = insts.length;
          // 2. Condition check: jump if condition is false
          const jumpIfFalseIdx = insts.length;
          insts.push({ op: 'JUMP_IF_FALSE', blockId: s.id, args: { condition: 'FOR_COND_CHECK', targetIdx: -1, forBlock: s } });
          
          // 3. Body
          compileList(s.body, insts);
          
          // 4. Update index (increase or decrease step)
          insts.push({ op: 'STEP_FOR', blockId: s.id, args: s });
          
          // 5. Jump back to condition
          insts.push({ op: 'JUMP', blockId: s.id, args: { targetIdx: conditionCheckIdx } });
          
          const endIdx = insts.length;
          insts[jumpIfFalseIdx].args.targetIdx = endIdx;
          break;
        }
        case 'do': {
          const loopStartIdx = insts.length;
          
          compileList(s.body, insts);
          
          // Highlight condition check
          insts.push({ op: 'HIGHLIGHT', blockId: s.id });
          
          // Jump to start if condition is true
          const checkIdx = insts.length;
          insts.push({ op: 'JUMP_IF_FALSE', blockId: s.id, args: { condition: s.condition, targetIdx: checkIdx + 2 } });
          insts.push({ op: 'JUMP', blockId: s.id, args: { targetIdx: loopStartIdx } });
          break;
        }
      }
    }
  };

  // VM STEP EXECUTOR
  const executeStep = (): boolean => {
    const insts = instructionsRef.current;
    const pc = pcRef.current;

    if (pc < 0 || pc >= insts.length) {
      setExecutionStatus('finished');
      setCurrentBlockId(null);
      addConsoleMessage('system', '--- Program Terminated Successfully ---');
      return false; // stop VM
    }

    const inst = insts[pc];
    setCurrentBlockId(inst.blockId);
    pcRef.current = pc + 1;

    try {
      const parser = new ExpressionParser(variablesRef.current);

      switch (inst.op) {
        case 'HIGHLIGHT':
          break;

        case 'DECLARE': {
          const b = inst.args as DeclareBlock;
          const varNames = b.variableName.split(',').map((n) => n.trim());
          
          for (const name of varNames) {
            if (!name) continue;
            let val: any = 0;
            if (b.variableType === 'String') val = '';
            if (b.variableType === 'Boolean') val = false;

            let size = 0;
            if (b.isArray) {
              const parsedSize = parser.parseAndEvaluate(b.arraySize);
              size = Math.max(1, Math.floor(Number(parsedSize)));
              val = new Array(size).fill(b.variableType === 'String' ? '' : b.variableType === 'Boolean' ? false : 0);
            }

            variablesRef.current[name] = {
              name,
              type: b.variableType,
              isArray: b.isArray,
              arraySize: b.isArray ? size : undefined,
              value: val
            };
          }
          setVariables({ ...variablesRef.current });
          break;
        }

        case 'ASSIGN': {
          const b = inst.args as AssignBlock;
          const name = b.variableName.trim();
          const rValue = parser.parseAndEvaluate(b.expression);

          if (name.includes('[') && name.endsWith(']')) {
            const startBracket = name.indexOf('[');
            const arrName = name.substring(0, startBracket).trim();
            const indexExpr = name.substring(startBracket + 1, name.length - 1).trim();
            
            const indexParser = new ExpressionParser(variablesRef.current);
            const indexVal = Math.floor(Number(indexParser.parseAndEvaluate(indexExpr)));

            // CASE INSENSITIVE array symbol lookup
            const sym = getVariableSymbol(arrName, variablesRef.current);
            if (!sym) {
              throw new Error(`Array '${arrName}' not defined.`);
            }
            if (!sym.isArray) {
              throw new Error(`Variable '${arrName}' is not an array/vector.`);
            }
            if (indexVal < 0 || indexVal >= (sym.arraySize ?? 0)) {
              throw new Error(`Index ${indexVal} out of bounds for array '${arrName}' (size: ${sym.arraySize}).`);
            }

            let validatedVal = rValue;
            if (sym.type === 'Integer') validatedVal = Math.floor(Number(rValue));
            if (sym.type === 'Real') validatedVal = Number(rValue);
            if (sym.type === 'Boolean') validatedVal = Boolean(rValue);
            if (sym.type === 'String') validatedVal = String(rValue);

            // IMMUTABLE VALUE ARRAY REPLACEMENT (React-safe state updates!)
            const updatedArr = [...sym.value];
            updatedArr[indexVal] = validatedVal;
            variablesRef.current[sym.name] = {
              ...sym,
              value: updatedArr
            };
          } else {
            // CASE INSENSITIVE variable symbol lookup
            const sym = getVariableSymbol(name, variablesRef.current);
            if (!sym) {
              throw new Error(`Variable '${name}' is not declared.`);
            }

            let validatedVal = rValue;
            if (sym.type === 'Integer') validatedVal = Math.floor(Number(rValue));
            if (sym.type === 'Real') validatedVal = Number(rValue);
            if (sym.type === 'Boolean') validatedVal = Boolean(rValue);
            if (sym.type === 'String') validatedVal = String(rValue);

            // IMMUTABLE VALUE SYMBOL REPLACEMENT (React-safe state updates!)
            variablesRef.current[sym.name] = {
              ...sym,
              value: validatedVal
            };
          }

          setVariables({ ...variablesRef.current });
          break;
        }

        case 'INPUT_PROMPT': {
          const b = inst.args as InputBlock;
          const name = b.variableName.trim();
          let targetName = name;

          if (name.includes('[') && name.endsWith(']')) {
            const startBracket = name.indexOf('[');
            targetName = name.substring(0, startBracket).trim();
          }

          // CASE INSENSITIVE variable symbol check
          const sym = getVariableSymbol(targetName, variablesRef.current);
          if (!sym) {
            throw new Error(`Input variable '${targetName}' is not defined.`);
          }

          setExecutionStatus('input_pause');
          addConsoleMessage('system', `Please enter a value for ${name}:`);
          
          if (intervalIdRef.current) {
            window.clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          return false;
        }

        case 'OUTPUT': {
          const b = inst.args as OutputBlock;
          const outVal = parser.parseAndEvaluate(b.expression);
          addConsoleMessage('output', String(outVal));
          break;
        }

        case 'JUMP':
          pcRef.current = inst.args.targetIdx;
          break;

        case 'JUMP_IF_FALSE': {
          const conditionStr = inst.args.condition;
          
          if (conditionStr === 'FOR_COND_CHECK') {
            const b = inst.args.forBlock as ForBlock;
            // CASE INSENSITIVE loop variable lookup
            const sym = getVariableSymbol(b.variableName, variablesRef.current);
            if (!sym) throw new Error(`Loop variable '${b.variableName}' not found.`);

            const currentIdxVal = Number(sym.value);
            const endVal = Number(parser.parseAndEvaluate(b.endValue));

            const isContinuing = b.direction === 'inc' 
              ? currentIdxVal <= endVal 
              : currentIdxVal >= endVal;

            if (!isContinuing) {
              pcRef.current = inst.args.targetIdx;
            }
          } else {
            const isTrue = Boolean(parser.parseAndEvaluate(conditionStr));
            if (!isTrue) {
              pcRef.current = inst.args.targetIdx;
            }
          }
          break;
        }

        case 'INIT_FOR': {
          const b = inst.args as ForBlock;
          const name = b.variableName;
          const startVal = parser.parseAndEvaluate(b.startValue);

          // CASE INSENSITIVE lookup
          const sym = getVariableSymbol(name, variablesRef.current);
          if (!sym) {
            throw new Error(`Loop variable '${name}' is not defined.`);
          }
          
          // IMMUTABLE VALUE SYMBOL REPLACEMENT
          variablesRef.current[sym.name] = {
            ...sym,
            value: sym.type === 'Integer' ? Math.floor(Number(startVal)) : Number(startVal)
          };
          setVariables({ ...variablesRef.current });
          break;
        }

        case 'STEP_FOR': {
          const b = inst.args as ForBlock;
          const name = b.variableName;
          const stepVal = Number(parser.parseAndEvaluate(b.stepValue));

          // CASE INSENSITIVE lookup
          const sym = getVariableSymbol(name, variablesRef.current);
          if (!sym) throw new Error(`Loop variable '${name}' is not defined.`);

          const currentVal = Number(sym.value);
          const increment = b.direction === 'inc' ? stepVal : -stepVal;
          
          // IMMUTABLE VALUE SYMBOL REPLACEMENT
          variablesRef.current[sym.name] = {
            ...sym,
            value: sym.type === 'Integer' ? Math.floor(currentVal + increment) : currentVal + increment
          };
          setVariables({ ...variablesRef.current });
          break;
        }

        case 'CALL_FUNC': {
          const b = inst.args as CallBlock;
          addConsoleMessage('system', `Function call: ${b.functionName}(${b.arguments || ''})`);
          break;
        }
      }
    } catch (e: any) {
      setExecutionStatus('error');
      addConsoleMessage('error', `Error block: ${e.message}`);
      setCurrentBlockId(inst.blockId);
      if (intervalIdRef.current) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return false;
    }

    return true;
  }

  // CONTROLS
  const startRun = () => {
    // CRITICAL REQUIREMENT: Automatically open the Console pane if it's currently hidden when we start running the flowchart!
    if (layout !== 'flow_console' && layout !== 'triple_split') {
      setLayout('triple_split'); // Automatically defaults to triple split (canvas + watch + console) for a perfect UX!
    }

    if (executionStatus === 'idle' || executionStatus === 'stopped' || executionStatus === 'finished' || executionStatus === 'error') {
      instructionsRef.current = compileProgram();
      pcRef.current = 0;
      variablesRef.current = {};
      setVariables({});
      setConsoleMessages([]);
      addConsoleMessage('system', '--- Starting Diagram Execution ---');
    }

    setExecutionStatus('running');

    if (intervalIdRef.current) window.clearInterval(intervalIdRef.current);

    // Speed=100 is maximum speed. We use delay=1ms to yield thread but execute at light-speed.
    const delay = speed === 100 ? 1 : Math.max(15, (101 - speed) * 10);

    intervalIdRef.current = window.setInterval(() => {
      const activeStep = executeStep();
      if (!activeStep && intervalIdRef.current) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }, delay);
  };

  const stepRun = () => {
    // CRITICAL REQUIREMENT: Automatically open the Console pane if it's currently hidden!
    if (layout !== 'flow_console' && layout !== 'triple_split') {
      setLayout('triple_split');
    }

    if (executionStatus === 'idle' || executionStatus === 'stopped' || executionStatus === 'finished' || executionStatus === 'error') {
      instructionsRef.current = compileProgram();
      pcRef.current = 0;
      variablesRef.current = {};
      setVariables({});
      setConsoleMessages([]);
      addConsoleMessage('system', '--- Starting Step-by-Step Execution ---');
      setExecutionStatus('paused');
    }

    if (executionStatus === 'running') {
      pauseRun();
      return;
    }

    executeStep();
  };

  const pauseRun = () => {
    setExecutionStatus('paused');
    if (intervalIdRef.current) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const stopRun = () => {
    setExecutionStatus('stopped');
    setCurrentBlockId(null);
    if (intervalIdRef.current) {
      window.clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    addConsoleMessage('system', '--- Execution Interrupted ---');
  };

  const submitInput = (val: string) => {
    if (executionStatus !== 'input_pause') return;

    const inst = instructionsRef.current[pcRef.current - 1]; // active input block
    const b = inst.args as InputBlock;
    const name = b.variableName.trim();
    let targetName = name;
    let arrayIdx: number | null = null;

    if (name.includes('[') && name.endsWith(']')) {
      const startBracket = name.indexOf('[');
      targetName = name.substring(0, startBracket).trim();
      const indexExpr = name.substring(startBracket + 1, name.length - 1);
      const indexParser = new ExpressionParser(variablesRef.current);
      arrayIdx = Math.floor(Number(indexParser.parseAndEvaluate(indexExpr)));
    }

    // CASE INSENSITIVE lookup
    const sym = getVariableSymbol(targetName, variablesRef.current);
    if (!sym) {
      setExecutionStatus('error');
      addConsoleMessage('error', `Variable '${targetName}' is not defined.`);
      return;
    }

    // CRITICAL FIX: Removed the prefix "> " from logged inputs to match Flowgorithm's clean look!
    addConsoleMessage('input', val);

    try {
      let parsedVal: any;
      if (sym.type === 'Integer') {
        parsedVal = parseInt(val, 10);
        if (isNaN(parsedVal)) throw new Error('Please enter a valid integer.');
      } else if (sym.type === 'Real') {
        parsedVal = parseFloat(val);
        if (isNaN(parsedVal)) throw new Error('Please enter a valid real number.');
      } else if (sym.type === 'Boolean') {
        const lVal = val.trim().toLowerCase();
        if (lVal === 'true' || lVal === '1' || lVal === 'si' || lVal === 'yes') {
          parsedVal = true;
        } else if (lVal === 'false' || lVal === '0' || lVal === 'no') {
          parsedVal = false;
        } else {
          throw new Error("Please enter 'true' or 'false' for boolean type.");
        }
      } else {
        parsedVal = val;
      }

      if (sym.isArray && arrayIdx !== null) {
        if (arrayIdx < 0 || arrayIdx >= (sym.arraySize ?? 0)) {
          throw new Error('Array index out of bounds.');
        }
        
        // IMMUTABLE STATE REPLACEMENT FOR ARRAYS IN INPUT
        const updatedArr = [...sym.value];
        updatedArr[arrayIdx] = parsedVal;
        variablesRef.current[sym.name] = {
          ...sym,
          value: updatedArr
        };
      } else {
        // IMMUTABLE STATE REPLACEMENT FOR SCALARS IN INPUT
        variablesRef.current[sym.name] = {
          ...sym,
          value: parsedVal
        };
      }

      setVariables({ ...variablesRef.current });

      setExecutionStatus('running');
      const delay = speed === 100 ? 1 : Math.max(15, (101 - speed) * 10);

      intervalIdRef.current = window.setInterval(() => {
        const activeStep = executeStep();
        if (!activeStep && intervalIdRef.current) {
          window.clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      }, delay);
    } catch (e: any) {
      addConsoleMessage('error', `Validation error: ${e.message}`);
      addConsoleMessage('system', `Please enter a value for ${name}:`);
    }
  };

  const addConsoleMessage = (type: ConsoleMessage['type'], text: string) => {
    setConsoleMessages((prev) => [
      ...prev,
      { id: generateId(), type, text, timestamp: new Date() }
    ]);
  };

  const clearConsole = () => setConsoleMessages([]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) window.clearInterval(intervalIdRef.current);
    };
  }, []);

  return (
    <FlowContext.Provider
      value={{
        statements,
        programTitle,
        programAuthor,
        setProgramTitle, // EXPLICIT PROVIDER VALUE!
        setProgramAuthor, // EXPLICIT PROVIDER VALUE!
        layout,
        setLayout,
        colorScheme,
        setColorScheme,
        zoom,
        setZoom,
        variables,
        currentBlockId,
        executionStatus,
        consoleMessages,
        speed,
        setSpeed,
        language,
        setLanguage,
        undo,
        redo,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        addBlock,
        deleteBlock,
        updateBlock,
        clearAll,
        clearLocalStorage,
        loadProgram,
        editingBlock,
        openEditor,
        closeEditor,
        saveBlockFields,
        startRun,
        stepRun,
        pauseRun,
        stopRun,
        submitInput,
        clearConsole,
        // BACKWARDS-COMPATIBLE FALLBACKS (Zero-Config compatibility!)
        selectedBlockId,
        setSelectedBlockId,
        copiedBlock,
        setCopiedBlock,
        copyBlock,
        cutBlock,
        pasteBlock,
        // MULTIPLE BLOCKS SELECTION, COPY-PASTE (Version 2.0.13 Premium!)
        selectedBlockIds,
        setSelectedBlockIds,
        copiedBlocks,
        setCopiedBlocks,
        copyBlocks,
        cutBlocks,
        pasteBlocks,
        deleteBlocks
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) throw new Error('useFlow must be used within a FlowProvider');
  return context;
};
