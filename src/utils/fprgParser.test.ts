import { describe, it, expect } from 'vitest';
import { FprgParser, generateId } from './fprgParser';
import { Statement } from '../types/flow';

// ── helpers ──────────────────────────────────────────────────────
const MINIMAL_XML = `<?xml version="1.0"?>
<flowgorithm fileversion="4.2">
    <attributes>
        <attribute name="name" value="Test Program"/>
        <attribute name="authors" value="Tester"/>
    </attributes>
    <function name="Main" type="None" variable="">
        <parameters/>
        <body>
        </body>
    </function>
</flowgorithm>`;

describe('FprgParser', () => {
  // ── generateId ────────────────────────────────────────────────
  describe('generateId', () => {
    it('returns a string starting with block_', () => {
      const id = generateId();
      expect(id.startsWith('block_')).toBe(true);
    });

    it('generates unique IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBe(100);
    });
  });

  // ── parsing ───────────────────────────────────────────────────
  describe('parse', () => {
    it('extracts title and author', () => {
      const result = FprgParser.parse(MINIMAL_XML);
      expect(result.title).toBe('Test Program');
      expect(result.author).toBe('Tester');
    });

    it('returns empty statements for empty body', () => {
      const result = FprgParser.parse(MINIMAL_XML);
      expect(result.statements).toEqual([]);
    });

    it('parses declare statement', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><declare name="x" type="Integer" array="False" size=""/>'
      );
      const result = FprgParser.parse(xml);
      expect(result.statements).toHaveLength(1);
      expect(result.statements[0].type).toBe('declare');
      const d = result.statements[0] as Statement & { variableName: string; variableType: string };
      expect(d.variableName).toBe('x');
      expect(d.variableType).toBe('Integer');
    });

    it('parses assign statement with expression attribute', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><assign variable="x" expression="42"/>'
      );
      const result = FprgParser.parse(xml);
      expect(result.statements[0].type).toBe('assign');
      const a = result.statements[0] as Statement & { expression: string };
      expect(a.expression).toBe('42');
    });

    it('parses assign statement with value attribute (fallback)', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><assign variable="x" value="99"/>'
      );
      const result = FprgParser.parse(xml);
      const a = result.statements[0] as Statement & { expression: string };
      expect(a.expression).toBe('99');
    });

    it('parses input statement', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><input variable="name"/>'
      );
      const result = FprgParser.parse(xml);
      expect(result.statements[0].type).toBe('input');
    });

    it('parses output statement', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><output expression="&quot;Hello&quot;" newline="True"/>'
      );
      const result = FprgParser.parse(xml);
      expect(result.statements[0].type).toBe('output');
      const o = result.statements[0] as Statement & { newline: boolean };
      expect(o.newline).toBe(true);
    });

    it('parses if-else with then and else branches', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><if expression="x > 0"><then><assign variable="sign" expression="1"/></then><else><assign variable="sign" expression="-1"/></else></if>'
      );
      const result = FprgParser.parse(xml);
      const ifStmt = result.statements[0] as Statement & { type: 'if'; thenBranch: Statement[]; elseBranch: Statement[] };
      expect(ifStmt.type).toBe('if');
      expect(ifStmt.thenBranch).toHaveLength(1);
      expect(ifStmt.elseBranch).toHaveLength(1);
      expect(ifStmt.thenBranch[0].type).toBe('assign');
      expect(ifStmt.elseBranch[0].type).toBe('assign');
    });

    it('parses while loop', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><while expression="x &lt; 10"><assign variable="x" expression="x + 1"/></while>'
      );
      const result = FprgParser.parse(xml);
      expect(result.statements[0].type).toBe('while');
      const w = result.statements[0] as Statement & { type: 'while'; body: Statement[] };
      expect(w.body).toHaveLength(1);
    });

    it('parses for loop', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><for variable="i" start="1" end="10" direction="inc" step="1"><assign variable="sum" expression="sum + i"/></for>'
      );
      const result = FprgParser.parse(xml);
      expect(result.statements[0].type).toBe('for');
      const f = result.statements[0] as Statement & { type: 'for'; body: Statement[]; variableName: string };
      expect(f.variableName).toBe('i');
      expect(f.body).toHaveLength(1);
    });

    it('parses do loop', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><do expression="x > 0"><assign variable="x" expression="x - 1"/></do>'
      );
      const result = FprgParser.parse(xml);
      expect(result.statements[0].type).toBe('do');
    });

    it('parses call statement', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><call expression="myFunc(a, b)"/>'
      );
      const result = FprgParser.parse(xml);
      const c = result.statements[0] as Statement & { type: 'call'; functionName: string; arguments: string };
      expect(c.type).toBe('call');
      expect(c.functionName).toBe('myFunc');
      expect(c.arguments).toBe('a, b');
    });

    it('parses comment block', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><comment text="This is a note"/>'
      );
      const result = FprgParser.parse(xml);
      expect(result.statements[0].type).toBe('comment');
      const c = result.statements[0] as Statement & { type: 'comment'; text: string };
      expect(c.text).toBe('This is a note');
    });

    it('parses nested if inside if (direct child isolation)', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><if expression="a > 0"><then><if expression="b > 0"><then><assign variable="x" expression="1"/></then><else/></if></then><else/></if>'
      );
      const result = FprgParser.parse(xml);
      const outerIf = result.statements[0] as Statement & { type: 'if'; thenBranch: Statement[] };
      expect(outerIf.type).toBe('if');
      expect(outerIf.thenBranch).toHaveLength(1); // only the inner if, not stolen else
      expect(outerIf.thenBranch[0].type).toBe('if');
    });

    it('normalizes ToChar(13) to unquoted \\n', () => {
      const xml = MINIMAL_XML.replace(
        '<body>',
        '<body><output expression="&quot;line1&quot; &amp; ToChar(13) &amp; &quot;line2&quot;"/>'
      );
      const result = FprgParser.parse(xml);
      const o = result.statements[0] as Statement & { type: 'output'; expression: string };
      expect(o.expression).toContain('\\n');
      expect(o.expression).not.toContain('ToChar');
    });

    it('throws on invalid XML', () => {
      expect(() => FprgParser.parse('not xml at all')).toThrow();
    });

    it('throws when no Main function found', () => {
      const noMain = `<flowgorithm><function name="NotMain"/></flowgorithm>`;
      expect(() => FprgParser.parse(noMain)).toThrow('Main');
    });
  });

  // ── serialization ─────────────────────────────────────────────
  describe('serialize', () => {
    it('generates valid XML with header', () => {
      const xml = FprgParser.serialize([], 'My Program', 'Me');
      expect(xml).toContain('<?xml version="1.0"?>');
      expect(xml).toContain('<flowgorithm fileversion="4.2">');
      expect(xml).toContain('value="My Program"');
      expect(xml).toContain('value="Me"');
    });

    it('serializes a declare block', () => {
      const xml = FprgParser.serialize([
        { id: 'test1', type: 'declare', variableName: 'x', variableType: 'Integer', isArray: false, arraySize: '' } as Statement,
      ]);
      expect(xml).toContain('<declare');
      expect(xml).toContain('name="x"');
      expect(xml).toContain('array="False"');
    });

    it('serializes an array declare block', () => {
      const xml = FprgParser.serialize([
        { id: 'test1', type: 'declare', variableName: 'arr', variableType: 'Integer', isArray: true, arraySize: '10' } as Statement,
      ]);
      expect(xml).toContain('array="True"');
      expect(xml).toContain('size="10"');
    });

    it('serializes an assign block', () => {
      const xml = FprgParser.serialize([
        { id: 'test1', type: 'assign', variableName: 'x', expression: '42' } as Statement,
      ]);
      expect(xml).toContain('expression="42"');
    });

    it('serializes an if-else block', () => {
      const xml = FprgParser.serialize([
        {
          id: 'test1', type: 'if', condition: 'x > 0',
          thenBranch: [{ id: 't1', type: 'assign', variableName: 'y', expression: '1' } as Statement],
          elseBranch: [{ id: 'e1', type: 'assign', variableName: 'y', expression: '-1' } as Statement],
        } as Statement,
      ]);
      expect(xml).toContain('<then>');
      expect(xml).toContain('<else>');
      expect(xml).toContain('</if>');
    });

    it('serializes for loop', () => {
      const xml = FprgParser.serialize([
        {
          id: 'test1', type: 'for', variableName: 'i',
          startValue: '1', endValue: '10', direction: 'inc', stepValue: '1',
          body: [],
        } as Statement,
      ]);
      expect(xml).toContain('variable="i"');
      expect(xml).toContain('direction="inc"');
    });

    it('denormalizes \\n back to ToChar(13)', () => {
      const xml = FprgParser.serialize([
        { id: 'test1', type: 'output', expression: '"line1" & \\n & "line2"', newline: true } as Statement,
      ]);
      expect(xml).toContain('ToChar(13)');
      expect(xml).not.toContain('\\n');
    });

    it('escapes XML special characters in expressions', () => {
      const xml = FprgParser.serialize([
        { id: 'test1', type: 'output', expression: 'x < 10 && y > 5', newline: true } as Statement,
      ]);
      expect(xml).toContain('&lt;');
      expect(xml).toContain('&gt;');
    });
  });

  // ── round-trip ────────────────────────────────────────────────
  describe('round-trip', () => {
    it('parse → serialize → parse produces identical statements', () => {
      const original: Statement[] = [
        { id: 'test1', type: 'declare', variableName: 'n', variableType: 'Integer', isArray: false, arraySize: '' } as Statement,
        { id: 'test2', type: 'assign', variableName: 'n', expression: '42' } as Statement,
        { id: 'test3', type: 'output', expression: 'n', newline: true } as Statement,
      ];

      const xml = FprgParser.serialize(original, 'RoundTrip', 'Test');
      const reparsed = FprgParser.parse(xml);

      expect(reparsed.title).toBe('RoundTrip');
      expect(reparsed.author).toBe('Test');
      expect(reparsed.statements).toHaveLength(3);
      expect(reparsed.statements[0].type).toBe('declare');
      expect(reparsed.statements[1].type).toBe('assign');
      expect(reparsed.statements[2].type).toBe('output');
    });
  });
});
