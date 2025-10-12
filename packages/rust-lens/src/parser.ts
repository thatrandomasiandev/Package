import { BaseParser, ParseResult, Program, NodeType } from '@code-lab/parser-core';

export class RustParser extends BaseParser {
  parse(code: string, filename?: string): ParseResult {
    const startTime = Date.now();
    
    try {
      const ast = this.parseRustToAST(code);
      
      return {
        ast,
        errors: [],
        warnings: [],
        metadata: {
          language: 'rust',
          parseTime: Date.now() - startTime,
          nodeCount: this.countNodes(ast),
          lineCount: code.split('\n').length,
        },
      };
    } catch (error: any) {
      return {
        ast: { type: NodeType.Program, body: [] },
        errors: [{ message: error.message, severity: 'error' as const }],
        warnings: [],
        metadata: {
          language: 'rust',
          parseTime: Date.now() - startTime,
          nodeCount: 0,
          lineCount: code.split('\n').length,
        },
      };
    }
  }

  getSupportedExtensions(): string[] {
    return ['rs'];
  }

  getLanguageId(): string {
    return 'rust';
  }

  private parseRustToAST(code: string): Program {
    const body: any[] = [];
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Parse function declarations
      if (line.startsWith('fn ')) {
        const match = line.match(/fn\s+(\w+)\s*\(/);
        if (match) {
          body.push({
            type: NodeType.FunctionDeclaration,
            name: match[1],
            params: [],
            body: { type: NodeType.BlockStatement, body: [] },
            loc: { start: { line: i + 1, column: 0 }, end: { line: i + 1, column: line.length } },
          });
        }
      }
      
      // Parse struct declarations (similar to classes)
      else if (line.startsWith('struct ')) {
        const match = line.match(/struct\s+(\w+)/);
        if (match) {
          body.push({
            type: NodeType.ClassDeclaration,
            name: match[1],
            body: [],
            loc: { start: { line: i + 1, column: 0 }, end: { line: i + 1, column: line.length } },
          });
        }
      }
      
      // Parse let bindings
      else if (line.startsWith('let ')) {
        const match = line.match(/let\s+(mut\s+)?(\w+)/);
        if (match) {
          body.push({
            type: NodeType.VariableDeclaration,
            name: match[2],
            kind: 'let',
            loc: { start: { line: i + 1, column: 0 }, end: { line: i + 1, column: line.length } },
          });
        }
      }
    }

    return {
      type: NodeType.Program,
      body,
      sourceType: 'module',
    };
  }

  private countNodes(ast: Program): number {
    return 1 + ast.body.length;
  }
}

