# @code-lab/rust-parser

Rust parser for Code Lab.

## Installation

```bash
npm install @code-lab/rust-parser
```

## Usage

```typescript
import { RustParser } from '@code-lab/rust-parser';
import { parserRegistry } from '@code-lab/parser-core';

const parser = new RustParser();
parserRegistry.register('rust', parser);

const code = `
fn main() {
    println!("Hello, world!");
}
`;

const result = parser.parse(code);
console.log(result.ast);
```

## License

MIT

