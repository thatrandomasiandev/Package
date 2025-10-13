"""
Notebook Bridge - Production Jupyter Integration
Original implementation by Joshua Terranova
"""

__version__ = "1.0.0"
__author__ = "Joshua Terranova"

from .converter import JupyterConverter, NotebookCell

__all__ = [
    "JupyterConverter",
    "NotebookCell",
]
