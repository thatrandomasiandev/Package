export interface CoverageData {
  file: string;
  lines: {
    covered: number;
    total: number;
  };
  functions: {
    covered: number;
    total: number;
  };
  branches: {
    covered: number;
    total: number;
  };
}

export class CoverageAnalyzer {
  analyze(code: string, executedLines: Set<number>): CoverageData {
    const lines = code.split('\n');
    const totalLines = lines.filter(l => l.trim() && !l.trim().startsWith('//')).length;
    const coveredLines = Array.from(executedLines).filter(l => l <= lines.length).length;

    return {
      file: 'source.js',
      lines: {
        covered: coveredLines,
        total: totalLines,
      },
      functions: {
        covered: 0,
        total: 0,
      },
      branches: {
        covered: 0,
        total: 0,
      },
    };
  }

  calculatePercentage(coverage: CoverageData): number {
    if (coverage.lines.total === 0) return 0;
    return (coverage.lines.covered / coverage.lines.total) * 100;
  }
}

