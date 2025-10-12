import { BaseParser, ParseResult, Program, NodeType } from '@code-lab/parser-core';

export class JavaParser extends BaseParser {
  parse(code: string, filename?: string): ParseResult {
    const startTime = Date.now();
    
    try {
      const ast = this.parseJavaToAST(code);
      
      return {
        ast,
        errors: [],
        warnings: [],
        metadata: {
          language: 'java',
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
          language: 'java',
          parseTime: Date.now() - startTime,
          nodeCount: 0,
          lineCount: code.split('\n').length,
        },
      };
    }
  }

  getSupportedExtensions(): string[] {
    return ['java'];
  }

  getLanguageId(): string {
    return 'java';
  }

  private parseJavaToAST(code: string): Program {
    const body: any[] = [];
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Parse class declarations
      if (line.match(/^(public\s+)?class\s+\w+/)) {
        const match = line.match(/class\s+(\w+)/);
        if (match) {
          body.push({
            type: NodeType.ClassDeclaration,
            name: match[1],
            body: [],
            loc: { start: { line: i + 1, column: 0 }, end: { line: i + 1, column: line.length } },
          });
        }
      }
      
      // Parse method declarations
      else if (line.match(/^(public|private|protected)?\s*(static\s+)?\w+\s+\w+\s*\(/)) {
        const match = line.match(/(\w+)\s*\(/);
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

