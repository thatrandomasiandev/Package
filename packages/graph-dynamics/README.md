# @code-lab/d3-visualizer

D3.js-powered interactive visualizations for Code Lab.

## Features

- Force-directed graph layouts
- Call graph generation
- Dependency graph visualization
- Interactive draggable nodes
- Zoom and pan support

## Installation

```bash
npm install @code-lab/d3-visualizer
```

## Usage

```typescript
import { D3GraphVisualizer } from '@code-lab/d3-visualizer';
import { FlowChartGenerator } from '@code-lab/visualizers';

// Generate diagram
const generator = new FlowChartGenerator();
const result = generator.generateFlowChart(ast);

// Create D3 visualization
const d3Viz = new D3GraphVisualizer();
const html = d3Viz.generateHTML(result.diagram, {
  width: 1200,
  height: 800,
  theme: 'dark'
});
```

## License

MIT

