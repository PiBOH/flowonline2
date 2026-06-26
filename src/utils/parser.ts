import { VariableSymbol } from '../types/flow';

interface Token {
  type: 'NUMBER' | 'STRING' | 'BOOLEAN' | 'IDENTIFIER' | 'OPERATOR' | 'LPAREN' | 'RPAREN' | 'LBRACKET' | 'RBRACKET' | 'COMMA' | 'EOF';
  value: string;
}

export class ExpressionParser {
  private tokens: Token[] = [];
  private pos = 0;

  constructor(private variables: Record<string, VariableSymbol>) {}

  private tokenize(expr: string) {
    this.tokens = [];
    this.pos = 0;
    let i = 0;
    const len = expr.length;

    while (i < len) {
      const char = expr[i];

      // Whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Numbers
      if (/\d/.test(char) || (char === '.' && i + 1 < len && /\d/.test(expr[i + 1]))) {
        let numStr = '';
        let hasDot = false;
        while (i < len && (/\d/.test(expr[i]) || (expr[i] === '.' && !hasDot))) {
          if (expr[i] === '.') hasDot = true;
          numStr += expr[i];
          i++;
        }
        this.tokens.push({ type: 'NUMBER', value: numStr });
        continue;
      }

      // Match unquoted \n as a special newline string token for Flowonline2!
      // This allows writing: text & \n & "more text" without putting \n inside quotes!
      if (char === '\\' && expr[i + 1] === 'n') {
        this.tokens.push({ type: 'STRING', value: '\n' });
        i += 2;
        continue;
      }

      // Strings (double quotes with robust escape decoder!)
      if (char === '"') {
        let strVal = '';
        i++; // skip open quote
        while (i < len && expr[i] !== '"') {
          if (expr[i] === '\\') {
            i++;
            if (i < len) {
              const nextChar = expr[i];
              if (nextChar === 'n') strVal += '\n';
              else if (nextChar === 'r') strVal += '\r';
              else if (nextChar === 't') strVal += '\t';
              else strVal += nextChar;
            }
          } else {
            strVal += expr[i];
          }
          i++;
        }
        i++; // skip close quote
        this.tokens.push({ type: 'STRING', value: strVal });
        continue;
      }

      // Parentheses & Brackets
      if (char === '(') {
        this.tokens.push({ type: 'LPAREN', value: '(' });
        i++;
        continue;
      }
      if (char === ')') {
        this.tokens.push({ type: 'RPAREN', value: ')' });
        i++;
        continue;
      }
      if (char === '[') {
        this.tokens.push({ type: 'LBRACKET', value: '[' });
        i++;
        continue;
      }
      if (char === ']') {
        this.tokens.push({ type: 'RBRACKET', value: ']' });
        i++;
        continue;
      }
      if (char === ',') {
        this.tokens.push({ type: 'COMMA', value: ',' });
        i++;
        continue;
      }

      // Multi-character operators
      if (expr.substring(i, i + 2) === '==') {
        this.tokens.push({ type: 'OPERATOR', value: '==' });
        i += 2;
        continue;
      }
      if (expr.substring(i, i + 2) === '!=') {
        this.tokens.push({ type: 'OPERATOR', value: '!=' });
        i += 2;
        continue;
      }
      // CRITICAL COMPATIBILITY FIX: Support Flowgorithm's inequality operator '<>' as alternative to '!='
      if (expr.substring(i, i + 2) === '<>') {
        this.tokens.push({ type: 'OPERATOR', value: '!=' });
        i += 2;
        continue;
      }
      if (expr.substring(i, i + 2) === '<=') {
        this.tokens.push({ type: 'OPERATOR', value: '<=' });
        i += 2;
        continue;
      }
      if (expr.substring(i, i + 2) === '>=') {
        this.tokens.push({ type: 'OPERATOR', value: '>=' });
        i += 2;
        continue;
      }
      if (expr.substring(i, i + 2) === '&&') {
        this.tokens.push({ type: 'OPERATOR', value: '&&' });
        i += 2;
        continue;
      }
      if (expr.substring(i, i + 2) === '||') {
        this.tokens.push({ type: 'OPERATOR', value: '||' });
        i += 2;
        continue;
      }

      // Single-character operator '=': Treat as '==' comparison for Flowgorithm compatibility
      if (char === '=') {
        this.tokens.push({ type: 'OPERATOR', value: '==' });
        i++;
        continue;
      }

      // Other single-character operators
      if ('+-*/%^<>&!'.includes(char)) {
        this.tokens.push({ type: 'OPERATOR', value: char });
        i++;
        continue;
      }

      // Identifiers & Keywords (AND, OR, NOT, TRUE, FALSE, functions, variables)
      if (/[a-zA-Z_]/.test(char) || char.charCodeAt(0) > 127) {
        let ident = char;
        i++;
        while (i < len && (/[a-zA-Z0-9_]/.test(expr[i]) || expr[i].charCodeAt(0) > 127)) {
          ident += expr[i];
          i++;
        }

        const lowerIdent = ident.toLowerCase();
        if (lowerIdent === 'true' || lowerIdent === 'false') {
          this.tokens.push({ type: 'BOOLEAN', value: lowerIdent });
        } else if (lowerIdent === 'and') {
          this.tokens.push({ type: 'OPERATOR', value: '&&' });
        } else if (lowerIdent === 'or') {
          this.tokens.push({ type: 'OPERATOR', value: '||' });
        } else if (lowerIdent === 'not') {
          this.tokens.push({ type: 'OPERATOR', value: '!' });
        } else {
          this.tokens.push({ type: 'IDENTIFIER', value: ident });
        }
        continue;
      }

      throw new Error(`Unexpected character: '${char}' at index ${i}`);
    }

    this.tokens.push({ type: 'EOF', value: '' });
  }

  private peek(): Token {
    return this.tokens[this.pos] || { type: 'EOF', value: '' };
  }

  private next(): Token {
    const t = this.peek();
    if (t.type !== 'EOF') this.pos++;
    return t;
  }

  private match(type: string, value?: string): boolean {
    const t = this.peek();
    if (t.type === type && (!value || t.value === value)) {
      this.pos++;
      return true;
    }
    return false;
  }

  private expect(type: string, value?: string): Token {
    const t = this.peek();
    if (t.type !== type || (value && t.value !== value)) {
      throw new Error(`Expected token ${type}${value ? ` ('${value}')` : ''} but found ${t.type} ('${t.value}')`);
    }
    return this.next();
  }

  // Expression Parsing with operator precedence recursive descent
  public parseAndEvaluate(expr: string): any {
    if (!expr.trim()) return '';
    this.tokenize(expr);
    const result = this.parseExpression();
    this.expect('EOF');
    return result;
  }

  // Precedence 1: OR
  private parseExpression(): any {
    let val = this.parseAnd();
    while (this.match('OPERATOR', '||')) {
      const right = this.parseAnd();
      val = Boolean(val) || Boolean(right);
    }
    return val;
  }

  // Precedence 2: AND
  private parseAnd(): any {
    let val = this.parseEquality();
    while (this.match('OPERATOR', '&&')) {
      const right = this.parseEquality();
      val = Boolean(val) && Boolean(right);
    }
    return val;
  }

  // Precedence 3: Equality (==, !=)
  private parseEquality(): any {
    let val = this.parseRelational();
    while (true) {
      if (this.match('OPERATOR', '==')) {
        const right = this.parseRelational();
        val = val === right;
      } else if (this.match('OPERATOR', '!=')) {
        const right = this.parseRelational();
        val = val !== right;
      } else {
        break;
      }
    }
    return val;
  }

  // Precedence 4: Relational (<, >, <=, >=)
  private parseRelational(): any {
    let val = this.parseAdditive();
    while (true) {
      if (this.match('OPERATOR', '<')) {
        const right = this.parseAdditive();
        // CRITICAL BUG FIX FOR STRING COMPARISONS: Avoid Number() cast which returned NaN for alphabetical strings!
        // Uses native JS operator which correctly supports both alphabetical string comparison and numeric comparisons!
        val = val < right;
      } else if (this.match('OPERATOR', '>')) {
        const right = this.parseAdditive();
        val = val > right;
      } else if (this.match('OPERATOR', '<=')) {
        const right = this.parseAdditive();
        val = val <= right;
      } else if (this.match('OPERATOR', '>=')) {
        const right = this.parseAdditive();
        val = val >= right;
      } else {
        break;
      }
    }
    return val;
  }

  // Precedence 5: Additive (+, -, &)
  private parseAdditive(): any {
    let val = this.parseMultiplicative();
    while (true) {
      if (this.match('OPERATOR', '+')) {
        const right = this.parseMultiplicative();
        // If either is string, concat, else add
        if (typeof val === 'string' || typeof right === 'string') {
          val = String(val) + String(right);
        } else {
          val = Number(val) + Number(right);
        }
      } else if (this.match('OPERATOR', '-')) {
        const right = this.parseMultiplicative();
        val = Number(val) - Number(right);
      } else if (this.match('OPERATOR', '&')) {
        // Flowgorithm's explicit string concatenation operator
        const right = this.parseMultiplicative();
        val = String(val) + String(right);
      } else {
        break;
      }
    }
    return val;
  }

  // Precedence 6: Multiplicative (*, /, %)
  private parseMultiplicative(): any {
    let val = this.parseExponentiation();
    while (true) {
      if (this.match('OPERATOR', '*')) {
        const right = this.parseExponentiation();
        val = Number(val) * Number(right);
      } else if (this.match('OPERATOR', '/')) {
        const right = this.parseExponentiation();
        if (Number(right) === 0) {
          throw new Error('Division by zero error');
        }
        val = Number(val) / Number(right);
      } else if (this.match('OPERATOR', '%')) {
        const right = this.parseExponentiation();
        if (Number(right) === 0) {
          throw new Error('Modulo division by zero');
        }
        val = Number(val) % Number(right);
      } else {
        break;
      }
    }
    return val;
  }

  // Precedence 7: Exponentiation (^)
  private parseExponentiation(): any {
    let val = this.parseUnary();
    while (this.match('OPERATOR', '^')) {
      const right = this.parseUnary();
      val = Math.pow(Number(val), Number(right));
    }
    return val;
  }

  // Precedence 8: Unary (+, -, !, NOT)
  private parseUnary(): any {
    if (this.match('OPERATOR', '+')) {
      return this.parseUnary();
    }
    if (this.match('OPERATOR', '-')) {
      return -Number(this.parseUnary());
    }
    if (this.match('OPERATOR', '!')) {
      return !this.parseUnary();
    }
    return this.parsePrimary();
  }

  // Primary: Literals, Parentheses, Variable lookups, Array Indices, and Functions
  private parsePrimary(): any {
    const t = this.peek();

    if (t.type === 'NUMBER') {
      this.next();
      return t.value.includes('.') ? parseFloat(t.value) : parseInt(t.value, 10);
    }

    if (t.type === 'STRING') {
      this.next();
      return t.value;
    }

    if (t.type === 'BOOLEAN') {
      this.next();
      return t.value === 'true';
    }

    if (t.type === 'LPAREN') {
      this.next();
      const val = this.parseExpression();
      this.expect('RPAREN');
      return val;
    }

    if (t.type === 'IDENTIFIER') {
      const nameToken = this.next();
      const name = nameToken.value;

      // Check for function call
      if (this.peek().type === 'LPAREN') {
        this.next(); // skip '('
        const args: any[] = [];
        if (this.peek().type !== 'RPAREN') {
          args.push(this.parseExpression());
          while (this.match('COMMA')) {
            args.push(this.parseExpression());
          }
        }
        this.expect('RPAREN');
        return this.evaluateFunction(name, args);
      }

      // Check for array lookup (Case-Insensitive Variable Lookup!)
      if (this.peek().type === 'LBRACKET') {
        this.next(); // skip '['
        const indexVal = this.parseExpression();
        this.expect('RBRACKET');

        // Case-Insensitive variable lookup
        const sym = Object.values(this.variables).find(v => v.name.toLowerCase() === name.toLowerCase());
        if (!sym) {
          throw new Error(`Variable '${name}' is not defined.`);
        }
        if (!sym.isArray) {
          throw new Error(`Variable '${name}' is not an array/vector.`);
        }
        const index = Math.floor(Number(indexVal));
        if (index < 0 || index >= (sym.arraySize ?? 0)) {
          throw new Error(`Index ${index} out of bounds for array '${name}' of size ${sym.arraySize}.`);
        }
        return sym.value[index];
      }

      // Regular variable lookup (Case-Insensitive Variable Lookup!)
      const sym = Object.values(this.variables).find(v => v.name.toLowerCase() === name.toLowerCase());
      if (sym === undefined) {
        if (name.toLowerCase() === 'pi') {
          return Math.PI;
        }
        throw new Error(`Variable '${name}' is not defined.`);
      }
      if (sym.isArray) {
        throw new Error(`Cannot use array variable '${name}' as scalar without index bracket.`);
      }
      return sym.value;
    }

    throw new Error(`Invalid expression: unexpected token '${t.value}' of type '${t.type}'`);
  }

  private evaluateFunction(name: string, args: any[]): any {
    const fnName = name.toLowerCase();
    switch (fnName) {
      case 'abs':
        if (args.length !== 1) throw new Error('Function abs() requires exactly 1 argument.');
        return Math.abs(Number(args[0]));
      case 'sin':
        if (args.length !== 1) throw new Error('Function sin() requires exactly 1 argument.');
        return Math.sin(Number(args[0]));
      case 'cos':
        if (args.length !== 1) throw new Error('Function cos() requires exactly 1 argument.');
        return Math.cos(Number(args[0]));
      case 'tan':
        if (args.length !== 1) throw new Error('Function tan() requires exactly 1 argument.');
        return Math.tan(Number(args[0]));
      case 'sqrt':
        if (args.length !== 1) throw new Error('Function sqrt() requires exactly 1 argument.');
        const sVal = Number(args[0]);
        if (sVal < 0) throw new Error('Square root of negative number.');
        return Math.sqrt(sVal);
      case 'log':
      case 'log10':
        if (args.length !== 1) throw new Error('Function log() requires exactly 1 argument.');
        return Math.log10(Number(args[0]));
      case 'ln':
        if (args.length !== 1) throw new Error('Function ln() requires exactly 1 argument.');
        return Math.log(Number(args[0]));
      case 'len':
      case 'size':
        if (args.length !== 1) throw new Error('Function len() or size() requires exactly 1 argument.');
        if (Array.isArray(args[0])) return args[0].length;
        return String(args[0]).length;
      case 'tofixed':
        if (args.length !== 2) throw new Error('Function toFixed(value, digits) requires exactly 2 arguments.');
        return Number(args[0]).toFixed(Math.floor(Number(args[1])));
      case 'random':
        if (args.length !== 1) throw new Error('Function random(max) requires exactly 1 argument.');
        const max = Math.floor(Number(args[0]));
        if (max <= 0) throw new Error('Random limit must be positive.');
        return Math.floor(Math.random() * max);
      
      // CHAR AND CONVERSION INTRINSICS OF FLOWGORITHM
      case 'char':
        if (args.length !== 2) throw new Error('Function Char(string, index) requires exactly 2 arguments.');
        return String(args[0]).charAt(Math.floor(Number(args[1])));
      case 'tocode':
        if (args.length !== 1) throw new Error('Function ToCode(char) requires exactly 1 argument.');
        const cStr = String(args[0]);
        if (cStr.length === 0) return 0;
        return cStr.charCodeAt(0);
      case 'tochar':
        if (args.length !== 1) throw new Error('Function ToChar(code) requires exactly 1 argument.');
        return String.fromCharCode(Math.floor(Number(args[0])));
      case 'tointeger':
        if (args.length !== 1) throw new Error('Function ToInteger(value) requires exactly 1 argument.');
        return parseInt(String(args[0]), 10);
      case 'toreal':
        if (args.length !== 1) throw new Error('Function ToReal(value) requires exactly 1 argument.');
        return parseFloat(String(args[0]));
      case 'tostring':
        if (args.length !== 1) throw new Error('Function ToString(value) requires exactly 1 argument.');
        return String(args[0]);
      
      // MATHEMATICAL ADDITIONS
      case 'int':
        if (args.length !== 1) throw new Error('Function Int(value) requires exactly 1 argument.');
        return Math.trunc(Number(args[0]));
      case 'sgn':
        if (args.length !== 1) throw new Error('Function Sgn(value) requires exactly 1 argument.');
        return Math.sign(Number(args[0]));
      case 'arcsin':
        if (args.length !== 1) throw new Error('Function Arcsin(value) requires exactly 1 argument.');
        return Math.asin(Number(args[0]));
      case 'arccos':
        if (args.length !== 1) throw new Error('Function Arccos(value) requires exactly 1 argument.');
        return Math.acos(Number(args[0]));
      case 'arctan':
        if (args.length !== 1) throw new Error('Function Arctan(value) requires exactly 1 argument.');
        return Math.atan(Number(args[0]));

      default:
        throw new Error(`Unknown function: '${name}'`);
    }
  }
}
export default ExpressionParser;
