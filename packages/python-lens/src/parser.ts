import { BaseParser, ParseResult, Program, NodeType } from '@code-lab/parser-core';

/**
 * Python Parser
 * Note: This is a simplified parser. For production, use a proper Python AST library
 */
export class PythonParser extends BaseParser {
  parse(code: string, filename?: string): ParseResult {
    const startTime = Date.now();
    
    try {
      const ast = this.parseToAST(code);
      const parseTime = Date.now() - startTime;

      return {
        ast,
        errors: [],
        warnings: [],
        metadata: {
          language: 'python',
          parseTime,
          nodeCount: this.countNodes(ast),
          lineCount: code.split('\n').length,
        },
      };
    } catch (error: any) {
      return {
        ast: {
          type: NodeType.Program,
          body: [],
        },
        errors: [{
          message: error.message,
          severity: 'error' as const,
        }],
        warnings: [],
        metadata: {
          language: 'python',
          parseTime: Date.now() - startTime,
          nodeCount: 0,
          lineCount: code.split('\n').length,
        },
      };
    }
  }

  getSupportedExtensions(): string[] {
    return ['py', 'pyw', 'python'];
  }

  getLanguageId(): string {
    return 'python';
  }

  private parseToAST(code: string): Program {
    const lines = code.split('\n');
    const body: any[] = [];
    let currentLine = 0;

    while (currentLine < lines.length) {
      const line = lines[currentLine].trim();
      
      if (!line || line.startsWith('#')) {
        currentLine++;
        continue;
      }

      // Parse function definitions
      if (line.startsWith('def ')) {
        const funcNode = this.parseFunctionDef(line, currentLine);
        body.push(funcNode);
      }
      // Parse class definitions
      else if (line.startsWith('class ')) {
        const classNode = this.parseClassDef(line, currentLine);
        body.push(classNode);
      }
      // Parse variable assignments
      else if (line.includes('=') && !line.includes('==')) {
        const varNode = this.parseVariableAssignment(line, currentLine);
        body.push(varNode);
      }
      // Parse control structures
      else if (line.startsWith('if ') || line.startsWith('elif ') || line.startsWith('else:')) {
        const ifNode = this.parseIfStatement(line, currentLine);
        body.push(ifNode);
      }
      else if (line.startsWith('for ')) {
        const forNode = this.parseForLoop(line, currentLine);
        body.push(forNode);
      }
      else if (line.startsWith('while ')) {
        const whileNode = this.parseWhileLoop(line, currentLine);
        body.push(whileNode);
      }

      currentLine++;
    }

    return {
      type: NodeType.Program,
      body,
      sourceType: 'module',
    };
  }

  private parseFunctionDef(line: string, lineNum: number): any {
    const match = line.match(/def\s+(\w+)\s*\((.*?)\)/);
    if (match) {
      const [, name, params] = match;
      return {
        type: NodeType.FunctionDeclaration,
        name,
        params: params ? params.split(',').map(p => ({ name: p.trim() })) : [],
        body: { type: NodeType.BlockStatement, body: [] },
        loc: { start: { line: lineNum + 1, column: 0 }, end: { line: lineNum + 1, column: line.length } },
      };
    }
    return null;
  }

  private parseClassDef(line: string, lineNum: number): any {
    const match = line.match(/class\s+(\w+)(?:\((.*?)\))?:/);
    if (match) {
      const [, name, superClass] = match;
      return {
        type: NodeType.ClassDeclaration,
        name,
        superClass: superClass || undefined,
        body: [],
        loc: { start: { line: lineNum + 1, column: 0 }, end: { line: lineNum + 1, column: line.length } },
      };
    }
    return null;
  }

  private parseVariableAssignment(line: string, lineNum: number): any {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      return {
        type: NodeType.VariableDeclaration,
        name,
        kind: 'var',
        loc: { start: { line: lineNum + 1, column: 0 }, end: { line: lineNum + 1, column: line.length } },
      };
    }
    return null;
  }

  private parseIfStatement(line: string, lineNum: number): any {
    return {
      type: NodeType.IfStatement,
      test: { type: NodeType.Identifier },
      consequent: { type: NodeType.BlockStatement, body: [] },
      loc: { start: { line: lineNum + 1, column: 0 }, end: { line: lineNum + 1, column: line.length } },
    };
  }

  private parseForLoop(line: string, lineNum: number): any {
    return {
      type: NodeType.ForLoop,
      body: { type: NodeType.BlockStatement, body: [] },
      loc: { start: { line: lineNum + 1, column: 0 }, end: { line: lineNum + 1, column: line.length } },
    };
  }

  private parseWhileLoop(line: string, lineNum: number): any {
    return {
      type: NodeType.WhileLoop,
      test: { type: NodeType.Identifier },
      body: { type: NodeType.BlockStatement, body: [] },
      loc: { start: { line: lineNum + 1, column: 0 }, end: { line: lineNum + 1, column: line.length } },
    };
  }

  private countNodes(ast: Program): number {
    let count = 1;
    for (const node of ast.body) {
      count += this.countNodeRecursive(node);
    }
    return count;
  }

  private countNodeRecursive(node: any): number {
    if (!node) return 0;
    let count = 1;
    if (node.body) {
      if (Array.isArray(node.body)) {
        count += node.body.reduce((acc: number, n: any) => acc + this.countNodeRecursive(n), 0);
      } else {
        count += this.countNodeRecursive(node.body);
      }
    }
    return count;
  }
}

