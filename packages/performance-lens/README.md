# @code-lab/profiler

Performance profiling and benchmarking for Code Lab.

## Features

- Function profiling with timing and memory tracking
- Benchmarking utilities
- Flame graph generation
- Performance comparison tools

## Installation

```bash
npm install @code-lab/profiler
```

## Usage

```typescript
import { Profiler, Benchmark, FlameGraphGenerator } from '@code-lab/profiler';

// Profiling
const profiler = new Profiler();

await profiler.profile('myFunction', async () => {
  // Your code here
});

const results = profiler.getResults();
console.log(`Total time: ${results.totalTime}ms`);

// Benchmarking
const benchmark = new Benchmark();
const result = await benchmark.run('myBenchmark', () => {
  // Code to benchmark
}, 1000);

console.log(`${result.opsPerSecond.toFixed(0)} ops/sec`);

// Flame graph
const flamegraph = new FlameGraphGenerator();
const graph = flamegraph.generate(results.entries);
const svg = flamegraph.generateSVG(graph);
```

## License

MIT

