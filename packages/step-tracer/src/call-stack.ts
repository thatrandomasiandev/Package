export interface StackFrame {
  name: string;
  file: string;
  line: number;
  column: number;
  variables: Record<string, any>;
}

export class CallStack {
  private frames: StackFrame[] = [];

  push(frame: StackFrame): void {
    this.frames.push(frame);
  }

  pop(): StackFrame | undefined {
    return this.frames.pop();
  }

  peek(): StackFrame | undefined {
    return this.frames[this.frames.length - 1];
  }

  getFrames(): StackFrame[] {
    return [...this.frames];
  }

  clear(): void {
    this.frames = [];
  }

  getDepth(): number {
    return this.frames.length;
  }

  getFrame(index: number): StackFrame | undefined {
    return this.frames[index];
  }
}

