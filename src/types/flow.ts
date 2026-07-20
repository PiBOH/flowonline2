export type Language = 'en' | 'en_GB' | 'de' | 'fr' | 'es' | 'it' | 'zh' | 'nl' | 'pt' | 'gl' | 'ru' | 'uk' | 'cs' | 'pl' | 'hu' | 'sl' | 'ja' | 'th' | 'id' | 'mn' | 'ar' | 'he' | 'fa';

export type VariableType = 'Integer' | 'Real' | 'String' | 'Boolean';

export interface VariableSymbol {
  name: string;
  type: VariableType;
  isArray: boolean;
  arraySize?: number;
  value: any; // primitive value or array of primitives
}

export type BlockType =
  | 'declare'
  | 'assign'
  | 'input'
  | 'output'
  | 'if'
  | 'while'
  | 'for'
  | 'do'
  | 'call'
  | 'comment';

export interface BaseBlock {
  id: string;
  type: BlockType;
  comment?: string;
}

export interface DeclareBlock extends BaseBlock {
  type: 'declare';
  variableName: string;
  variableType: VariableType;
  isArray: boolean;
  arraySize: string; // can be an expression or number
}

export interface AssignBlock extends BaseBlock {
  type: 'assign';
  variableName: string;
  expression: string;
}

export interface InputBlock extends BaseBlock {
  type: 'input';
  variableName: string;
}

export interface OutputBlock extends BaseBlock {
  type: 'output';
  expression: string;
  newline: boolean;
}

export interface IfBlock extends BaseBlock {
  type: 'if';
  condition: string;
  thenBranch: Statement[];
  elseBranch: Statement[];
}

export interface WhileBlock extends BaseBlock {
  type: 'while';
  condition: string;
  body: Statement[];
}

export interface ForBlock extends BaseBlock {
  type: 'for';
  variableName: string;
  startValue: string;
  endValue: string;
  direction: 'inc' | 'dec';
  stepValue: string;
  body: Statement[];
}

export interface DoBlock extends BaseBlock {
  type: 'do';
  condition: string;
  body: Statement[];
}

export interface CallBlock extends BaseBlock {
  type: 'call';
  functionName: string;
  arguments: string;
}

export interface CommentBlock extends BaseBlock {
  type: 'comment';
  text: string;
}

export type Statement =
  | DeclareBlock
  | AssignBlock
  | InputBlock
  | OutputBlock
  | IfBlock
  | WhileBlock
  | ForBlock
  | DoBlock
  | CallBlock
  | CommentBlock;

// Instructions for the Virtual Machine (VM)
export type OpCode =
  | 'HIGHLIGHT'
  | 'DECLARE'
  | 'ASSIGN'
  | 'INPUT_PROMPT'
  | 'OUTPUT'
  | 'JUMP'
  | 'JUMP_IF_FALSE'
  | 'INIT_FOR'
  | 'STEP_FOR'
  | 'CALL_FUNC';

export interface Instruction {
  op: OpCode;
  blockId: string;
  args?: any;
}

export interface ConsoleMessage {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
  timestamp: Date;
}

export interface TranslationCatalog {
  title: string;
  subtitle: string;
  toolbar: {
    run: string;
    step: string;
    pause: string;
    stop: string;
    speed: string;
    import: string;
    export: string;
    exportImage: string;
    exportJson: string;
    undo: string;
    redo: string;
    clear: string;
  };
  sidebar: {
    variables: string;
    codeGen: string;
    noVariables: string;
    varName: string;
    varType: string;
    varVal: string;
    watchTitle: string;
    codeTitle: string;
    closeTooltip: string;
    languageLabel: string;
    activeVariables: string;
    valueLabel: string;
  };
  blocks: {
    main: string;
    end: string;
    declare: string;
    assign: string;
    input: string;
    output: string;
    if: string;
    while: string;
    for: string;
    do: string;
    call: string;
    comment: string;
  };
  modals: {
    title: string;
    cancel: string;
    ok: string;
    declareVar: string;
    type: string;
    isArray: string;
    arraySize: string;
    assignTo: string;
    expression: string;
    inputVar: string;
    outputExpr: string;
    newline: string;
    condition: string;
    forVar: string;
    start: string;
    end: string;
    step: string;
    direction: string;
    ascending: string;
    descending: string;
    callFunc: string;
    arguments: string;
    commentText: string;
    errorTypeMismatch: string;
    errorRequired: string;
    callFuncPlaceholder: string;
    commentPlaceholder: string;
    blockCommentLabel: string;
    blockCommentPlaceholder: string;
    declarePlaceholder: string;
    assignPlaceholder: string;
    inputPlaceholder: string;
    outputPlaceholder: string;
  };
  console: {
    title: string;
    clearBtn: string;
    closeTooltip: string;
    emptyMessage: string;
    inputPlaceholder: string;
    submitBtn: string;
    readyStatus: string;
    logCount: string;
  };
  canvas: {
    selectBlock: string;
    trueBranch: string;
    falseBranch: string;
  };
  errors: {
    executionError: string;
    syntaxError: string;
    varNotDefined: string;
    typeMismatch: string;
    arrayIndexOutOfBounds: string;
    divideByZero: string;
  };
}
