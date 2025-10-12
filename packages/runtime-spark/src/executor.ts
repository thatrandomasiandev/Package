import { ExecutionOptions, ExecutionResult, ExecutionStatus, LogEntry, ErrorEntry } from './types';
import { Sandbox } from './sandbox';
import { MemoryMonitor } from './memory-monitor';

/**
 * Base Executor Interface
 */
export abstract class BaseExecutor {
  protected sandbox: Sandbox;
  protected memoryMonitor: MemoryMonitor;
  protected logs: LogEntry[] = [];
  protected errors: ErrorEntry[] = [];
  protected variables: Record<string, any> = {};

  constructor() {
    this.sandbox = new Sandbox();
    this.memoryMonitor = new MemoryMonitor();
  }

  /**
   * Execute code
   */
  abstract execute(code: string, options?: ExecutionOptions): Promise<ExecutionResult>;

  /**
   * Get supported language identifier
   */
  abstract getLanguageId(): string;

  /**
   * Get current variables
   */
  getVariables(): Record<string, any> {
    return { ...this.variables };
  }

  /**
   * Clear execution state
   */
  reset(): void {
    this.logs = [];
    this.errors = [];
    this.variables = {};
  }

  /**
   * Add a log entry
   */
  protected addLog(type: LogEntry['type'], message: string, args?: any[]): void {
    this.logs.push({
      type,
      message,
      timestamp: Date.now(),
      args,
    });
  }

  /**
   * Add an error entry
   */
  protected addError(message: string, stack?: string, line?: number, column?: number): void {
    this.errors.push({
      message,
      stack,
      line,
      column,
    });
  }
}

/**
 * JavaScript Executor
 */
export class JavaScriptExecutor extends BaseExecutor {
  getLanguageId(): string {
    return 'javascript';
  }

  async execute(code: string, options: ExecutionOptions = {}): Promise<ExecutionResult> {
    const startTime = Date.now();
    const startMemory = this.memoryMonitor.getCurrentUsage();

    try {
      const result = await this.sandbox.run(code, {
        timeout: options.timeout || 5000,
        memoryLimit: options.memoryLimit || 128,
        allowedGlobals: ['console', 'Math', 'Date', 'JSON', 'Object', 'Array'],
      });

      const executionTime = Date.now() - startTime;
      const memoryUsed = this.memoryMonitor.getCurrentUsage() - startMemory;

      // Extract variables from sandbox
      this.variables = result.variables || {};

      return {
        output: result.output,
        logs: result.logs || this.logs,
        errors: result.errors || this.errors,
        variables: this.variables,
        executionTime,
        memoryUsed,
        success: !result.error,
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const memoryUsed = this.memoryMonitor.getCurrentUsage() - startMemory;

      this.addError(error.message, error.stack);

      return {
        output: null,
        logs: this.logs,
        errors: this.errors,
        variables: this.variables,
        executionTime,
        memoryUsed,
        success: false,
      };
    }
  }
}

/**
 * TypeScript Executor (transpiles to JS first)
 */
export class TypeScriptExecutor extends JavaScriptExecutor {
  getLanguageId(): string {
    return 'typescript';
  }

  async execute(code: string, options: ExecutionOptions = {}): Promise<ExecutionResult> {
    // Simple TypeScript to JavaScript conversion (removes types)
    const jsCode = this.transpileToJS(code);
    return super.execute(jsCode, options);
  }

  private transpileToJS(tsCode: string): string {
    // Very basic type removal (in production, use proper TypeScript compiler)
    return tsCode
      .replace(/:\s*\w+(\[\])?(\s*[=,\)])/g, '$2') // Remove type annotations
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, '') // Remove interfaces
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '') // Remove type aliases
      .replace(/as\s+\w+/g, '') // Remove type assertions
      .replace(/<\w+>/g, ''); // Remove generic types
  }
}

/**
 * Executor Registry
 */
export class ExecutorRegistry {
  private executors: Map<string, BaseExecutor> = new Map();

  constructor() {
    // Register default executors
    this.register('javascript', new JavaScriptExecutor());
    this.register('typescript', new TypeScriptExecutor());
  }

  register(languageId: string, executor: BaseExecutor): void {
    this.executors.set(languageId.toLowerCase(), executor);
  }

  getExecutor(languageId: string): BaseExecutor | undefined {
    return this.executors.get(languageId.toLowerCase());
  }

  async execute(code: string, languageId: string, options?: ExecutionOptions): Promise<ExecutionResult> {
    const executor = this.getExecutor(languageId);
    if (!executor) {
      throw new Error(`No executor registered for language: ${languageId}`);
    }
    return executor.execute(code, options);
  }

  getRegisteredLanguages(): string[] {
    return Array.from(this.executors.keys());
  }
}

export const executorRegistry = new ExecutorRegistry();

