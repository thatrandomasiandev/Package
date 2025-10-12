import { Diagram, DiagramType, DiagramNode } from '@code-lab/visualizers';
import { Program, NodeType } from '@code-lab/parser-core';

/**
 * Convert Code Lab diagrams to Mermaid format
 */
export class MermaidConverter {
  /**
   * Convert a diagram to Mermaid syntax
   */
  convertDiagram(diagram: Diagram): string {
    switch (diagram.type) {
      case DiagramType.FlowChart:
        return this.convertFlowChart(diagram);
      case DiagramType.SequenceDiagram:
        return this.convertSequenceDiagram(diagram);
      case DiagramType.ClassDiagram:
        return this.convertClassDiagram(diagram);
      default:
        return this.convertFlowChart(diagram);
    }
  }

  /**
   * Convert AST directly to Mermaid flowchart
   */
  convertASTToFlowChart(ast: Program): string {
    let mermaidCode = 'flowchart TD\n';
    
    ast.body.forEach((node, index) => {
      const nodeId = `node${index}`;
      mermaidCode += this.convertASTNode(node, nodeId);
    });

    return mermaidCode;
  }

  private convertFlowChart(diagram: Diagram): string {
    let mermaidCode = 'flowchart TD\n';

    // Add nodes
    diagram.nodes.forEach(node => {
      const shape = this.getNodeShape(node);
      mermaidCode += `  ${node.id}${shape[0]}${node.label}${shape[1]}\n`;
      
      if (node.color) {
        mermaidCode += `  style ${node.id} fill:${node.color}\n`;
      }
    });

    // Add edges
    diagram.edges.forEach(edge => {
      const arrow = edge.type === 'dashed' ? '-.->' : edge.type === 'dotted' ? '...->' : '-->';
      const label = edge.label ? `|${edge.label}|` : '';
      mermaidCode += `  ${edge.from} ${arrow}${label} ${edge.to}\n`;
    });

    return mermaidCode;
  }

  private convertSequenceDiagram(diagram: Diagram): string {
    let mermaidCode = 'sequenceDiagram\n';

    diagram.edges.forEach(edge => {
      const fromNode = diagram.nodes.find(n => n.id === edge.from);
      const toNode = diagram.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        const message = edge.label || 'message';
        mermaidCode += `  ${fromNode.label}->>${toNode.label}: ${message}\n`;
      }
    });

    return mermaidCode;
  }

  private convertClassDiagram(diagram: Diagram): string {
    let mermaidCode = 'classDiagram\n';

    diagram.nodes.forEach(node => {
      mermaidCode += `  class ${node.label}\n`;
    });

    diagram.edges.forEach(edge => {
      mermaidCode += `  ${edge.from} --> ${edge.to}\n`;
    });

    return mermaidCode;
  }

  private convertASTNode(node: any, nodeId: string): string {
    let result = '';

    switch (node.type) {
      case NodeType.FunctionDeclaration:
        result += `  ${nodeId}[Function: ${node.name}]\n`;
        break;
      case NodeType.ClassDeclaration:
        result += `  ${nodeId}[Class: ${node.name}]\n`;
        break;
      case NodeType.IfStatement:
        result += `  ${nodeId}{Condition?}\n`;
        break;
      case NodeType.WhileLoop:
      case NodeType.ForLoop:
        result += `  ${nodeId}[[Loop]]\n`;
        break;
      default:
        result += `  ${nodeId}[${node.type}]\n`;
    }

    return result;
  }

  private getNodeShape(node: DiagramNode): [string, string] {
    switch (node.shape) {
      case 'circle':
        return ['((', '))'];
      case 'diamond':
        return ['{', '}'];
      case 'hexagon':
        return ['{{', '}}'];
      case 'rounded-rectangle':
        return ['(', ')'];
      case 'parallelogram':
        return ['[/', '/]'];
      default:
        return ['[', ']'];
    }
  }
}

