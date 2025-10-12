import { Program, walk, NodeType } from '@code-lab/parser-core';

export interface CallGraphNode {
  name: string;
  type: 'function' | 'method';
  calls: string[];
}

export class CallGraphGenerator {
  generateCallGraph(ast: Program): CallGraphNode[] {
    const graph: CallGraphNode[] = [];
    const currentFunction: { name: string; calls: string[] } | null = null;

    walk(ast, (node) => {
      if (node.type === NodeType.FunctionDeclaration) {
        const funcNode = node as any;
        graph.push({
          name: funcNode.name,
          type: 'function',
          calls: this.extractCalls(funcNode.body),
        });
      }
    });

    return graph;
  }

  private extractCalls(body: any): string[] {
    const calls: string[] = [];
    
    walk(body, (node) => {
      if (node.type === NodeType.CallExpression) {
        const callNode = node as any;
        if (callNode.callee?.name) {
          calls.push(callNode.callee.name);
        }
      }
    });

    return calls;
  }
}

