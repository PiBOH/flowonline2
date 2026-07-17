import { Statement, VariableType } from '../types/flow';

// Generate a random ID for nodes
export function generateId(): string {
  return 'block_' + Math.random().toString(36).substr(2, 9);
}

export class FprgParser {
  /**
   * Automatically normalizes ToChar(13) into unquoted \n when loading .fprg files
   */
  private static normalizeToChar(expr: string): string {
    if (!expr) return '';
    // Replaces tochar(13) with unquoted \n for clean unquoted Flowonline2 newline constant!
    return expr.replace(/tochar\(\s*13\s*\)/gi, '\\n');
  }

  /**
   * Automatically converts unquoted \n back to ToChar(13) when saving .fprg files
   */
  private static denormalizeToChar(expr: string): string {
    if (!expr) return '';
    // Replaces unquoted \n with ToChar(13)
    return expr.replace(/\\n/g, 'ToChar(13)');
  }

  /**
   * Parses an FPRG XML string and extracts the Main function's body statements.
   */
  public static parse(xmlString: string): { statements: Statement[]; title: string; author: string } {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Check for XML parsing errors
    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
      throw new Error('Invalid XML file or syntax error.');
    }

    // Extract attributes
    let title = 'Flowonline2 Program';
    let author = 'PiBOH';
    const attributes = xmlDoc.getElementsByTagName('attribute');
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      const name = attr.getAttribute('name');
      const val = attr.getAttribute('value') || '';
      if (name === 'name') title = val;
      if (name === 'authors') author = val;
    }

    // Extract Main function
    const functions = xmlDoc.getElementsByTagName('function');
    let mainFunc: Element | null = null;
    for (let i = 0; i < functions.length; i++) {
      if (functions[i].getAttribute('name') === 'Main') {
        mainFunc = functions[i];
        break;
      }
    }

    if (!mainFunc) {
      throw new Error("No 'Main' function found in the .fprg file.");
    }

    const bodyNode = mainFunc.getElementsByTagName('body')[0];
    if (!bodyNode) {
      return { statements: [], title, author };
    }

    const statements = this.parseStatements(bodyNode);
    return { statements, title, author };
  }

  private static parseStatements(parentEl: Element): Statement[] {
    const list: Statement[] = [];
    const children = parentEl.children;

    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      const type = el.tagName.toLowerCase();

      const stmt = this.elementToStatement(el, type);
      if (stmt) {
        list.push(stmt);
      }
    }

    return list;
  }

  private static elementToStatement(el: Element, type: string): Statement | null {
    const id = generateId();
    const comment = el.getAttribute('comment') || undefined;

    switch (type) {
      case 'declare': {
        const name = el.getAttribute('name') || 'x';
        const rawType = el.getAttribute('type') || 'Integer';
        // Support both boolean and string representations safely
        const arrayAttr = el.getAttribute('array');
        const isArray = arrayAttr === 'True' || arrayAttr === 'true';
        const size = el.getAttribute('size') || '';
        return {
          id,
          type: 'declare',
          variableName: name,
          variableType: rawType as VariableType,
          isArray,
          arraySize: this.normalizeToChar(size),
          comment
        };
      }
      case 'assign': {
        const varName = el.getAttribute('variable') || '';
        const expr = el.getAttribute('expression') || el.getAttribute('value') || '';
        return {
          id,
          type: 'assign',
          variableName: varName,
          expression: this.normalizeToChar(expr),
          comment
        };
      }
      case 'input': {
        const varName = el.getAttribute('variable') || '';
        return {
          id,
          type: 'input',
          variableName: varName,
          comment
        };
      }
      case 'output': {
        const expr = el.getAttribute('expression') || '';
        const newline = el.getAttribute('newline') !== 'False'; // default True
        return {
          id,
          type: 'output',
          expression: this.normalizeToChar(expr),
          newline,
          comment
        };
      }
      case 'if': {
        const cond = el.getAttribute('expression') || 'True';
        
        // ROBUST DIRECT CHILD EXTRACTION: Prevents getElementsByTagName recursion bug that polluted nested conditionals!
        const thenEl = Array.from(el.children).find(child => child.tagName.toLowerCase() === 'then');
        const elseEl = Array.from(el.children).find(child => child.tagName.toLowerCase() === 'else');

        return {
          id,
          type: 'if',
          condition: this.normalizeToChar(cond),
          thenBranch: thenEl ? this.parseStatements(thenEl) : [],
          elseBranch: elseEl ? this.parseStatements(elseEl) : [],
          comment
        };
      }
      case 'while': {
        const cond = el.getAttribute('expression') || 'False';
        return {
          id,
          type: 'while',
          condition: this.normalizeToChar(cond),
          body: this.parseStatements(el),
          comment
        };
      }
      case 'for': {
        const varName = el.getAttribute('variable') || 'i';
        const start = el.getAttribute('start') || '1';
        const end = el.getAttribute('end') || '10';
        const dir = (el.getAttribute('direction') || 'inc') === 'dec' ? 'dec' : 'inc';
        const step = el.getAttribute('step') || '1';
        return {
          id,
          type: 'for',
          variableName: varName,
          startValue: this.normalizeToChar(start),
          endValue: this.normalizeToChar(end),
          direction: dir,
          stepValue: this.normalizeToChar(step),
          body: this.parseStatements(el),
          comment
        };
      }
      case 'do': {
        const cond = el.getAttribute('expression') || 'False';
        return {
          id,
          type: 'do',
          condition: this.normalizeToChar(cond),
          body: this.parseStatements(el),
          comment
        };
      }
      case 'call': {
        const expr = el.getAttribute('expression') || 'function()';
        // split expression into functionName and arguments
        let name = expr;
        let args = '';
        const parenIdx = expr.indexOf('(');
        if (parenIdx !== -1) {
          name = expr.substring(0, parenIdx).trim();
          args = expr.substring(parenIdx + 1, expr.lastIndexOf(')')).trim();
        }
        return {
          id,
          type: 'call',
          functionName: name,
          arguments: this.normalizeToChar(args),
          comment
        };
      }
      case 'comment': {
        const text = el.getAttribute('text') || '';
        return {
          id,
          type: 'comment',
          text,
          comment
        };
      }
      default:
        return null;
    }
  }

  /**
   * Serializes statements back into standard Flowgorithm FPRG XML.
   */
  public static serialize(statements: Statement[], title = 'Flowonline2 Program', author = 'PiBOH'): string {
    let xml = `<?xml version="1.0"?>\n`;
    xml += `<flowgorithm fileversion="4.2">\n`;
    xml += `    <attributes>\n`;
    xml += `        <attribute name="name" value="${this.escapeXml(title)}"/>\n`;
    xml += `        <attribute name="authors" value="${this.escapeXml(author)}"/>\n`;
    xml += `        <attribute name="about" value="Created with Flowonline2 - PiBOH under GNU GPL v3"/>\n`;
    xml += `    </attributes>\n`;
    xml += `    <function name="Main" type="None" variable="">\n`;
    xml += `        <parameters/>\n`;
    xml += `        <body>\n`;

    xml += this.serializeStatements(statements, '            ');

    xml += `        </body>\n`;
    xml += `    </function>\n`;
    xml += `</flowgorithm>\n`;

    return xml;
  }

  private static serializeStatements(statements: Statement[], indent: string): string {
    let result = '';

    for (const stmt of statements) {
      const commentAttr = stmt.comment ? ` comment="${this.escapeXml(stmt.comment)}"` : '';

      switch (stmt.type) {
        case 'declare': {
          // CRITICAL BUG FIX (Issue #1): Ensure strict boolean type-checking to prevent regular variables from becoming arrays!
          const isArr = stmt.isArray === true || String(stmt.isArray).toLowerCase() === 'true';
          const sizeAttr = isArr ? this.escapeXml(this.denormalizeToChar(stmt.arraySize)) : '';
          result += `${indent}<declare name="${this.escapeXml(stmt.variableName)}" type="${stmt.variableType}" array="${isArr ? 'True' : 'False'}" size="${sizeAttr}"${commentAttr}/>\n`;
          break;
        }
        case 'assign':
          result += `${indent}<assign variable="${this.escapeXml(stmt.variableName)}" expression="${this.escapeXml(this.denormalizeToChar(stmt.expression))}"${commentAttr}/>\n`;
          break;
        case 'input':
          result += `${indent}<input variable="${this.escapeXml(stmt.variableName)}"${commentAttr}/>\n`;
          break;
        case 'output':
          result += `${indent}<output expression="${this.escapeXml(this.denormalizeToChar(stmt.expression))}" newline="${stmt.newline ? 'True' : 'False'}"${commentAttr}/>\n`;
          break;
        case 'if':
          result += `${indent}<if expression="${this.escapeXml(this.denormalizeToChar(stmt.condition))}"${commentAttr}>\n`;
          result += `${indent}    <then>\n`;
          result += this.serializeStatements(stmt.thenBranch, indent + '        ');
          result += `${indent}    </then>\n`;
          result += `${indent}    <else>\n`;
          result += this.serializeStatements(stmt.elseBranch, indent + '        ');
          result += `${indent}    </else>\n`;
          result += `${indent}</if>\n`;
          break;
        case 'while':
          result += `${indent}<while expression="${this.escapeXml(this.denormalizeToChar(stmt.condition))}"${commentAttr}>\n`;
          result += this.serializeStatements(stmt.body, indent + '    ');
          result += `${indent}</while>\n`;
          break;
        case 'for':
          result += `${indent}<for variable="${this.escapeXml(stmt.variableName)}" start="${this.escapeXml(this.denormalizeToChar(stmt.startValue))}" end="${this.escapeXml(this.denormalizeToChar(stmt.endValue))}" direction="${stmt.direction}" step="${this.escapeXml(this.denormalizeToChar(stmt.stepValue))}"${commentAttr}>\n`;
          result += this.serializeStatements(stmt.body, indent + '    ');
          result += `${indent}</for>\n`;
          break;
        case 'do':
          result += `${indent}<do expression="${this.escapeXml(this.denormalizeToChar(stmt.condition))}"${commentAttr}>\n`;
          result += this.serializeStatements(stmt.body, indent + '    ');
          result += `${indent}</do>\n`;
          break;
        case 'call': {
          const argStr = stmt.arguments ? `(${stmt.arguments})` : '()';
          const combined = this.denormalizeToChar(stmt.functionName + argStr);
          result += `${indent}<call expression="${this.escapeXml(combined)}"${commentAttr}/>\n`;
          break;
        }
        case 'comment':
          result += `${indent}<comment text="${this.escapeXml(stmt.text)}"/>\n`;
          break;
      }
    }

    return result;
  }

  private static escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
