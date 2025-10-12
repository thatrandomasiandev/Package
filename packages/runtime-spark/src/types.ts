/**
 * Execution Engine Types
 */

export interface ExecutionOptions {
  timeout?: number;
  memoryLimit?: number; // in MB
  allowNetworkAccess?: boolean;
  allowFileSystemAccess?: boolean;
  globals?: Record<string, any>;
  language?: string;
}

export interface ExecutionResult {
  output: any;
  logs: LogEntry[];
  errors: ErrorEntry[];
  variables: Record<string, any>;
  executionTime: number;
  memoryUsed: number;
  success: boolean;
}

export interface LogEntry {
  type: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
  args?: any[];
}

export interface ErrorEntry {
  message: string;
  stack?: string;
  line?: number;
  column?: number;
}

export interface RuntimeStats {
  executionTime: number;
  memoryUsed: number;
  cpuTime?: number;
  peakMemory: number;
}

export interface SandboxConfig {
  isolated?: boolean;
  timeout?: number;
  memoryLimit?: number;
  allowedGlobals?: string[];
  blockedGlobals?: string[];
}

export enum ExecutionStatus {
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
  Timeout = 'timeout',
  MemoryExceeded = 'memory-exceeded',
}

