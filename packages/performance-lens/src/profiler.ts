export interface ProfileEntry {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  memory: number;
}

export interface ProfileResult {
  entries: ProfileEntry[];
  totalTime: number;
  averageTime: number;
  peakMemory: number;
}

export class Profiler {
  private entries: ProfileEntry[] = [];
  private activeProfiles: Map<string, { startTime: number; startMemory: number }> = new Map();

  start(name: string): void {
    this.activeProfiles.set(name, {
      startTime: performance.now(),
      startMemory: this.getMemoryUsage(),
    });
  }

  end(name: string): ProfileEntry | null {
    const profile = this.activeProfiles.get(name);
    if (!profile) return null;

    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();

    const entry: ProfileEntry = {
      name,
      startTime: profile.startTime,
      endTime,
      duration: endTime - profile.startTime,
      memory: endMemory - profile.startMemory,
    };

    this.entries.push(entry);
    this.activeProfiles.delete(name);
    return entry;
  }

  async profile<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      return result;
    } finally {
      this.end(name);
    }
  }

  getResults(): ProfileResult {
    const totalTime = this.entries.reduce((sum, e) => sum + e.duration, 0);
    const averageTime = this.entries.length > 0 ? totalTime / this.entries.length : 0;
    const peakMemory = Math.max(...this.entries.map(e => e.memory));

    return {
      entries: this.entries,
      totalTime,
      averageTime,
      peakMemory,
    };
  }

  reset(): void {
    this.entries = [];
    this.activeProfiles.clear();
  }

  private getMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }
}

