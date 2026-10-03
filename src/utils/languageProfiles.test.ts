import { describe, it, expect } from 'vitest';
import { Statement } from '../types/flow';
import { CodeGenerator } from './codeGenerator';
import { CODE_LANGUAGES, PROFILES } from './languageProfiles';

let counter = 0;
const id = () => `t${++counter}`;

const declare = (name: string, type: 'Integer' | 'Real' | 'String' | 'Boolean' = 'Integer', isArray = false, arraySize = ''): Statement => ({
  id: id(),
  type: 'declare',
  variableName: name,
  variableType: type,
  isArray,
  arraySize
});

const assign = (name: string, expression: string): Statement => ({ id: id(), type: 'assign', variableName: name, expression });
const input = (name: string): Statement => ({ id: id(), type: 'input', variableName: name });
const output = (expression: string, newline = true): Statement => ({ id: id(), type: 'output', expression, newline });
const call = (name: string, args = ''): Statement => ({ id: id(), type: 'call', functionName: name, arguments: args });
const comment = (text: string): Statement => ({ id: id(), type: 'comment', text });
const ifStmt = (condition: string, thenBranch: Statement[], elseBranch: Statement[]): Statement => ({ id: id(), type: 'if', condition, thenBranch, elseBranch });
const whileStmt = (condition: string, body: Statement[]): Statement => ({ id: id(), type: 'while', condition, body });
const forStmt = (v: string, start: string, end: string, body: Statement[], direction: 'inc' | 'dec' = 'inc'): Statement => ({
  id: id(),
  type: 'for',
  variableName: v,
  startValue: start,
  endValue: end,
  direction,
  stepValue: '1',
  body
});
const doStmt = (condition: string, body: Statement[]): Statement => ({ id: id(), type: 'do', condition, body });

/** Exercises every kind of block the editor can produce. */
const program = (): Statement[] => [
  declare('n'),
  declare('arr', 'Integer', true, '5'),
  declare('msg', 'String'),
  comment('demo program'),
  output('"Enter n: "', false),
  input('n'),
  assign('n', 'n * 2 + 1'),
  ifStmt('n > 10 && n < 100', [output('n')], [output('0')]),
  whileStmt('n > 0', [assign('n', 'n - 1')]),
  forStmt('i', '1', '10', [output('i')]),
  forStmt('j', '10', '1', [output('j')], 'dec'),
  doStmt('n > 5', [assign('n', 'n + 1')]),
  call('MyFunc', 'n, arr[0]')
];

describe('multi-language code generator', () => {
  it('exposes every Flowgorithm target', () => {
    const ids = CODE_LANGUAGES.map((l) => l.id);
    // the five historically supported targets + the whole Flowgorithm menu
    for (const legacy of ['python', 'cpp', 'java', 'javascript', 'csharp']) {
      expect(ids).toContain(legacy);
    }
    for (const id of ids) {
      expect(PROFILES[id]).toBeDefined();
    }
    expect(ids.length).toBeGreaterThanOrEqual(33);
    // ids must be unique
    expect(new Set(ids).size).toBe(ids.length);
  });

  // ── Smoke test: every language must produce a full program ────────────────
  for (const lang of CODE_LANGUAGES) {
    it(`generates ${lang.label}`, () => {
      const code = CodeGenerator.generate(program(), lang.id);

      expect(code.length).toBeGreaterThan(20);
      // every target carries the AGPL attribution header
      expect(code).toContain('Flowonline2');
      expect(code).toContain('AGPL-3.0');
      // no unresolved template token or missing mapping leaked into the output
      expect(code).not.toContain('undefined');
      for (const token of ['@name', '@expr', '@cond', '@type', '@init', '@size', '@start', '@end', '@step', '@args', '@text', '@declarations']) {
        expect(code).not.toContain(token);
      }
      // the three declared variables are all mentioned
      expect(code).toContain('n');
      expect(code).toContain('arr');
      expect(code).toContain('msg');
      // the user comment and the function call survived
      expect(code).toContain('demo program');
      expect(code).toContain('MyFunc');
      // output statements are always emitted
      expect(code).toContain('Enter n: ');
    });
  }

  it('falls back gracefully on an unknown target', () => {
    const code = CodeGenerator.generate(program(), 'brainfuck');
    expect(code).toContain('Unsupported target language');
  });

  // ── Language specific behaviours ──────────────────────────────────────────
  describe('Pascal', () => {
    it('hoists every declaration into the var section', () => {
      const code = CodeGenerator.generate(program(), 'pascal');
      const varIndex = code.indexOf('var');
      const beginIndex = code.indexOf('begin');
      expect(varIndex).toBeGreaterThan(-1);
      expect(beginIndex).toBeGreaterThan(varIndex);
      expect(code.slice(varIndex, beginIndex)).toContain('n : Integer;');
      expect(code.slice(varIndex, beginIndex)).toContain('msg : string;');
      // declarations must not be repeated in the body
      expect(code.slice(beginIndex)).not.toContain('n : Integer;');
      expect(code).toContain('writeln(n);');
      expect(code).toContain('for i := 1 to 10 do');
    });
  });

  describe('Transact-SQL', () => {
    it('prefixes variables with @ everywhere, including expressions', () => {
      const code = CodeGenerator.generate(program(), 'tsql');
      expect(code).toContain('DECLARE @n INT');
      expect(code).toContain('SET @n = @n * 2 + 1;');
      expect(code).toContain('WHILE (@n > 0)');
    });
  });

  describe('PHP / Perl / PowerShell', () => {
    it('uses the $ sigil in expressions as well', () => {
      expect(CodeGenerator.generate(program(), 'php')).toContain('$n = $n * 2 + 1;');
      expect(CodeGenerator.generate(program(), 'perl')).toContain('$n = $n * 2 + 1;');
      expect(CodeGenerator.generate(program(), 'powershell')).toContain('$n = $n * 2 + 1');
    });
  });

  describe('bash', () => {
    it('emits a shebang and shell comment syntax', () => {
      const code = CodeGenerator.generate(program(), 'bash');
      expect(code.startsWith('#!/usr/bin/env bash')).toBe(true);
      expect(code).toContain('# demo program');
      expect(code).toContain('read -r n');
    });
  });

  describe('pseudocode targets', () => {
    it('uses the Flowgorithm keyword style', () => {
      expect(CodeGenerator.generate(program(), 'autopseudo')).toContain('Declare n');
      expect(CodeGenerator.generate(program(), 'autopseudo')).toContain('Output "Enter n: "');
      expect(CodeGenerator.generate(program(), 'caddis')).toContain('output');
      expect(CodeGenerator.generate(program(), 'ibo')).toContain('loop while');
    });
  });

  describe('expression conversion', () => {
    it('keeps single = for languages where = is the comparison operator', () => {
      const code = CodeGenerator.generate([ifStmt('n = 3', [output('1')], [])], 'pascal');
      expect(code).toContain('if n = 3 then');
    });

    it('doubles single = for C-like languages', () => {
      const code = CodeGenerator.generate([ifStmt('n = 3', [output('1')], [])], 'typescript');
      expect(code).toContain('if (n == 3)');
    });

    it('translates && and || per language', () => {
      const pascal = CodeGenerator.generate([ifStmt('a && b', [output('1')], [])], 'pascal');
      expect(pascal).toContain('a and b');
      const lua = CodeGenerator.generate([ifStmt('a && b', [output('1')], [])], 'lua');
      expect(lua).toContain('a and b');
      const swift = CodeGenerator.generate([ifStmt('a && b', [output('1')], [])], 'swift');
      expect(swift).toContain('a && b');
    });

    it('maps the math library per language', () => {
      const withSqrt = [assign('n', 'sqrt(9)')];
      expect(CodeGenerator.generate(withSqrt, 'ruby')).toContain('Math.sqrt(9)');
      expect(CodeGenerator.generate(withSqrt, 'lua')).toContain('math.sqrt(9)');
      expect(CodeGenerator.generate(withSqrt, 'pascal')).toContain('Sqrt(9)');
      expect(CodeGenerator.generate(withSqrt, 'tsql')).toContain('SQRT(9)');
    });

    it('does not touch string literals', () => {
      const code = CodeGenerator.generate([output('"arr = n + pi"')], 'php');
      expect(code).toContain('"arr = n + pi"');
    });
  });

  describe('do-while emulation', () => {
    it('uses a native do-while when the language has one', () => {
      const code = CodeGenerator.generate([doStmt('n > 5', [assign('n', 'n + 1')])], 'lua');
      expect(code).toContain('repeat');
      expect(code).toContain('until n > 5');
    });

    it('emulates it with an endless loop elsewhere', () => {
      const code = CodeGenerator.generate([doStmt('n > 5', [assign('n', 'n + 1')])], 'fortran');
      expect(code).toContain('exit');
    });
  });

  it('renders empty branches without panicking', () => {
    const code = CodeGenerator.generate([ifStmt('n > 1', [], [])], 'kotlin');
    expect(code).toContain('if (n > 1)');
    expect(code).not.toContain('undefined');
  });
});
