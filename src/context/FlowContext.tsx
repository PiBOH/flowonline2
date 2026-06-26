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

interface FlowContextType {
  // Flowchart state
  statements: Statement[];
  programTitle: string;
  programAuthor: string;
  setProgramTitle: (t: string) => void;
  setProgramAuthor: (a: string) => void;
  
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
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

// INITIAL DEFAULT SAMPLE PROGRAM
const initialSample: Statement[] = [
  {
    id: 'block_decl_name',
    type: 'declare',
    variableName: 'username',
    variableType: 'String',
    isArray: false,
    arraySize: ''
  },
  {
    id: 'block_out_greet',
    type: 'output',
    expression: '"Benvenuto su Flowonline2! Inserisci il tuo nome:"',
    newline: true
  },
  {
    id: 'block_inp_name',
    type: 'input',
    variableName: 'username'
  },
  {
    id: 'block_decl_age',
    type: 'declare',
    variableName: 'eta',
    variableType: 'Integer',
    isArray: false,
    arraySize: ''
  },
  {
    id: 'block_out_prompt_age',
    type: 'output',
    expression: '"Ciao " & username & "! Quanti anni hai?"',
    newline: true
  },
  {
    id: 'block_inp_age',
    type: 'input',
    variableName: 'eta'
  },
  {
    id: 'block_if_age',
    type: 'if',
    condition: 'eta >= 18',
    thenBranch: [
      {
        id: 'block_out_adult',
        type: 'output',
        expression: 'username & ", sei maggiorenne!"',
        newline: true
      }
    ],
    elseBranch: [
      {
        id: 'block_out_minor',
        type: 'output',
        expression: 'username & ", sei minorenne. Ti mancano " & (18 - eta) & " anni alla maggiore età!"',
        newline: true
      }
    ]
  }
];

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master diagram states
  const [statements, setStatements] = useState<Statement[]>(initialSample);
  const [programTitle, setProgramTitleState] = useState('Flowonline2 Program');
  const [programAuthor, setProgramAuthorState] = useState('PiBOH');

  // History for undo/redo
  const [undoStack, setUndoStack] = useState<Array<{ statements: Statement[]; title: string; author: string }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ statements: Statement[]; title: string; author: string }>>([]);

  // Language translation selector
  const [language, setLanguage] = useState<Language>('it');

  // VM Execution state
  const [variables, setVariables] = useState<Record<string, VariableSymbol>>({});
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] = useState<FlowContextType['executionStatus']>('idle');
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [speed, setSpeed] = useState<number>(75); // speed slider (1 to 100)

  // Editor states
  const [editingBlock, setEditingBlock] = useState<Statement | null>(null);

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
    stopRun();
  };

  // LOAD PROGRAM
  const loadProgram = (newStatements: Statement[], title: string, author: string) => {
    pushHistory(newStatements, title, author);
    stopRun();
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
        newBlock = { id: randomId, type: 'comment', text: 'Scrivi commento qui' };
        break;
    }

    const copy = JSON.parse(JSON.stringify(statements)) as Statement[];

    if (targetId === 'main_start') {
      copy.unshift(newBlock);
    } else if (targetId === 'main_end') {
      copy.push(newBlock);
    } else {
      const inserted = recursiveInsert(copy, targetId, newBlock);
      if (!inserted) {
        console.warn(`Could not find target ID ${targetId} to insert after.`);
      }
    }

    pushHistory(copy);
    stopRun();

    // Auto-open editing modal for the newly added block for extremely high developer-UX!
    setEditingBlock(newBlock);
  };

  const deleteBlock = (id: string) => {
    const copy = JSON.parse(JSON.stringify(statements)) as Statement[];
    const deleted = recursiveDelete(copy, id);
    if (deleted) {
      pushHistory(copy);
      stopRun();
    }
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
  const recursiveInsert = (list: Statement[], targetId: string, newBlock: Statement): boolean => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.id === targetId) {
        // Insert after this node
        list.splice(i + 1, 0, newBlock);
        return true;
      }

      // Check nested branches
      if (item.type === 'if') {
        if (recursiveInsert(item.thenBranch, targetId, newBlock)) return true;
        if (recursiveInsert(item.elseBranch, targetId, newBlock)) return true;
      } else if (item.type === 'while' || item.type === 'do' || item.type === 'for') {
        if (recursiveInsert(item.body, targetId, newBlock)) return true;
      }
    }
    return false;
  };

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
      addConsoleMessage('system', '--- Programma Terminato con Successo ---');
      return false; // stop VM
    }

    const inst = insts[pc];
    setCurrentBlockId(inst.blockId);
    pcRef.current = pc + 1;

    try {
      const parser = new ExpressionParser(variablesRef.current);

      switch (inst.op) {
        case 'HIGHLIGHT':
          // Visual step only. No logical execution.
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

          // Handle array index assignments e.g. myArray[index] = x
          if (name.includes('[') && name.endsWith(']')) {
            const startBracket = name.indexOf('[');
            const arrName = name.substring(0, startBracket).trim();
            const indexExpr = name.substring(startBracket + 1, name.length - 1);
            
            const indexParser = new ExpressionParser(variablesRef.current);
            const indexVal = Math.floor(Number(indexParser.parseAndEvaluate(indexExpr)));

            const sym = variablesRef.current[arrName];
            if (!sym) {
              throw new Error(`Array '${arrName}' non definito.`);
            }
            if (!sym.isArray) {
              throw new Error(`La variabile '${arrName}' non è un vettore.`);
            }
            if (indexVal < 0 || indexVal >= (sym.arraySize ?? 0)) {
              throw new Error(`Indice ${indexVal} fuori dai limites per il vettore '${arrName}' (dimensione: ${sym.arraySize}).`);
            }

            // Type verification
            let validatedVal = rValue;
            if (sym.type === 'Integer') validatedVal = Math.floor(Number(rValue));
            if (sym.type === 'Real') validatedVal = Number(rValue);
            if (sym.type === 'Boolean') validatedVal = Boolean(rValue);
            if (sym.type === 'String') validatedVal = String(rValue);

            sym.value[indexVal] = validatedVal;
          } else {
            // Standard scalar assignment
            const sym = variablesRef.current[name];
            if (!sym) {
              throw new Error(`Variabile '${name}' non dichiarata.`);
            }

            let validatedVal = rValue;
            if (sym.type === 'Integer') validatedVal = Math.floor(Number(rValue));
            if (sym.type === 'Real') validatedVal = Number(rValue);
            if (sym.type === 'Boolean') validatedVal = Boolean(rValue);
            if (sym.type === 'String') validatedVal = String(rValue);

            sym.value = validatedVal;
          }

          setVariables({ ...variablesRef.current });
          break;
        }

        case 'INPUT_PROMPT': {
          const b = inst.args as InputBlock;
          const name = b.variableName.trim();
          let targetName = name;

          // Check if index input e.g. myArray[i]
          if (name.includes('[') && name.endsWith(']')) {
            const startBracket = name.indexOf('[');
            targetName = name.substring(0, startBracket).trim();
          }

          const sym = variablesRef.current[targetName];
          if (!sym) {
            throw new Error(`Variabile di input '${targetName}' non dichiarata.`);
          }

          // Pause VM for input
          setExecutionStatus('input_pause');
          addConsoleMessage('system', `Inserisci valore per ${name}:`);
          
          if (intervalIdRef.current) {
            window.clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          return false; // pause execution loop
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
            const sym = variablesRef.current[b.variableName];
            if (!sym) throw new Error(`Variabile ciclo '${b.variableName}' non trovata.`);

            const currentIdxVal = Number(sym.value);
            const endVal = Number(parser.parseAndEvaluate(b.endValue));

            const isContinuing = b.direction === 'inc' 
              ? currentIdxVal <= endVal 
              : currentIdxVal >= endVal;

            if (!isContinuing) {
              pcRef.current = inst.args.targetIdx;
            }
          } else {
            // Standard boolean expression
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

          const sym = variablesRef.current[name];
          if (!sym) {
            throw new Error(`Variabile ciclo '${name}' non dichiarata.`);
          }
          
          sym.value = sym.type === 'Integer' ? Math.floor(Number(startVal)) : Number(startVal);
          setVariables({ ...variablesRef.current });
          break;
        }

        case 'STEP_FOR': {
          const b = inst.args as ForBlock;
          const name = b.variableName;
          const stepVal = Number(parser.parseAndEvaluate(b.stepValue));

          const sym = variablesRef.current[name];
          if (!sym) throw new Error(`Variabile ciclo '${name}' non dichiarata.`);

          const currentVal = Number(sym.value);
          const increment = b.direction === 'inc' ? stepVal : -stepVal;
          sym.value = sym.type === 'Integer' ? Math.floor(currentVal + increment) : currentVal + increment;

          setVariables({ ...variablesRef.current });
          break;
        }

        case 'CALL_FUNC': {
          const b = inst.args as CallBlock;
          addConsoleMessage('system', `Chiamata a funzione: ${b.functionName}(${b.arguments || ''})`);
          break;
        }
      }
    } catch (e: any) {
      setExecutionStatus('error');
      addConsoleMessage('error', `Errore blocco: ${e.message}`);
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
    if (executionStatus === 'idle' || executionStatus === 'stopped' || executionStatus === 'finished' || executionStatus === 'error') {
      // compile and start at PC = 0
      instructionsRef.current = compileProgram();
      pcRef.current = 0;
      variablesRef.current = {};
      setVariables({});
      setConsoleMessages([]);
      addConsoleMessage('system', '--- Avvio Esecuzione Diagramma ---');
    }

    setExecutionStatus('running');

    if (intervalIdRef.current) window.clearInterval(intervalIdRef.current);

    // Calculate delay from speed slider
    // speed=100 is instant, speed=1 is very slow
    const delay = speed === 100 ? 0 : Math.max(10, (101 - speed) * 8);

    const runLoop = () => {
      let active = true;
      if (speed === 100) {
        // Run blocks instantly
        while (active) {
          active = executeStep();
        }
      } else {
        // Stepwise running using interval
        intervalIdRef.current = window.setInterval(() => {
          const activeStep = executeStep();
          if (!activeStep && intervalIdRef.current) {
            window.clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
        }, delay);
      }
    };

    runLoop();
  };

  const stepRun = () => {
    if (executionStatus === 'idle' || executionStatus === 'stopped' || executionStatus === 'finished' || executionStatus === 'error') {
      instructionsRef.current = compileProgram();
      pcRef.current = 0;
      variablesRef.current = {};
      setVariables({});
      setConsoleMessages([]);
      addConsoleMessage('system', '--- Avvio Esecuzione Passo-Passo ---');
      setExecutionStatus('paused');
    }

    if (executionStatus === 'running') {
      pauseRun();
      return;
    }

    // execute a single step
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
    addConsoleMessage('system', '--- Esecuzione Interrotta ---');
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

    const sym = variablesRef.current[targetName];
    if (!sym) {
      setExecutionStatus('error');
      addConsoleMessage('error', `Variabile '${targetName}' non definita.`);
      return;
    }

    addConsoleMessage('input', `> ${val}`);

    // Parse and validate types
    try {
      let parsedVal: any;
      if (sym.type === 'Integer') {
        parsedVal = parseInt(val, 10);
        if (isNaN(parsedVal)) throw new Error('Inserire un numero intero valido.');
      } else if (sym.type === 'Real') {
        parsedVal = parseFloat(val);
        if (isNaN(parsedVal)) throw new Error('Inserire un numero reale valido.');
      } else if (sym.type === 'Boolean') {
        const lVal = val.trim().toLowerCase();
        if (lVal === 'true' || lVal === '1' || lVal === 'si' || lVal === 'yes') {
          parsedVal = true;
        } else if (lVal === 'false' || lVal === '0' || lVal === 'no') {
          parsedVal = false;
        } else {
          throw new Error("Inserire 'true' o 'false' per il tipo booleano.");
        }
      } else {
        parsedVal = val; // String is always valid
      }

      if (sym.isArray && arrayIdx !== null) {
        if (arrayIdx < 0 || arrayIdx >= (sym.arraySize ?? 0)) {
          throw new Error('Indice dell\'array fuori dai limiti.');
        }
        sym.value[arrayIdx] = parsedVal;
      } else {
        sym.value = parsedVal;
      }

      setVariables({ ...variablesRef.current });

      // Resume execution
      setExecutionStatus('running');
      const delay = speed === 100 ? 0 : Math.max(10, (101 - speed) * 8);

      if (speed === 100) {
        let active = true;
        while (active) {
          active = executeStep();
        }
      } else {
        intervalIdRef.current = window.setInterval(() => {
          const activeStep = executeStep();
          if (!activeStep && intervalIdRef.current) {
            window.clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
        }, delay);
      }
    } catch (e: any) {
      addConsoleMessage('error', `Errore di validazione: ${e.message}`);
      addConsoleMessage('system', `Inserisci valore per ${name}:`);
    }
  };

  const addConsoleMessage = (type: ConsoleMessage['type'], text: string) => {
    setConsoleMessages((prev) => [
      ...prev,
      { id: generateId(), type, text, timestamp: new Date() }
    ]);
  };

  const clearConsole = () => setConsoleMessages([]);

  // Auto clean intervals on dismount
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
        setProgramTitle,
        setProgramAuthor,
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
        clearConsole
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
