# @code-lab/charts

Enhanced charting and data visualization for Code Lab.

## Features

- Chart.js integration for standard charts
- Plotly.js for advanced interactive plots
- Line, bar, pie, scatter, and area charts
- Support for execution result visualization
- Dark/light themes

## Installation

```bash
npm install @code-lab/charts
```

## Usage

```typescript
import { ChartGenerator } from '@code-lab/charts';

const generator = new ChartGenerator();

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 3, 5, 2],
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)'
  }]
};

const html = generator.generateChart(data, {
  type: 'line',
  title: 'Monthly Sales',
  theme: 'dark'
});
```

## License

MIT

