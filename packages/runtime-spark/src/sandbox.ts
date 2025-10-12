import { SandboxConfig, LogEntry, ErrorEntry } from './types';

/**
 * Sandbox for safe code execution
 */
export class Sandbox {
  private context: Record<string, any> = {};

  /**
   * Run code in sandbox
   */
  async run(
    code: string,
    config: SandboxConfig = {}
  ): Promise<{
    output: any;
    logs: LogEntry[];
    errors: ErrorEntry[];
    variables: Record<string, any>;
    error?: string;
  }> {
    const logs: LogEntry[] = [];
    const errors: ErrorEntry[] = [];
    const variables: Record<string, any> = {};

    // Create isolated context
    const sandbox = this.createSandboxContext(logs, config);

    try {
      // Execute with timeout
      const result = await this.executeWithTimeout(code, sandbox, config.timeout || 5000);

      // Extract variables from sandbox
      Object.keys(sandbox).forEach(key => {
        if (!this.isBuiltIn(key)) {
          variables[key] = sandbox[key];
        }
      });

      return {
        output: result,
        logs,
        errors,
        variables,
      };
    } catch (error: any) {
      errors.push({
        message: error.message,
        stack: error.stack,
      });

      return {
        output: null,
        logs,
        errors,
        variables,
        error: error.message,
      };
    }
  }

  /**
   * Create sandbox context with limited globals
   */
  private createSandboxContext(logs: LogEntry[], config: SandboxConfig): Record<string, any> {
    const allowedGlobals = config.allowedGlobals || ['console', 'Math', 'Date', 'JSON'];
    const sandbox: Record<string, any> = {};

    // Add allowed globals
    if (allowedGlobals.includes('console')) {
      sandbox.console = {
        log: (...args: any[]) => {
          logs.push({
            type: 'log',
            message: args.map(a => String(a)).join(' '),
            timestamp: Date.now(),
            args,
          });
        },
        info: (...args: any[]) => {
          logs.push({
            type: 'info',
            message: args.map(a => String(a)).join(' '),
            timestamp: Date.now(),
            args,
          });
        },
        warn: (...args: any[]) => {
          logs.push({
            type: 'warn',
            message: args.map(a => String(a)).join(' '),
            timestamp: Date.now(),
            args,
          });
        },
        error: (...args: any[]) => {
          logs.push({
            type: 'error',
            message: args.map(a => String(a)).join(' '),
            timestamp: Date.now(),
            args,
          });
        },
      };
    }

    if (allowedGlobals.includes('Math')) sandbox.Math = Math;
    if (allowedGlobals.includes('Date')) sandbox.Date = Date;
    if (allowedGlobals.includes('JSON')) sandbox.JSON = JSON;
    if (allowedGlobals.includes('Object')) sandbox.Object = Object;
    if (allowedGlobals.includes('Array')) sandbox.Array = Array;

    return sandbox;
  }

  /**
   * Execute code with timeout
   */
  private async executeWithTimeout(
    code: string,
    sandbox: Record<string, any>,
    timeout: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Execution timeout after ${timeout}ms`));
      }, timeout);

      try {
        // Create function from code
        const func = new Function(...Object.keys(sandbox), `
          'use strict';
          ${code}
        `);

        // Execute
        const result = func(...Object.values(sandbox));
        clearTimeout(timer);
        resolve(result);
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * Check if a variable name is a built-in
   */
  private isBuiltIn(name: string): boolean {
    const builtIns = ['console', 'Math', 'Date', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean'];
    return builtIns.includes(name);
  }

  /**
   * Clear sandbox context
   */
  clear(): void {
    this.context = {};
  }
}

