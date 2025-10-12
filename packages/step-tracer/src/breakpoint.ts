export interface Breakpoint {
  line: number;
  condition?: string;
  enabled: boolean;
  hitCount?: number;
}

export class BreakpointManager {
  private breakpoints: Map<string, Breakpoint[]> = new Map();

  add(file: string, breakpoint: Breakpoint): void {
    if (!this.breakpoints.has(file)) {
      this.breakpoints.set(file, []);
    }
    this.breakpoints.get(file)!.push(breakpoint);
  }

  remove(file: string, line: number): void {
    const fileBreakpoints = this.breakpoints.get(file);
    if (fileBreakpoints) {
      this.breakpoints.set(
        file,
        fileBreakpoints.filter(bp => bp.line !== line)
      );
    }
  }

  getBreakpoints(file: string): Breakpoint[] {
    return this.breakpoints.get(file) || [];
  }

  getAllBreakpoints(): Map<string, Breakpoint[]> {
    return new Map(this.breakpoints);
  }

  clear(file?: string): void {
    if (file) {
      this.breakpoints.delete(file);
    } else {
      this.breakpoints.clear();
    }
  }

  hasBreakpoint(file: string, line: number): boolean {
    const fileBreakpoints = this.breakpoints.get(file);
    return fileBreakpoints?.some(bp => bp.line === line && bp.enabled) || false;
  }
}

