import { BaseExecutor, ExecutionOptions, ExecutionResult } from '@code-lab/execution-engine';
import { spawn } from 'child_process';

/**
 * Python Executor
 * Executes Python code using the system Python interpreter
 */
export class PythonExecutor extends BaseExecutor {
  getLanguageId(): string {
    return 'python';
  }

  async execute(code: string, options: ExecutionOptions = {}): Promise<ExecutionResult> {
    const startTime = Date.now();
    const startMemory = this.memoryMonitor.getCurrentUsage();

    try {
      const result = await this.executePython(code, options);
      const executionTime = Date.now() - startTime;
      const memoryUsed = this.memoryMonitor.getCurrentUsage() - startMemory;

      return {
        output: result.output,
        logs: result.logs,
        errors: result.errors,
        variables: {},
        executionTime,
        memoryUsed,
        success: result.exitCode === 0,
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const memoryUsed = this.memoryMonitor.getCurrentUsage() - startMemory;

      this.addError(error.message, error.stack);

      return {
        output: null,
        logs: this.logs,
        errors: this.errors,
        variables: {},
        executionTime,
        memoryUsed,
        success: false,
      };
    }
  }

  private async executePython(
    code: string,
    options: ExecutionOptions
  ): Promise<{ output: string; logs: any[]; errors: any[]; exitCode: number }> {
    return new Promise((resolve, reject) => {
      const python = spawn('python3', ['-c', code], {
        timeout: options.timeout || 5000,
      });

      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
        this.addLog('log', data.toString());
      });

      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
        this.addError(data.toString());
      });

      python.on('close', (code) => {
        resolve({
          output: output.trim(),
          logs: this.logs,
          errors: this.errors,
          exitCode: code || 0,
        });
      });

      python.on('error', (error) => {
        reject(new Error(`Failed to execute Python: ${error.message}`));
      });
    });
  }
}

