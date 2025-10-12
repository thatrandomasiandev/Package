import { Program, walk, NodeType } from '@code-lab/parser-core';

export interface DependencyNode {
  name: string;
  imports: string[];
  exports: string[];
}

export class DependencyGraphGenerator {
  generateDependencyGraph(ast: Program): DependencyNode {
    const imports: string[] = [];
    const exports: string[] = [];

    walk(ast, (node) => {
      if (node.type === NodeType.ImportDeclaration) {
        const importNode = node as any;
        if (importNode.source) {
          imports.push(importNode.source);
        }
      } else if (node.type === NodeType.ExportDeclaration) {
        const exportNode = node as any;
        if (exportNode.declaration?.name) {
          exports.push(exportNode.declaration.name);
        }
      }
    });

    return {
      name: 'module',
      imports,
      exports,
    };
  }
}

