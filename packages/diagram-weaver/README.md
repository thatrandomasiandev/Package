# @code-lab/mermaid

Mermaid.js integration for Code Lab diagrams.

## Installation

```bash
npm install @code-lab/mermaid
```

## Usage

```typescript
import { MermaidConverter, MermaidRenderer } from '@code-lab/mermaid';
import { FlowChartGenerator } from '@code-lab/visualizers';

// Generate diagram
const generator = new FlowChartGenerator();
const result = generator.generateFlowChart(ast);

// Convert to Mermaid
const converter = new MermaidConverter();
const mermaidCode = converter.convertDiagram(result.diagram);

// Render to HTML
const renderer = new MermaidRenderer();
const html = renderer.renderToHTML(mermaidCode, { theme: 'dark' });
```

## License

MIT

