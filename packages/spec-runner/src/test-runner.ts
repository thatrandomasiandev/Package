export interface TestCase {
  name: string;
  fn: () => void | Promise<void>;
  timeout?: number;
}

export interface TestResult {
  name: string;
  passed: boolean;
  error?: Error;
  duration: number;
}

export interface TestSuite {
  name: string;
  tests: TestCase[];
}

export class TestRunner {
  private tests: TestCase[] = [];
  private suites: TestSuite[] = [];

  test(name: string, fn: () => void | Promise<void>): void {
    this.tests.push({ name, fn });
  }

  describe(name: string, fn: () => void): void {
    const suite: TestSuite = { name, tests: [] };
    this.suites.push(suite);
    
    const originalTests = this.tests;
    this.tests = suite.tests;
    fn();
    this.tests = originalTests;
  }

  async run(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const test of this.tests) {
      const result = await this.runTest(test);
      results.push(result);
    }

    for (const suite of this.suites) {
      for (const test of suite.tests) {
        const result = await this.runTest(test);
        results.push({ ...result, name: `${suite.name} > ${result.name}` });
      }
    }

    return results;
  }

  private async runTest(test: TestCase): Promise<TestResult> {
    const startTime = Date.now();

    try {
      await Promise.race([
        test.fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Test timeout')), test.timeout || 5000)
        ),
      ]);

      return {
        name: test.name,
        passed: true,
        duration: Date.now() - startTime,
      };
    } catch (error: any) {
      return {
        name: test.name,
        passed: false,
        error,
        duration: Date.now() - startTime,
      };
    }
  }
}

export function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected ${actual} to be truthy`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected ${actual} to be falsy`);
      }
    },
  };
}

