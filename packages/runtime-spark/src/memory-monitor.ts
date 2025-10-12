import { RuntimeStats } from './types';

/**
 * Memory Monitor for tracking execution resources
 */
export class MemoryMonitor {
  private startMemory: number = 0;
  private peakMemory: number = 0;
  private samples: number[] = [];

  /**
   * Start monitoring
   */
  start(): void {
    this.startMemory = this.getCurrentUsage();
    this.peakMemory = this.startMemory;
    this.samples = [];
  }

  /**
   * Take a memory sample
   */
  sample(): void {
    const current = this.getCurrentUsage();
    this.samples.push(current);
    this.peakMemory = Math.max(this.peakMemory, current);
  }

  /**
   * Get current memory usage in bytes
   */
  getCurrentUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage().heapUsed;
    }
    return 0;
  }

  /**
   * Get memory usage in MB
   */
  getCurrentUsageMB(): number {
    return this.getCurrentUsage() / 1024 / 1024;
  }

  /**
   * Get peak memory usage
   */
  getPeakMemory(): number {
    return this.peakMemory;
  }

  /**
   * Get peak memory usage in MB
   */
  getPeakMemoryMB(): number {
    return this.peakMemory / 1024 / 1024;
  }

  /**
   * Get memory delta since start
   */
  getDelta(): number {
    return this.getCurrentUsage() - this.startMemory;
  }

  /**
   * Get memory delta in MB
   */
  getDeltaMB(): number {
    return this.getDelta() / 1024 / 1024;
  }

  /**
   * Get statistics
   */
  getStats(): RuntimeStats {
    const current = this.getCurrentUsage();
    return {
      executionTime: 0, // Will be set by executor
      memoryUsed: current - this.startMemory,
      peakMemory: this.peakMemory,
    };
  }

  /**
   * Reset monitor
   */
  reset(): void {
    this.startMemory = 0;
    this.peakMemory = 0;
    this.samples = [];
  }

  /**
   * Check if memory limit is exceeded
   */
  isMemoryLimitExceeded(limitMB: number): boolean {
    return this.getCurrentUsageMB() > limitMB;
  }
}

