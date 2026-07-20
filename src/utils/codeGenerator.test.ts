import { describe, it, expect } from 'vitest';
import { CodeGenerator } from './codeGenerator';
import { Statement } from '../types/flow';

// ── helpers ──────────────────────────────────────────────────────
function stmt(overrides: Partial<Statement> & { type: Statement['type'] }): Statement {
  return {
    id: `test_${Math.random().toString(36).slice(2, 7)}`,
    ...overrides,
  } as Statement;
}

describe('CodeGenerator', () => {
  // ── Python ────────────────────────────────────────────────────
  describe('Python', () => {
    it('generates pass for empty program (no wrapper needed)', () => {
      const code = CodeGenerator.generate([], 'python');
      expect(code).toBe('pass\n');
    });

    it('generates main function wrapper for non-empty program', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'comment', text: 'test' }),
      ], 'python');
      expect(code).toContain('def main():');
      expect(code).toContain('if __name__ == "__main__"');
    });

    it('generates license header for non-empty program', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'comment', text: 'test' }),
      ], 'python');
      expect(code).toContain('GNU GPL v3');
    });

    it('generates declare statement', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'declare', variableName: 'x', variableType: 'Integer', isArray: false, arraySize: '' }),
      ], 'python');
      expect(code).toContain('x = 0');
    });

    it('generates declare array', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'declare', variableName: 'arr', variableType: 'Integer', isArray: true, arraySize: '5' }),
      ], 'python');
      expect(code).toContain('arr = [None] * int(5)');
    });

    it('generates assign statement', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'assign', variableName: 'x', expression: '42' }),
      ], 'python');
      expect(code).toContain('x = 42');
    });

    it('generates output statement', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'output', expression: '"Hello"', newline: true }),
      ], 'python');
      expect(code).toContain('print("Hello")');
    });

    it('generates output without newline', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'output', expression: '"X"', newline: false }),
      ], 'python');
      expect(code).toContain(', end=""');
    });

    it('generates input statement', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'input', variableName: 'name' }),
      ], 'python');
      expect(code).toContain('input(');
    });

    it('generates if-else structure', () => {
      const code = CodeGenerator.generate([
        stmt({
          type: 'if', condition: 'x > 0',
          thenBranch: [stmt({ type: 'assign', variableName: 'y', expression: '1' })],
          elseBranch: [stmt({ type: 'assign', variableName: 'y', expression: '-1' })],
        }),
      ], 'python');
      expect(code).toContain('if x > 0:');
      expect(code).toContain('y = 1');
      expect(code).toContain('else:');
      expect(code).toContain('y = -1');
    });

    it('generates while loop', () => {
      const code = CodeGenerator.generate([
        stmt({
          type: 'while', condition: 'x < 10',
          body: [stmt({ type: 'assign', variableName: 'x', expression: 'x + 1' })],
        }),
      ], 'python');
      expect(code).toContain('while x < 10:');
      expect(code).toContain('x + 1');
    });

    it('generates for loop', () => {
      const code = CodeGenerator.generate([
        stmt({
          type: 'for', variableName: 'i', startValue: '1', endValue: '10',
          direction: 'inc', stepValue: '1',
          body: [stmt({ type: 'output', expression: 'i', newline: true })],
        }),
      ], 'python');
      expect(code).toContain('for i in range(1, 10 + 1, 1):');
    });

    it('generates do-while as while True + break', () => {
      const code = CodeGenerator.generate([
        stmt({
          type: 'do', condition: 'x > 0',
          body: [stmt({ type: 'assign', variableName: 'x', expression: 'x - 1' })],
        }),
      ], 'python');
      expect(code).toContain('while True:');
      expect(code).toContain('break');
    });

    it('generates call statement', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'call', functionName: 'myFunc', arguments: 'a, b' }),
      ], 'python');
      expect(code).toContain('myFunc(a, b)');
    });

    it('generates comment block', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'comment', text: 'This is a note' }),
      ], 'python');
      expect(code).toContain('# This is a note');
    });

    it('translates && to "and"', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'if', condition: 'a && b', thenBranch: [], elseBranch: [] }),
      ], 'python');
      expect(code).toContain('if a  and  b:');
    });
  });

  // ── JavaScript ────────────────────────────────────────────────
  describe('JavaScript', () => {
    it('generates function wrapper', () => {
      const code = CodeGenerator.generate([], 'javascript');
      expect(code).toContain('function main()');
      expect(code).toContain('main();');
    });

    it('generates declare with let', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'declare', variableName: 'x', variableType: 'Integer', isArray: false, arraySize: '' }),
      ], 'javascript');
      expect(code).toContain('let x = 0;');
    });

    it('generates output via console.log', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'output', expression: '"Hi"', newline: true }),
      ], 'javascript');
      expect(code).toContain('console.log("Hi");');
    });

    it('generates do-while loop natively', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'do', condition: 'x < 10', body: [] }),
      ], 'javascript');
      expect(code).toContain('do {');
      expect(code).toContain('} while (x < 10);');
    });
  });

  // ── C++ ───────────────────────────────────────────────────────
  describe('C++', () => {
    it('generates includes and main', () => {
      const code = CodeGenerator.generate([], 'cpp');
      expect(code).toContain('#include <iostream>');
      expect(code).toContain('int main()');
      expect(code).toContain('return 0;');
    });

    it('generates vector for array declare', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'declare', variableName: 'arr', variableType: 'Integer', isArray: true, arraySize: '10' }),
      ], 'cpp');
      expect(code).toContain('vector<int> arr(10);');
    });

    it('generates cin for input', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'input', variableName: 'x' }),
      ], 'cpp');
      expect(code).toContain('cin >> x;');
    });

    it('translates pi to M_PI', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'assign', variableName: 'x', expression: '2 * pi' }),
      ], 'cpp');
      expect(code).toContain('M_PI');
    });
  });

  // ── Java ──────────────────────────────────────────────────────
  describe('Java', () => {
    it('generates class Program wrapper', () => {
      const code = CodeGenerator.generate([], 'java');
      expect(code).toContain('public class Program');
      expect(code).toContain('public static void main(String[] args)');
      expect(code).toContain('Scanner');
    });

    it('generates System.out.println for output', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'output', expression: '"Hi"', newline: true }),
      ], 'java');
      expect(code).toContain('System.out.println("Hi");');
    });

    it('generates String type for string variables', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'declare', variableName: 's', variableType: 'String', isArray: false, arraySize: '' }),
      ], 'java');
      expect(code).toContain('String s');
    });
  });

  // ── C# ────────────────────────────────────────────────────────
  describe('C#', () => {
    it('generates class Program wrapper', () => {
      const code = CodeGenerator.generate([], 'csharp');
      expect(code).toContain('public class Program');
      expect(code).toContain('Main(string[] args)');
    });

    it('generates Console.WriteLine for output', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'output', expression: '"Hi"', newline: true }),
      ], 'csharp');
      expect(code).toContain('Console.WriteLine("Hi");');
    });

    it('generates Console.Write for output without newline', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'output', expression: '"X"', newline: false }),
      ], 'csharp');
      expect(code).toContain('Console.Write("X");');
    });

    it('translates abs to Math.Abs', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'assign', variableName: 'x', expression: 'abs(-5)' }),
      ], 'csharp');
      expect(code).toContain('Math.Abs');
    });
  });

  // ── multi-block programs ──────────────────────────────────────
  describe('multi-block', () => {
    it('generates a complete program with multiple blocks', () => {
      const code = CodeGenerator.generate([
        stmt({ type: 'declare', variableName: 'n', variableType: 'Integer', isArray: false, arraySize: '' }),
        stmt({ type: 'output', expression: '"Enter n:"', newline: false }),
        stmt({ type: 'input', variableName: 'n' }),
        stmt({ type: 'output', expression: 'n * 2', newline: true }),
      ], 'python');
      expect(code).toContain('n = 0');
      expect(code).toContain('print("Enter n:"');
      expect(code).toContain('input(');
      expect(code).toContain('print(n * 2');
    });
  });
});
