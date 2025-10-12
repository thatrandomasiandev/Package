# @code-lab/visualizers

Visualization generators for code structures, flow charts, and diagrams.

## Features

- Flow chart generation from AST
- Structure tree visualization
- Interactive HTML rendering
- SVG export support
- Customizable themes and layouts

## Installation

```bash
npm install @code-lab/visualizers @code-lab/parser-core
```

## Usage

### Flow Chart Generation

```typescript
import { FlowChartGenerator } from '@code-lab/visualizers';
import { parserRegistry } from '@code-lab/parser-core';

// Parse your code
const parseResult = parserRegistry.parse(code, 'javascript');

// Generate flow chart
const generator = new FlowChartGenerator();
const result = generator.generateFlowChart(parseResult.ast, {
  theme: 'dark',
  interactive: true,
  width: 1200,
  height: 800
});

// Use the HTML
console.log(result.html);
console.log(result.stats); // { nodeCount: 15, edgeCount: 20, maxDepth: 5 }
```

### Structure Tree Generation

```typescript
import { StructureTreeGenerator } from '@code-lab/visualizers';

const generator = new StructureTreeGenerator();
const result = generator.generateStructureTree(parseResult.ast, {
  direction: 'TB', // Top to bottom
  showLineNumbers: true
});
```

## Options

```typescript
interface RenderOptions {
  width?: number;           // Default: 1200
  height?: number;          // Default: 800
  theme?: 'light' | 'dark'; // Default: 'light'
  direction?: 'TB' | 'LR';  // Top-Bottom or Left-Right
  interactive?: boolean;    // Default: true
  showLineNumbers?: boolean;
  showMetadata?: boolean;
}
```

## License

MIT

