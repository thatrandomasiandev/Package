export interface PlotData {
  x: number[];
  y: number[];
  type: 'scatter' | 'bar' | 'line' | 'heatmap' | '3d';
  mode?: 'lines' | 'markers' | 'lines+markers';
  name?: string;
}

export interface PlotLayout {
  title?: string;
  xaxis?: { title?: string };
  yaxis?: { title?: string };
  width?: number;
  height?: number;
}

export function createLinePlot(x: number[], y: number[], options: Partial<PlotData> = {}): PlotData {
  return {
    x,
    y,
    type: 'scatter',
    mode: 'lines',
    ...options,
  };
}

export function createScatterPlot(x: number[], y: number[], options: Partial<PlotData> = {}): PlotData {
  return {
    x,
    y,
    type: 'scatter',
    mode: 'markers',
    ...options,
  };
}

export function createBarPlot(x: number[], y: number[], options: Partial<PlotData> = {}): PlotData {
  return {
    x,
    y,
    type: 'bar',
    ...options,
  };
}

