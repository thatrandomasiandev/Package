"""
Production-Quality Data Visualization
Integrates matplotlib and plotly for publication-quality charts
Original implementation by Joshua Terranova
"""

import io
import base64
from typing import List, Optional, Dict, Any, Tuple, Union
from dataclasses import dataclass
import json


@dataclass
class ChartConfig:
    """Configuration for chart generation"""
    title: Optional[str] = None
    xlabel: Optional[str] = None
    ylabel: Optional[str] = None
    width: int = 800
    height: int = 600
    theme: str = 'default'
    show_legend: bool = True
    show_grid: bool = True


class MatplotlibChart:
    """
    Production matplotlib chart generator
    """
    
    def __init__(self):
        self.config = ChartConfig()
        # Import matplotlib only when needed
        self.plt = None
        self.np = None
    
    def _ensure_imports(self):
        """Lazy import matplotlib and numpy"""
        if self.plt is None:
            try:
                import matplotlib
                matplotlib.use('Agg')  # Non-interactive backend
                import matplotlib.pyplot as plt
                import numpy as np
                self.plt = plt
                self.np = np
            except ImportError:
                raise ImportError("matplotlib and numpy are required. Install with: pip install matplotlib numpy")
    
    def line_chart(self, x: List, y: Union[List, List[List]], 
                   labels: Optional[List[str]] = None,
                   config: Optional[ChartConfig] = None) -> str:
        """
        Create a line chart
        Returns: base64 encoded PNG image
        """
        self._ensure_imports()
        config = config or self.config
        
        fig, ax = self.plt.subplots(figsize=(config.width/100, config.height/100))
        
        # Handle multiple lines
        if isinstance(y[0], list):
            for i, y_data in enumerate(y):
                label = labels[i] if labels and i < len(labels) else f'Series {i+1}'
                ax.plot(x, y_data, label=label, marker='o', linewidth=2)
        else:
            label = labels[0] if labels else 'Data'
            ax.plot(x, y, label=label, marker='o', linewidth=2)
        
        self._apply_style(ax, config)
        
        return self._fig_to_base64(fig)
    
    def bar_chart(self, categories: List[str], values: Union[List, List[List]],
                  labels: Optional[List[str]] = None,
                  config: Optional[ChartConfig] = None) -> str:
        """Create a bar chart"""
        self._ensure_imports()
        config = config or self.config
        
        fig, ax = self.plt.subplots(figsize=(config.width/100, config.height/100))
        
        x = self.np.arange(len(categories))
        
        # Handle grouped bars
        if isinstance(values[0], list):
            width = 0.8 / len(values)
            for i, vals in enumerate(values):
                label = labels[i] if labels and i < len(labels) else f'Group {i+1}'
                offset = width * i - (0.8 - width) / 2
                ax.bar(x + offset, vals, width, label=label)
        else:
            ax.bar(x, values, width=0.8)
        
        ax.set_xticks(x)
        ax.set_xticklabels(categories, rotation=45, ha='right')
        
        self._apply_style(ax, config)
        
        return self._fig_to_base64(fig)
    
    def scatter_plot(self, x: List, y: List, 
                     sizes: Optional[List] = None,
                     colors: Optional[List] = None,
                     config: Optional[ChartConfig] = None) -> str:
        """Create a scatter plot"""
        self._ensure_imports()
        config = config or self.config
        
        fig, ax = self.plt.subplots(figsize=(config.width/100, config.height/100))
        
        scatter_kwargs = {'alpha': 0.6}
        if sizes:
            scatter_kwargs['s'] = sizes
        if colors:
            scatter_kwargs['c'] = colors
            scatter_kwargs['cmap'] = 'viridis'
        
        scatter = ax.scatter(x, y, **scatter_kwargs)
        
        if colors:
            self.plt.colorbar(scatter, ax=ax)
        
        self._apply_style(ax, config)
        
        return self._fig_to_base64(fig)
    
    def pie_chart(self, labels: List[str], values: List[float],
                  config: Optional[ChartConfig] = None) -> str:
        """Create a pie chart"""
        self._ensure_imports()
        config = config or self.config
        
        fig, ax = self.plt.subplots(figsize=(config.width/100, config.height/100))
        
        ax.pie(values, labels=labels, autopct='%1.1f%%', 
               startangle=90, shadow=True)
        ax.axis('equal')
        
        if config.title:
            ax.set_title(config.title, fontsize=14, fontweight='bold')
        
        return self._fig_to_base64(fig)
    
    def histogram(self, data: List[float], bins: int = 30,
                  config: Optional[ChartConfig] = None) -> str:
        """Create a histogram"""
        self._ensure_imports()
        config = config or self.config
        
        fig, ax = self.plt.subplots(figsize=(config.width/100, config.height/100))
        
        ax.hist(data, bins=bins, alpha=0.7, edgecolor='black')
        
        self._apply_style(ax, config)
        
        return self._fig_to_base64(fig)
    
    def _apply_style(self, ax, config: ChartConfig):
        """Apply styling to axes"""
        if config.title:
            ax.set_title(config.title, fontsize=14, fontweight='bold')
        if config.xlabel:
            ax.set_xlabel(config.xlabel, fontsize=12)
        if config.ylabel:
            ax.set_ylabel(config.ylabel, fontsize=12)
        if config.show_legend:
            ax.legend()
        if config.show_grid:
            ax.grid(True, alpha=0.3)
        
        self.plt.tight_layout()
    
    def _fig_to_base64(self, fig) -> str:
        """Convert figure to base64 encoded PNG"""
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        self.plt.close(fig)
        return img_base64
    
    def save_chart(self, fig_data: str, filename: str):
        """Save base64 chart to file"""
        img_data = base64.b64decode(fig_data)
        with open(filename, 'wb') as f:
            f.write(img_data)


class PlotlyChart:
    """
    Production plotly chart generator for interactive plots
    """
    
    def __init__(self):
        self.config = ChartConfig()
        self.plotly = None
    
    def _ensure_import(self):
        """Lazy import plotly"""
        if self.plotly is None:
            try:
                import plotly.graph_objects as go
                import plotly.express as px
                self.go = go
                self.px = px
            except ImportError:
                raise ImportError("plotly is required. Install with: pip install plotly")
    
    def interactive_line(self, x: List, y: Union[List, List[List]],
                        labels: Optional[List[str]] = None,
                        config: Optional[ChartConfig] = None) -> str:
        """Create interactive line chart"""
        self._ensure_import()
        config = config or self.config
        
        fig = self.go.Figure()
        
        if isinstance(y[0], list):
            for i, y_data in enumerate(y):
                name = labels[i] if labels and i < len(labels) else f'Series {i+1}'
                fig.add_trace(self.go.Scatter(x=x, y=y_data, mode='lines+markers', name=name))
        else:
            name = labels[0] if labels else 'Data'
            fig.add_trace(self.go.Scatter(x=x, y=y, mode='lines+markers', name=name))
        
        fig.update_layout(
            title=config.title,
            xaxis_title=config.xlabel,
            yaxis_title=config.ylabel,
            hovermode='x unified',
            template='plotly_white',
            width=config.width,
            height=config.height
        )
        
        return fig.to_html(include_plotlyjs='cdn')
    
    def interactive_scatter(self, x: List, y: List,
                           text: Optional[List[str]] = None,
                           config: Optional[ChartConfig] = None) -> str:
        """Create interactive scatter plot"""
        self._ensure_import()
        config = config or self.config
        
        fig = self.go.Figure()
        
        scatter_kwargs = {'x': x, 'y': y, 'mode': 'markers'}
        if text:
            scatter_kwargs['text'] = text
            scatter_kwargs['hovertemplate'] = '%{text}<br>x: %{x}<br>y: %{y}'
        
        fig.add_trace(self.go.Scatter(**scatter_kwargs))
        
        fig.update_layout(
            title=config.title,
            xaxis_title=config.xlabel,
            yaxis_title=config.ylabel,
            template='plotly_white',
            width=config.width,
            height=config.height
        )
        
        return fig.to_html(include_plotlyjs='cdn')
    
    def interactive_3d_scatter(self, x: List, y: List, z: List,
                              config: Optional[ChartConfig] = None) -> str:
        """Create interactive 3D scatter plot"""
        self._ensure_import()
        config = config or self.config
        
        fig = self.go.Figure(data=[self.go.Scatter3d(
            x=x, y=y, z=z,
            mode='markers',
            marker=dict(size=5, color=z, colorscale='Viridis', showscale=True)
        )])
        
        fig.update_layout(
            title=config.title,
            scene=dict(
                xaxis_title=config.xlabel or 'X',
                yaxis_title=config.ylabel or 'Y',
                zaxis_title='Z'
            ),
            width=config.width,
            height=config.height
        )
        
        return fig.to_html(include_plotlyjs='cdn')


# Convenience function
def quick_plot(data: Dict[str, List], plot_type: str = 'line',
               title: Optional[str] = None) -> str:
    """
    Quick plotting function for common use cases
    
    Args:
        data: Dict with 'x' and 'y' keys
        plot_type: 'line', 'bar', 'scatter', 'pie'
        title: Chart title
    
    Returns:
        base64 encoded PNG
    """
    chart = MatplotlibChart()
    config = ChartConfig(title=title)
    
    if plot_type == 'line':
        return chart.line_chart(data['x'], data['y'], config=config)
    elif plot_type == 'bar':
        return chart.bar_chart(data['x'], data['y'], config=config)
    elif plot_type == 'scatter':
        return chart.scatter_plot(data['x'], data['y'], config=config)
    elif plot_type == 'pie':
        return chart.pie_chart(data['labels'], data['values'], config=config)
    else:
        raise ValueError(f"Unknown plot type: {plot_type}")

