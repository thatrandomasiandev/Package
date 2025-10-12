# @code-lab/parser-core

Core parser interfaces and AST utilities for Code Lab. This package provides the foundation for all language-specific parsers.

## Features

- Abstract parser interface for language implementations
- Unified AST node types
- Parser registry for managing multiple languages
- AST traversal and manipulation utilities
- Visitor pattern implementation
- Code metrics extraction

## Installation

```bash
npm install @code-lab/parser-core
```

## Usage

### Implementing a Language Parser

```typescript
import { BaseParser, ParseResult, NodeType } from '@code-lab/parser-core';

class MyLanguageParser extends BaseParser {
  parse(code: string, filename?: string): ParseResult {
    // Your parsing logic here
    const ast = this.parseToAST(code);
    
    return {
      ast,
      errors: [],
      warnings: [],
      metadata: {
        language: 'mylang',
        parseTime: Date.now(),
        nodeCount: 0,
        lineCount: code.split('\n').length
      }
    };
  }

  getSupportedExtensions(): string[] {
    return ['mylang', 'ml'];
  }

  getLanguageId(): string {
    return 'mylang';
  }
}
```

### Using the Parser Registry

```typescript
import { parserRegistry } from '@code-lab/parser-core';

// Register your parser
const myParser = new MyLanguageParser();
parserRegistry.register('mylang', myParser);

// Parse code
const result = parserRegistry.parse(code, 'mylang', 'file.mylang');
```

### AST Utilities

```typescript
import { walk, findNodesByType, extractMetrics, NodeType } from '@code-lab/parser-core';

// Walk through all nodes
walk(ast, (node) => {
  console.log(node.type);
});

// Find specific node types
const functions = findNodesByType(ast, NodeType.FunctionDeclaration);

// Extract code metrics
const metrics = extractMetrics(ast);
console.log(`Functions: ${metrics.functions}, Complexity: ${metrics.complexity}`);
```

### Visitor Pattern

```typescript
import { createVisitor, NodeType } from '@code-lab/parser-core';

const visitor = createVisitor({
  visitFunctionDeclaration(node) {
    console.log(`Found function: ${node.name}`);
  },
  visitClassDeclaration(node) {
    console.log(`Found class: ${node.name}`);
  }
});

visitor.visit(ast);
```

## API Reference

See [API Documentation](./docs/API.md) for detailed API reference.

## License

MIT

