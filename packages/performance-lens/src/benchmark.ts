export interface BenchmarkResult {
  name: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  opsPerSecond: number;
}

export class Benchmark {
  async run(name: string, fn: () => void | Promise<void>, iterations: number = 1000): Promise<BenchmarkResult> {
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      await fn();
    }

    const totalTime = performance.now() - startTime;
    const averageTime = totalTime / iterations;
    const opsPerSecond = 1000 / averageTime;

    return {
      name,
      iterations,
      totalTime,
      averageTime,
      opsPerSecond,
    };
  }

  async compare(benchmarks: Array<{ name: string; fn: () => void | Promise<void> }>, iterations: number = 1000): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];

    for (const benchmark of benchmarks) {
      const result = await this.run(benchmark.name, benchmark.fn, iterations);
      results.push(result);
    }

    return results.sort((a, b) => a.averageTime - b.averageTime);
  }
}

