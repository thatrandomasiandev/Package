# @code-lab/python-parser

Python parser and executor for Code Lab.

## Features

- Python AST parsing
- Python code execution via system interpreter
- Python to JavaScript conversion utilities
- Support for Python 3.x

## Installation

```bash
npm install @code-lab/python-parser
```

## Requirements

- Python 3.x must be installed and available in system PATH

## Usage

### Parsing Python Code

```typescript
import { PythonParser } from '@code-lab/python-parser';
import { parserRegistry } from '@code-lab/parser-core';

const parser = new PythonParser();
parserRegistry.register('python', parser);

const code = `
def greet(name):
    print(f"Hello, {name}!")

greet("World")
`;

const result = parser.parse(code);
console.log(result.ast);
```

### Executing Python Code

```typescript
import { PythonExecutor } from '@code-lab/python-parser';
import { executorRegistry } from '@code-lab/execution-engine';

const executor = new PythonExecutor();
executorRegistry.register('python', executor);

const result = await executor.execute(`
x = 10
y = 20
print(f"Sum: {x + y}")
`);

console.log(result.output); // "Sum: 30"
```

### Python to JavaScript Conversion

```typescript
import { PythonToJSConverter } from '@code-lab/python-parser';

const converter = new PythonToJSConverter();
const pythonCode = `
def add(a, b):
    return a + b

result = add(5, 3)
print(result)
`;

const jsCode = converter.convert(pythonCode);
console.log(jsCode);
```

## License

MIT

