/**
 * Common diagram types and interfaces
 */

export enum DiagramType {
  FlowChart = 'flowchart',
  StructureTree = 'structure-tree',
  SequenceDiagram = 'sequence',
  ClassDiagram = 'class',
  CallGraph = 'call-graph',
}

export enum NodeShape {
  Rectangle = 'rectangle',
  RoundedRectangle = 'rounded-rectangle',
  Circle = 'circle',
  Diamond = 'diamond',
  Hexagon = 'hexagon',
  Parallelogram = 'parallelogram',
}

export interface DiagramNode {
  id: string;
  label: string;
  type: string;
  shape?: NodeShape;
  color?: string;
  metadata?: Record<string, any>;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  type?: 'solid' | 'dashed' | 'dotted';
  color?: string;
}

export interface Diagram {
  type: DiagramType;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  metadata?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
}

export interface RenderOptions {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark' | 'auto';
  direction?: 'TB' | 'LR' | 'BT' | 'RL'; // Top-Bottom, Left-Right, etc.
  interactive?: boolean;
  showLineNumbers?: boolean;
  showMetadata?: boolean;
}

export interface VisualizationResult {
  html: string;
  diagram: Diagram;
  stats?: {
    nodeCount: number;
    edgeCount: number;
    maxDepth: number;
  };
}

