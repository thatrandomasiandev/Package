# @code-lab/java-parser

Java parser for Code Lab.

## Installation

```bash
npm install @code-lab/java-parser
```

## Usage

```typescript
import { JavaParser } from '@code-lab/java-parser';
import { parserRegistry } from '@code-lab/parser-core';

const parser = new JavaParser();
parserRegistry.register('java', parser);

const code = `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`;

const result = parser.parse(code);
console.log(result.ast);
```

## License

MIT

