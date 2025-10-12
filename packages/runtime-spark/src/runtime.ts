import { ExecutionOptions, ExecutionResult, RuntimeStats } from './types';
import { MemoryMonitor } from './memory-monitor';

/**
 * Runtime manager for code execution
 */
export class Runtime {
  private monitor: MemoryMonitor;
  private startTime: number = 0;
  private isRunning: boolean = false;

  constructor() {
    this.monitor = new MemoryMonitor();
  }

  /**
   * Start runtime
   */
  start(): void {
    this.startTime = Date.now();
    this.monitor.start();
    this.isRunning = true;
  }

  /**
   * Stop runtime
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Get runtime statistics
   */
  getStats(): RuntimeStats {
    const stats = this.monitor.getStats();
    stats.executionTime = Date.now() - this.startTime;
    return stats;
  }

  /**
   * Check if running
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get elapsed time
   */
  getElapsedTime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Reset runtime
   */
  reset(): void {
    this.startTime = 0;
    this.isRunning = false;
    this.monitor.reset();
  }

  /**
   * Check resource limits
   */
  checkLimits(options: ExecutionOptions): {
    timeoutExceeded: boolean;
    memoryExceeded: boolean;
  } {
    const timeoutExceeded = options.timeout
      ? this.getElapsedTime() > options.timeout
      : false;
    
    const memoryExceeded = options.memoryLimit
      ? this.monitor.isMemoryLimitExceeded(options.memoryLimit)
      : false;

    return { timeoutExceeded, memoryExceeded };
  }
}

