export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

export interface ChartOptions {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
  title?: string;
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
}

export class ChartGenerator {
  generateChart(data: ChartData, options: ChartOptions): string {
    const { type, title, width = 800, height = 600, theme = 'light' } = options;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${theme === 'dark' ? '#1e1e1e' : '#ffffff'};
      color: ${theme === 'dark' ? '#ffffff' : '#000000'};
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .chart-container {
      position: relative;
      width: ${width}px;
      height: ${height}px;
    }
    h2 {
      text-align: center;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  ${title ? `<h2>${title}</h2>` : ''}
  <div class="chart-container">
    <canvas id="chart"></canvas>
  </div>
  
  <script>
    const ctx = document.getElementById('chart').getContext('2d');
    const data = ${JSON.stringify(data)};
    
    new Chart(ctx, {
      type: '${type}',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '${theme === 'dark' ? '#fff' : '#000'}'
            }
          }
        },
        scales: ${type !== 'pie' ? `{
          y: {
            beginAtZero: true,
            ticks: {
              color: '${theme === 'dark' ? '#fff' : '#000'}'
            },
            grid: {
              color: '${theme === 'dark' ? '#333' : '#eee'}'
            }
          },
          x: {
            ticks: {
              color: '${theme === 'dark' ? '#fff' : '#000'}'
            },
            grid: {
              color: '${theme === 'dark' ? '#333' : '#eee'}'
            }
          }
        }` : '{}'}
      }
    });
  </script>
</body>
</html>
    `;
  }

  generatePlotly(data: any, layout: any = {}): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    #plot {
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="plot"></div>
  
  <script>
    const data = ${JSON.stringify(data)};
    const layout = ${JSON.stringify(layout)};
    Plotly.newPlot('plot', data, layout, { responsive: true });
  </script>
</body>
</html>
    `;
  }
}

