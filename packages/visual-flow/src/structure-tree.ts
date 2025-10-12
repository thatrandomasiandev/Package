import { ASTNode, NodeType, Program, FunctionDeclaration, ClassDeclaration } from '@code-lab/parser-core';
import { Diagram, DiagramType, DiagramNode, DiagramEdge, NodeShape, RenderOptions, VisualizationResult } from './diagram-types';
import { HTMLRenderer } from './renderers';

/**
 * Structure Tree Generator
 */
export class StructureTreeGenerator {
  private nodeCounter = 0;
  private nodes: DiagramNode[] = [];
  private edges: DiagramEdge[] = [];

  /**
   * Generate a structure tree from an AST
   */
  generateStructureTree(ast: Program, options: RenderOptions = {}): VisualizationResult {
    this.reset();
    
    // Build the tree from the AST
    const rootId = this.createNodeId();
    this.addNode(rootId, 'Program', 'program', NodeShape.RoundedRectangle, '#4CAF50');
    this.buildStructureTree(ast, rootId);

    const diagram: Diagram = {
      type: DiagramType.StructureTree,
      nodes: this.nodes,
      edges: this.edges,
      metadata: {
        title: 'Code Structure Tree',
      },
    };

    // Render to HTML
    const renderer = new HTMLRenderer();
    const html = renderer.render(diagram, { ...options, direction: 'TB' });

    return {
      html,
      diagram,
      stats: {
        nodeCount: this.nodes.length,
        edgeCount: this.edges.length,
        maxDepth: this.calculateMaxDepth(),
      },
    };
  }

  private reset(): void {
    this.nodeCounter = 0;
    this.nodes = [];
    this.edges = [];
  }

  private buildStructureTree(ast: ASTNode, parentId: string): void {
    switch (ast.type) {
      case NodeType.Program:
        const program = ast as Program;
        for (const node of program.body) {
          this.buildStructureTree(node, parentId);
        }
        break;

      case NodeType.FunctionDeclaration:
        const func = ast as FunctionDeclaration;
        const funcId = this.createNodeId();
        this.addNode(
          funcId,
          `${func.name}(${func.params.map(p => p.name).join(', ')})`,
          'function',
          NodeShape.Rectangle,
          '#2196F3',
          {
            line: func.loc?.start.line,
            params: func.params,
            async: func.async,
          }
        );
        this.addEdge(parentId, funcId);
        
        if (func.body) {
          this.buildStructureTree(func.body, funcId);
        }
        break;

      case NodeType.ClassDeclaration:
        const cls = ast as ClassDeclaration;
        const classId = this.createNodeId();
        this.addNode(
          classId,
          `class ${cls.name}`,
          'class',
          NodeShape.Rectangle,
          '#9C27B0',
          {
            line: cls.loc?.start.line,
            superClass: cls.superClass,
          }
        );
        this.addEdge(parentId, classId);
        
        for (const method of cls.body) {
          this.buildStructureTree(method, classId);
        }
        break;

      case NodeType.MethodDeclaration:
        const method = ast as any;
        const methodId = this.createNodeId();
        this.addNode(
          methodId,
          `${method.name}()`,
          'method',
          NodeShape.Rectangle,
          '#03A9F4',
          {
            line: method.loc?.start.line,
            visibility: method.visibility,
            static: method.static,
          }
        );
        this.addEdge(parentId, methodId);
        
        if (method.body) {
          this.buildStructureTree(method.body, methodId);
        }
        break;

      case NodeType.VariableDeclaration:
        const variable = ast as any;
        const varId = this.createNodeId();
        this.addNode(
          varId,
          `${variable.kind} ${variable.name}`,
          'variable',
          NodeShape.Parallelogram,
          '#00BCD4',
          {
            line: variable.loc?.start.line,
            kind: variable.kind,
          }
        );
        this.addEdge(parentId, varId);
        break;

      case NodeType.IfStatement:
        const ifStmt = ast as any;
        const ifId = this.createNodeId();
        this.addNode(ifId, 'if', 'conditional', NodeShape.Diamond, '#FF9800');
        this.addEdge(parentId, ifId);
        
        if (ifStmt.consequent) {
          this.buildStructureTree(ifStmt.consequent, ifId);
        }
        if (ifStmt.alternate) {
          this.buildStructureTree(ifStmt.alternate, ifId);
        }
        break;

      case NodeType.WhileLoop:
      case NodeType.ForLoop:
        const loop = ast as any;
        const loopId = this.createNodeId();
        this.addNode(loopId, ast.type.replace('Loop', ''), 'loop', NodeShape.Hexagon, '#9C27B0');
        this.addEdge(parentId, loopId);
        
        if (loop.body) {
          this.buildStructureTree(loop.body, loopId);
        }
        break;

      case NodeType.BlockStatement:
        const block = ast as any;
        for (const statement of block.body || []) {
          this.buildStructureTree(statement, parentId);
        }
        break;
    }
  }

  private createNodeId(): string {
    return `node_${this.nodeCounter++}`;
  }

  private addNode(
    id: string,
    label: string,
    type: string,
    shape: NodeShape,
    color: string,
    metadata?: Record<string, any>
  ): void {
    this.nodes.push({ id, label, type, shape, color, metadata });
  }

  private addEdge(from: string, to: string, label?: string): void {
    this.edges.push({ from, to, label });
  }

  private calculateMaxDepth(): number {
    const depths = new Map<string, number>();

    const dfs = (nodeId: string, depth: number): number => {
      depths.set(nodeId, depth);

      let maxDepth = depth;
      const children = this.edges.filter(e => e.from === nodeId);
      
      for (const edge of children) {
        maxDepth = Math.max(maxDepth, dfs(edge.to, depth + 1));
      }

      return maxDepth;
    };

    if (this.nodes.length === 0) return 0;
    return dfs(this.nodes[0].id, 0);
  }
}

