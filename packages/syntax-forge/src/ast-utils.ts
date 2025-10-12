import { ASTNode, NodeType, Program, FunctionDeclaration, ClassDeclaration, VariableDeclaration } from './types';

/**
 * AST Utility Functions
 */

/**
 * Walk through AST nodes
 */
export function walk(node: ASTNode, callback: (node: ASTNode, parent?: ASTNode) => void, parent?: ASTNode): void {
  callback(node, parent);

  switch (node.type) {
    case NodeType.Program:
      (node as Program).body.forEach(child => walk(child, callback, node));
      break;
    case NodeType.FunctionDeclaration:
      if ((node as FunctionDeclaration).body) {
        walk((node as FunctionDeclaration).body, callback, node);
      }
      break;
    case NodeType.BlockStatement:
      (node as any).body?.forEach((child: ASTNode) => walk(child, callback, node));
      break;
    case NodeType.IfStatement:
      const ifNode = node as any;
      if (ifNode.test) walk(ifNode.test, callback, node);
      if (ifNode.consequent) walk(ifNode.consequent, callback, node);
      if (ifNode.alternate) walk(ifNode.alternate, callback, node);
      break;
    case NodeType.WhileLoop:
    case NodeType.ForLoop:
      const loopNode = node as any;
      if (loopNode.test) walk(loopNode.test, callback, node);
      if (loopNode.body) walk(loopNode.body, callback, node);
      break;
  }
}

/**
 * Find all nodes of a specific type
 */
export function findNodesByType(ast: ASTNode, type: NodeType): ASTNode[] {
  const results: ASTNode[] = [];
  walk(ast, (node) => {
    if (node.type === type) {
      results.push(node);
    }
  });
  return results;
}

/**
 * Find node by line number
 */
export function findNodeAtLine(ast: ASTNode, line: number): ASTNode | undefined {
  let result: ASTNode | undefined;
  walk(ast, (node) => {
    if (node.loc && node.loc.start.line <= line && node.loc.end.line >= line) {
      result = node;
    }
  });
  return result;
}

/**
 * Get all function declarations
 */
export function getFunctions(ast: Program): FunctionDeclaration[] {
  return findNodesByType(ast, NodeType.FunctionDeclaration) as FunctionDeclaration[];
}

/**
 * Get all class declarations
 */
export function getClasses(ast: Program): ClassDeclaration[] {
  return findNodesByType(ast, NodeType.ClassDeclaration) as ClassDeclaration[];
}

/**
 * Get all variable declarations
 */
export function getVariables(ast: Program): VariableDeclaration[] {
  return findNodesByType(ast, NodeType.VariableDeclaration) as VariableDeclaration[];
}

/**
 * Calculate cyclomatic complexity
 */
export function calculateComplexity(node: ASTNode): number {
  let complexity = 1; // Base complexity

  walk(node, (n) => {
    switch (n.type) {
      case NodeType.IfStatement:
      case NodeType.WhileLoop:
      case NodeType.ForLoop:
      case NodeType.CatchClause:
        complexity++;
        break;
      case NodeType.BinaryExpression:
        const binNode = n as any;
        if (binNode.operator === '&&' || binNode.operator === '||') {
          complexity++;
        }
        break;
    }
  });

  return complexity;
}

/**
 * Count nodes in AST
 */
export function countNodes(ast: ASTNode): number {
  let count = 0;
  walk(ast, () => count++);
  return count;
}

/**
 * Get AST depth
 */
export function getDepth(ast: ASTNode): number {
  let maxDepth = 0;

  function traverse(node: ASTNode, depth: number): void {
    maxDepth = Math.max(maxDepth, depth);
    
    switch (node.type) {
      case NodeType.Program:
        (node as Program).body.forEach(child => traverse(child, depth + 1));
        break;
      case NodeType.BlockStatement:
        (node as any).body?.forEach((child: ASTNode) => traverse(child, depth + 1));
        break;
    }
  }

  traverse(ast, 0);
  return maxDepth;
}

/**
 * Extract code metrics
 */
export interface CodeMetrics {
  functions: number;
  classes: number;
  variables: number;
  conditionals: number;
  loops: number;
  complexity: number;
  depth: number;
  nodeCount: number;
}

export function extractMetrics(ast: Program): CodeMetrics {
  const functions = findNodesByType(ast, NodeType.FunctionDeclaration).length;
  const classes = findNodesByType(ast, NodeType.ClassDeclaration).length;
  const variables = findNodesByType(ast, NodeType.VariableDeclaration).length;
  const conditionals = findNodesByType(ast, NodeType.IfStatement).length;
  const loops = findNodesByType(ast, NodeType.WhileLoop).length + 
                findNodesByType(ast, NodeType.ForLoop).length;

  return {
    functions,
    classes,
    variables,
    conditionals,
    loops,
    complexity: calculateComplexity(ast),
    depth: getDepth(ast),
    nodeCount: countNodes(ast),
  };
}

