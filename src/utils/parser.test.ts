import { describe, it, expect } from 'vitest';
import { ExpressionParser } from './parser';
import { VariableSymbol } from '../types/flow';

function makeSym(name: string, overrides: Partial<VariableSymbol> = {}): Record<string, VariableSymbol> {
  return {
    [name]: {
      name,
      type: overrides.type || 'Integer',
      value: overrides.value ?? 0,
      isArray: overrides.isArray ?? false,
      arraySize: overrides.arraySize,
    },
  };
}

describe('ExpressionParser', () => {
  // ── basic arithmetic ──────────────────────────────────────────
  describe('arithmetic', () => {
    const p = new ExpressionParser({});

    it('evaluates integer addition', () => {
      expect(p.parseAndEvaluate('2 + 3')).toBe(5);
    });

    it('evaluates subtraction', () => {
      expect(p.parseAndEvaluate('10 - 4')).toBe(6);
    });

    it('evaluates multiplication', () => {
      expect(p.parseAndEvaluate('6 * 7')).toBe(42);
    });

    it('evaluates division', () => {
      expect(p.parseAndEvaluate('15 / 3')).toBe(5);
    });

    it('evaluates modulo', () => {
      expect(p.parseAndEvaluate('17 % 5')).toBe(2);
    });

    it('evaluates exponentiation', () => {
      expect(p.parseAndEvaluate('2 ^ 10')).toBe(1024);
    });

    it('handles operator precedence (multiply before add)', () => {
      expect(p.parseAndEvaluate('2 + 3 * 4')).toBe(14);
    });

    it('handles parentheses overriding precedence', () => {
      expect(p.parseAndEvaluate('(2 + 3) * 4')).toBe(20);
    });

    it('handles unary minus', () => {
      expect(p.parseAndEvaluate('-5 + 3')).toBe(-2);
    });

    it('handles unary plus', () => {
      expect(p.parseAndEvaluate('+5 + 3')).toBe(8);
    });

    it('throws on division by zero', () => {
      expect(() => p.parseAndEvaluate('5 / 0')).toThrow('Division by zero');
    });

    it('throws on modulo by zero', () => {
      expect(() => p.parseAndEvaluate('5 % 0')).toThrow('Modulo division by zero');
    });
  });

  // ── string operations ─────────────────────────────────────────
  describe('strings', () => {
    const p = new ExpressionParser({});

    it('handles double-quoted strings', () => {
      expect(p.parseAndEvaluate('"hello"')).toBe('hello');
    });

    it('concatenates with & operator', () => {
      expect(p.parseAndEvaluate('"Hello " & "World"')).toBe('Hello World');
    });

    it('adds strings as concatenation', () => {
      expect(p.parseAndEvaluate('"a" + "b"')).toBe('ab');
    });

    it('mixes string and number addition', () => {
      expect(p.parseAndEvaluate('"x" + 1')).toBe('x1');
    });

    it('handles escape sequences in strings', () => {
      expect(p.parseAndEvaluate('"line1\\nline2"')).toBe('line1\nline2');
    });

    it('handles unquoted \\n as newline token', () => {
      // The tokenizer intercepts unquoted \n before it reaches string logic
      expect(p.parseAndEvaluate('"start" & \\n & "end"')).toBe('start\nend');
    });
  });

  // ── booleans and logic ────────────────────────────────────────
  describe('booleans and logic', () => {
    const p = new ExpressionParser({});

    it('evaluates true literal', () => {
      expect(p.parseAndEvaluate('true')).toBe(true);
    });

    it('evaluates false literal', () => {
      expect(p.parseAndEvaluate('false')).toBe(false);
    });

    it('evaluates logical AND (&&)', () => {
      expect(p.parseAndEvaluate('true && false')).toBe(false);
      expect(p.parseAndEvaluate('true && true')).toBe(true);
    });

    it('evaluates logical OR (||)', () => {
      expect(p.parseAndEvaluate('true || false')).toBe(true);
      expect(p.parseAndEvaluate('false || false')).toBe(false);
    });

    it('evaluates logical NOT (!)', () => {
      expect(p.parseAndEvaluate('!true')).toBe(false);
      expect(p.parseAndEvaluate('!false')).toBe(true);
    });

    it('supports "and"/"or"/"not" keywords', () => {
      expect(p.parseAndEvaluate('true and false')).toBe(false);
      expect(p.parseAndEvaluate('true or false')).toBe(true);
      expect(p.parseAndEvaluate('not true')).toBe(false);
    });
  });

  // ── relational operators ──────────────────────────────────────
  describe('relational', () => {
    const p = new ExpressionParser({});

    it('evaluates == equality', () => {
      expect(p.parseAndEvaluate('5 == 5')).toBe(true);
      expect(p.parseAndEvaluate('5 == 6')).toBe(false);
    });

    it('evaluates != inequality', () => {
      expect(p.parseAndEvaluate('5 != 6')).toBe(true);
    });

    it('supports <> as inequality (Flowgorithm compat)', () => {
      expect(p.parseAndEvaluate('5 <> 6')).toBe(true);
      expect(p.parseAndEvaluate('5 <> 5')).toBe(false);
    });

    it('supports single = as equality (Flowgorithm compat)', () => {
      expect(p.parseAndEvaluate('5 = 5')).toBe(true);
      expect(p.parseAndEvaluate('5 = 6')).toBe(false);
    });

    it('evaluates < and >', () => {
      expect(p.parseAndEvaluate('3 < 10')).toBe(true);
      expect(p.parseAndEvaluate('10 > 3')).toBe(true);
    });

    it('evaluates <= and >=', () => {
      expect(p.parseAndEvaluate('5 <= 5')).toBe(true);
      expect(p.parseAndEvaluate('5 >= 5')).toBe(true);
    });

    it('compares strings alphabetically', () => {
      expect(p.parseAndEvaluate('"a" < "b"')).toBe(true);
      expect(p.parseAndEvaluate('"z" > "a"')).toBe(true);
    });
  });

  // ── variables ─────────────────────────────────────────────────
  describe('variables', () => {
    it('resolves a variable from the environment', () => {
      const vars = makeSym('x', { value: 42 });
      const p = new ExpressionParser(vars);
      expect(p.parseAndEvaluate('x')).toBe(42);
    });

    it('resolves variable case-insensitively', () => {
      const vars = makeSym('MyVar', { value: 99, type: 'Integer', isArray: false });
      const p = new ExpressionParser(vars);
      expect(p.parseAndEvaluate('myvar')).toBe(99);
      expect(p.parseAndEvaluate('MYVAR')).toBe(99);
    });

    it('throws on undefined variable', () => {
      const p = new ExpressionParser({});
      expect(() => p.parseAndEvaluate('undefinedVar')).toThrow('not defined');
    });

    it('resolves the built-in PI constant', () => {
      const p = new ExpressionParser({});
      expect(p.parseAndEvaluate('pi')).toBeCloseTo(Math.PI, 5);
    });

    it('evaluates expression with variables', () => {
      const vars = { ...makeSym('a', { value: 10 }), ...makeSym('b', { value: 3 }) };
      const p = new ExpressionParser(vars);
      expect(p.parseAndEvaluate('a + b')).toBe(13);
    });

    it('handles boolean variables', () => {
      const vars = makeSym('flag', { value: true, type: 'Boolean' });
      const p = new ExpressionParser(vars);
      expect(p.parseAndEvaluate('flag')).toBe(true);
    });

    it('handles string variables', () => {
      const vars = makeSym('name', { value: 'Alice', type: 'String' });
      const p = new ExpressionParser(vars);
      expect(p.parseAndEvaluate('name')).toBe('Alice');
    });
  });

  // ── arrays ────────────────────────────────────────────────────
  describe('arrays', () => {
    it('resolves array element by index', () => {
      const vars = makeSym('arr', { type: 'Integer', isArray: true, arraySize: 3, value: [10, 20, 30] });
      const p = new ExpressionParser(vars);
      expect(p.parseAndEvaluate('arr[0]')).toBe(10);
      expect(p.parseAndEvaluate('arr[2]')).toBe(30);
    });

    it('resolves array case-insensitively', () => {
      const vars = makeSym('MyArr', { type: 'Integer', isArray: true, arraySize: 2, value: [5, 15] });
      const p = new ExpressionParser(vars);
      expect(p.parseAndEvaluate('myarr[1]')).toBe(15);
    });

    it('throws on index out of bounds', () => {
      const vars = makeSym('arr', { type: 'Integer', isArray: true, arraySize: 2, value: [1, 2] });
      const p = new ExpressionParser(vars);
      expect(() => p.parseAndEvaluate('arr[5]')).toThrow('out of bounds');
    });

    it('throws when using scalar as array', () => {
      const vars = makeSym('x', { value: 5 });
      const p = new ExpressionParser(vars);
      expect(() => p.parseAndEvaluate('x[0]')).toThrow('not an array');
    });

    it('throws when using array as scalar', () => {
      const vars = makeSym('arr', { type: 'Integer', isArray: true, arraySize: 2, value: [1, 2] });
      const p = new ExpressionParser(vars);
      expect(() => p.parseAndEvaluate('arr')).toThrow('Cannot use array variable');
    });
  });

  // ── built-in functions ────────────────────────────────────────
  describe('built-in functions', () => {
    const p = new ExpressionParser({});

    it('abs() returns absolute value', () => {
      expect(p.parseAndEvaluate('abs(-5)')).toBe(5);
    });

    it('sin() / cos() / tan()', () => {
      expect(p.parseAndEvaluate('sin(0)')).toBe(0);
      expect(p.parseAndEvaluate('cos(0)')).toBeCloseTo(1, 5);
      expect(p.parseAndEvaluate('tan(0)')).toBe(0);
    });

    it('sqrt() returns square root', () => {
      expect(p.parseAndEvaluate('sqrt(16)')).toBe(4);
      expect(() => p.parseAndEvaluate('sqrt(-1)')).toThrow('negative number');
    });

    it('log() / log10() returns base-10 log', () => {
      expect(p.parseAndEvaluate('log(100)')).toBeCloseTo(2, 5);
      expect(p.parseAndEvaluate('log10(100)')).toBeCloseTo(2, 5);
    });

    it('ln() returns natural log', () => {
      expect(p.parseAndEvaluate('ln(1)')).toBe(0);
    });

    it('len() returns string/array length', () => {
      expect(p.parseAndEvaluate('len("hello")')).toBe(5);
    });

    it('size() returns string/array length', () => {
      expect(p.parseAndEvaluate('size("hello")')).toBe(5);
    });

    it('toFixed() rounds to decimal places', () => {
      expect(p.parseAndEvaluate('toFixed(3.14159, 2)')).toBe('3.14');
    });

    it('Int() truncates towards zero', () => {
      expect(p.parseAndEvaluate('Int(3.9)')).toBe(3);
      expect(p.parseAndEvaluate('Int(-3.9)')).toBe(-3);
    });

    it('Sgn() returns sign', () => {
      expect(p.parseAndEvaluate('Sgn(5)')).toBe(1);
      expect(p.parseAndEvaluate('Sgn(0)')).toBe(0);
      expect(p.parseAndEvaluate('Sgn(-3)')).toBe(-1);
    });

    it('Char() extracts character at index', () => {
      expect(p.parseAndEvaluate('Char("hello", 1)')).toBe('e');
    });

    it('ToCode() returns char code', () => {
      expect(p.parseAndEvaluate('ToCode("A")')).toBe(65);
    });

    it('ToChar() returns character from code', () => {
      expect(p.parseAndEvaluate('ToChar(65)')).toBe('A');
    });

    it('ToInteger() converts to integer', () => {
      expect(p.parseAndEvaluate('ToInteger("42")')).toBe(42);
    });

    it('ToReal() converts to real', () => {
      expect(p.parseAndEvaluate('ToReal("3.14")')).toBeCloseTo(3.14, 5);
    });

    it('ToString() converts to string', () => {
      expect(p.parseAndEvaluate('ToString(42)')).toBe('42');
    });

    it('random() returns a number < max', () => {
      const result = p.parseAndEvaluate('random(100)');
      expect(Number.isInteger(result as number)).toBe(true);
      expect((result as number) >= 0 && (result as number) < 100).toBe(true);
    });

    it('throws on unknown function', () => {
      expect(() => p.parseAndEvaluate('unknownFunc(1)')).toThrow('Unknown function');
    });

    it('throws on wrong argument count', () => {
      expect(() => p.parseAndEvaluate('abs(1, 2)')).toThrow('requires exactly 1 argument');
    });
  });

  // ── edge cases ────────────────────────────────────────────────
  describe('edge cases', () => {
    it('handles empty expression', () => {
      const p = new ExpressionParser({});
      expect(p.parseAndEvaluate('')).toBe('');
    });

    it('handles whitespace-only expression', () => {
      const p = new ExpressionParser({});
      expect(p.parseAndEvaluate('   ')).toBe('');
    });

    it('handles deeply nested parentheses', () => {
      const p = new ExpressionParser({});
      expect(p.parseAndEvaluate('(((1 + 2) * 3) + 4)')).toBe(13);
    });

    it('throws on invalid character', () => {
      const p = new ExpressionParser({});
      expect(() => p.parseAndEvaluate('5 @ 3')).toThrow('Unexpected character');
    });
  });
});
