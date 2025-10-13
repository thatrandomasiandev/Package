"""
Data Pulse - Production Data Visualization
Original implementation by Joshua Terranova
"""

__version__ = "1.0.0"
__author__ = "Joshua Terranova"

from .visualizer import (
    MatplotlibChart,
    PlotlyChart,
    ChartConfig,
    quick_plot
)

__all__ = [
    "MatplotlibChart",
    "PlotlyChart",
    "ChartConfig",
    "quick_plot",
]
