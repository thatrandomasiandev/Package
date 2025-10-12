# @code-lab/testing

Test execution and visualization for Code Lab.

## Features

- Simple test runner
- Test result visualization
- Coverage analysis
- Support for async tests
- Beautiful HTML reports

## Installation

```bash
npm install @code-lab/testing
```

## Usage

```typescript
import { TestRunner, expect, TestVisualizer } from '@code-lab/testing';

const runner = new TestRunner();

runner.describe('Math operations', () => {
  runner.test('addition', () => {
    expect(1 + 1).toBe(2);
  });
  
  runner.test('multiplication', () => {
    expect(2 * 3).toBe(6);
  });
});

const results = await runner.run();

const visualizer = new TestVisualizer();
const html = visualizer.generateHTML(results);
```

## License

MIT

