import { TestResult } from './test-runner';

export class TestVisualizer {
  generateHTML(results: TestResult[]): string {
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const total = results.length;
    const passRate = ((passed / total) * 100).toFixed(1);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    .summary {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .summary h2 {
      margin-top: 0;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin-top: 15px;
    }
    .stat {
      padding: 10px 20px;
      border-radius: 4px;
      font-weight: 500;
    }
    .stat.passed {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .stat.failed {
      background: #ffebee;
      color: #c62828;
    }
    .test {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .test.passed {
      border-left: 4px solid #4caf50;
    }
    .test.failed {
      border-left: 4px solid #f44336;
    }
    .test-name {
      font-weight: 500;
    }
    .test-duration {
      color: #666;
      font-size: 0.9em;
    }
    .test-error {
      color: #f44336;
      font-size: 0.9em;
      margin-top: 10px;
      padding: 10px;
      background: #ffebee;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="summary">
    <h2>Test Results</h2>
    <div class="stats">
      <div class="stat passed">✓ ${passed} Passed</div>
      <div class="stat failed">✗ ${failed} Failed</div>
      <div class="stat">Total: ${total}</div>
      <div class="stat">Pass Rate: ${passRate}%</div>
    </div>
  </div>
  
  ${results.map(result => `
    <div class="test ${result.passed ? 'passed' : 'failed'}">
      <div>
        <div class="test-name">
          ${result.passed ? '✓' : '✗'} ${result.name}
        </div>
        ${result.error ? `<div class="test-error">${result.error.message}</div>` : ''}
      </div>
      <div class="test-duration">${result.duration}ms</div>
    </div>
  `).join('')}
</body>
</html>
    `;
  }
}

