# @code-lab/debugger

Step-by-step execution debugger for Code Lab.

## Features

- Breakpoint management
- Step over, step into, step out
- Variable inspection
- Call stack tracking
- Conditional breakpoints

## Installation

```bash
npm install @code-lab/debugger
```

## Usage

```typescript
import { Debugger, BreakpointManager } from '@code-lab/debugger';

const debugger = new Debugger();

// Add breakpoints
debugger.addBreakpoint(10);
debugger.addBreakpoint(20, 'x > 5'); // Conditional

// Control execution
debugger.continue();
debugger.pause();
debugger.stepOver();
debugger.stepInto();
debugger.stepOut();

// Inspect state
const currentLine = debugger.getCurrentLine();
const variables = debugger.getVariables();
```

## License

MIT

