import { Breakpoint } from './breakpoint';

export enum DebuggerState {
  Running = 'running',
  Paused = 'paused',
  Stopped = 'stopped',
}

export interface DebuggerOptions {
  breakpoints?: Breakpoint[];
}

export class Debugger {
  private state: DebuggerState = DebuggerState.Stopped;
  private breakpoints: Breakpoint[] = [];
  private currentLine: number = 0;
  private variables: Map<string, any> = new Map();

  constructor(options: DebuggerOptions = {}) {
    if (options.breakpoints) {
      this.breakpoints = options.breakpoints;
    }
  }

  addBreakpoint(line: number, condition?: string): void {
    this.breakpoints.push({ line, condition, enabled: true });
  }

  removeBreakpoint(line: number): void {
    this.breakpoints = this.breakpoints.filter(bp => bp.line !== line);
  }

  toggleBreakpoint(line: number): void {
    const bp = this.breakpoints.find(bp => bp.line === line);
    if (bp) {
      bp.enabled = !bp.enabled;
    }
  }

  stepOver(): void {
    if (this.state !== DebuggerState.Paused) return;
    this.currentLine++;
    this.checkBreakpoint();
  }

  stepInto(): void {
    if (this.state !== DebuggerState.Paused) return;
    this.currentLine++;
    this.checkBreakpoint();
  }

  stepOut(): void {
    if (this.state !== DebuggerState.Paused) return;
    // Move to end of current function
    this.currentLine++;
    this.checkBreakpoint();
  }

  continue(): void {
    this.state = DebuggerState.Running;
  }

  pause(): void {
    this.state = DebuggerState.Paused;
  }

  stop(): void {
    this.state = DebuggerState.Stopped;
    this.currentLine = 0;
    this.variables.clear();
  }

  getState(): DebuggerState {
    return this.state;
  }

  getCurrentLine(): number {
    return this.currentLine;
  }

  getVariables(): Record<string, any> {
    return Object.fromEntries(this.variables);
  }

  setVariable(name: string, value: any): void {
    this.variables.set(name, value);
  }

  private checkBreakpoint(): void {
    const bp = this.breakpoints.find(
      bp => bp.enabled && bp.line === this.currentLine
    );
    
    if (bp) {
      if (!bp.condition || this.evaluateCondition(bp.condition)) {
        this.pause();
      }
    }
  }

  private evaluateCondition(condition: string): boolean {
    try {
      // Simple condition evaluation
      // In production, use a proper expression evaluator
      return eval(condition);
    } catch {
      return false;
    }
  }
}

