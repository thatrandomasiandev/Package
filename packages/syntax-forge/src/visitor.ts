import { ASTNode, NodeType } from './types';

/**
 * Visitor Pattern for AST traversal
 */

export interface VisitorMethods {
  [key: string]: (node: ASTNode, state?: any) => void | boolean;
}

export class ASTVisitor {
  private visitors: VisitorMethods;

  constructor(visitors: VisitorMethods) {
    this.visitors = visitors;
  }

  /**
   * Visit a node and its children
   */
  visit(node: ASTNode, state?: any): void {
    const methodName = `visit${node.type}`;
    const genericMethod = this.visitors['visit'];
    const specificMethod = this.visitors[methodName];

    // Call specific visitor if it exists
    if (specificMethod) {
      const result = specificMethod.call(this, node, state);
      // If visitor returns false, stop traversal
      if (result === false) return;
    }

    // Call generic visitor if it exists
    if (genericMethod) {
      const result = genericMethod.call(this, node, state);
      if (result === false) return;
    }

    // Continue traversing children
    this.visitChildren(node, state);
  }

  /**
   * Visit all children of a node
   */
  private visitChildren(node: ASTNode, state?: any): void {
    switch (node.type) {
      case NodeType.Program:
        (node as any).body?.forEach((child: ASTNode) => this.visit(child, state));
        break;
      case NodeType.FunctionDeclaration:
      case NodeType.MethodDeclaration:
        if ((node as any).body) {
          this.visit((node as any).body, state);
        }
        break;
      case NodeType.BlockStatement:
        (node as any).body?.forEach((child: ASTNode) => this.visit(child, state));
        break;
      case NodeType.IfStatement:
        if ((node as any).test) this.visit((node as any).test, state);
        if ((node as any).consequent) this.visit((node as any).consequent, state);
        if ((node as any).alternate) this.visit((node as any).alternate, state);
        break;
      case NodeType.WhileLoop:
      case NodeType.ForLoop:
        if ((node as any).test) this.visit((node as any).test, state);
        if ((node as any).body) this.visit((node as any).body, state);
        break;
      case NodeType.ReturnStatement:
        if ((node as any).argument) this.visit((node as any).argument, state);
        break;
      case NodeType.CallExpression:
        if ((node as any).callee) this.visit((node as any).callee, state);
        (node as any).arguments?.forEach((arg: ASTNode) => this.visit(arg, state));
        break;
    }
  }

  /**
   * Add a visitor method dynamically
   */
  addVisitor(nodeType: string, visitor: (node: ASTNode, state?: any) => void | boolean): void {
    this.visitors[`visit${nodeType}`] = visitor;
  }
}

/**
 * Create a visitor with convenience methods
 */
export function createVisitor(methods: VisitorMethods): ASTVisitor {
  return new ASTVisitor(methods);
}

