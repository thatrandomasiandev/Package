import { ASTNode, NodeType, Program, walk } from '@code-lab/parser-core';
import { Diagram, DiagramType, DiagramNode, DiagramEdge, NodeShape, RenderOptions, VisualizationResult } from './diagram-types';
import { HTMLRenderer } from './renderers';

/**
 * Flow Chart Generator
 */
export class FlowChartGenerator {
  private nodeCounter = 0;
  private nodes: DiagramNode[] = [];
  private edges: DiagramEdge[] = [];

  /**
   * Generate a flow chart from an AST
   */
  generateFlowChart(ast: Program, options: RenderOptions = {}): VisualizationResult {
    this.reset();
    
    // Build the diagram from the AST
    this.buildFlowChart(ast);

    const diagram: Diagram = {
      type: DiagramType.FlowChart,
      nodes: this.nodes,
      edges: this.edges,
      metadata: {
        title: 'Code Flow Chart',
      },
    };

    // Render to HTML
    const renderer = new HTMLRenderer();
    const html = renderer.render(diagram, options);

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

  private buildFlowChart(ast: ASTNode, parentId?: string): string | undefined {
    const nodeId = this.createNodeId();

    switch (ast.type) {
      case NodeType.Program:
        const programNode = ast as Program;
        this.addNode(nodeId, 'Start', 'start', NodeShape.Circle, '#4CAF50');
        
        let prevId = nodeId;
        for (const statement of programNode.body) {
          const childId = this.buildFlowChart(statement, prevId);
          if (childId && prevId) {
            this.addEdge(prevId, childId);
            prevId = childId;
          }
        }
        
        const endId = this.createNodeId();
        this.addNode(endId, 'End', 'end', NodeShape.Circle, '#f44336');
        if (prevId) {
          this.addEdge(prevId, endId);
        }
        return endId;

      case NodeType.FunctionDeclaration:
        const funcNode = ast as any;
        this.addNode(nodeId, `Function: ${funcNode.name}`, 'function', NodeShape.RoundedRectangle, '#2196F3');
        
        if (funcNode.body) {
          const bodyId = this.buildFlowChart(funcNode.body, nodeId);
          if (bodyId) {
            this.addEdge(nodeId, bodyId);
          }
        }
        return nodeId;

      case NodeType.IfStatement:
        const ifNode = ast as any;
        this.addNode(nodeId, 'Condition?', 'condition', NodeShape.Diamond, '#FF9800');
        
        // True branch
        if (ifNode.consequent) {
          const trueId = this.buildFlowChart(ifNode.consequent, nodeId);
          if (trueId) {
            this.addEdge(nodeId, trueId, 'true');
          }
        }
        
        // False branch
        if (ifNode.alternate) {
          const falseId = this.buildFlowChart(ifNode.alternate, nodeId);
          if (falseId) {
            this.addEdge(nodeId, falseId, 'false');
          }
        }
        return nodeId;

      case NodeType.WhileLoop:
        const whileNode = ast as any;
        this.addNode(nodeId, 'While Loop', 'loop', NodeShape.Hexagon, '#9C27B0');
        
        if (whileNode.body) {
          const bodyId = this.buildFlowChart(whileNode.body, nodeId);
          if (bodyId) {
            this.addEdge(nodeId, bodyId, 'continue');
            this.addEdge(bodyId, nodeId, 'loop back', 'dashed');
          }
        }
        return nodeId;

      case NodeType.ForLoop:
        const forNode = ast as any;
        this.addNode(nodeId, 'For Loop', 'loop', NodeShape.Hexagon, '#9C27B0');
        
        if (forNode.body) {
          const bodyId = this.buildFlowChart(forNode.body, nodeId);
          if (bodyId) {
            this.addEdge(nodeId, bodyId, 'iterate');
            this.addEdge(bodyId, nodeId, 'next', 'dashed');
          }
        }
        return nodeId;

      case NodeType.ReturnStatement:
        this.addNode(nodeId, 'Return', 'return', NodeShape.RoundedRectangle, '#607D8B');
        return nodeId;

      case NodeType.BlockStatement:
        const blockNode = ast as any;
        let blockPrevId = parentId;
        
        for (const statement of blockNode.body || []) {
          const childId = this.buildFlowChart(statement, blockPrevId);
          if (childId && blockPrevId) {
            if (blockPrevId !== parentId) {
              this.addEdge(blockPrevId, childId);
            }
            blockPrevId = childId;
          }
        }
        return blockPrevId;

      case NodeType.VariableDeclaration:
        const varNode = ast as any;
        this.addNode(nodeId, `Declare: ${varNode.name}`, 'variable', NodeShape.Parallelogram, '#00BCD4');
        return nodeId;

      case NodeType.CallExpression:
        const callNode = ast as any;
        const calleeName = callNode.callee?.name || 'function';
        this.addNode(nodeId, `Call: ${calleeName}()`, 'call', NodeShape.Rectangle, '#03A9F4');
        return nodeId;

      default:
        this.addNode(nodeId, ast.type, 'statement', NodeShape.Rectangle, '#9E9E9E');
        return nodeId;
    }
  }

  private createNodeId(): string {
    return `node_${this.nodeCounter++}`;
  }

  private addNode(id: string, label: string, type: string, shape: NodeShape, color: string): void {
    this.nodes.push({ id, label, type, shape, color });
  }

  private addEdge(from: string, to: string, label?: string, type: 'solid' | 'dashed' | 'dotted' = 'solid'): void {
    this.edges.push({ from, to, label, type });
  }

  private calculateMaxDepth(): number {
    const visited = new Set<string>();
    const depths = new Map<string, number>();

    const dfs = (nodeId: string, depth: number): number => {
      if (visited.has(nodeId)) {
        return depths.get(nodeId) || 0;
      }

      visited.add(nodeId);
      depths.set(nodeId, depth);

      let maxDepth = depth;
      const outgoingEdges = this.edges.filter(e => e.from === nodeId);
      
      for (const edge of outgoingEdges) {
        maxDepth = Math.max(maxDepth, dfs(edge.to, depth + 1));
      }

      return maxDepth;
    };

    if (this.nodes.length === 0) return 0;
    return dfs(this.nodes[0].id, 0);
  }
}

