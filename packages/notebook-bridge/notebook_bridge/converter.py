"""
Production Jupyter Notebook Integration
Uses nbformat for proper notebook handling
Original implementation by Joshua Terranova
"""

import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass


@dataclass
class NotebookCell:
    """Represents a notebook cell"""
    cell_type: str  # 'code', 'markdown', 'raw'
    source: List[str]
    outputs: Optional[List[Dict]] = None
    execution_count: Optional[int] = None
    metadata: Optional[Dict] = None


class JupyterConverter:
    """
    Production Jupyter notebook converter using nbformat
    """
    
    def __init__(self):
        self.nbformat = None
        self._ensure_import()
    
    def _ensure_import(self):
        """Lazy import nbformat"""
        if self.nbformat is None:
            try:
                import nbformat
                self.nbformat = nbformat
            except ImportError:
                raise ImportError("nbformat is required. Install with: pip install nbformat")
    
    def read_notebook(self, filepath: str) -> Dict[str, Any]:
        """
        Read a Jupyter notebook file
        
        Args:
            filepath: Path to .ipynb file
        
        Returns:
            Parsed notebook as dictionary
        """
        with open(filepath, 'r', encoding='utf-8') as f:
            notebook = self.nbformat.read(f, as_version=4)
        return notebook
    
    def write_notebook(self, notebook: Dict[str, Any], filepath: str):
        """
        Write a notebook to file
        
        Args:
            notebook: Notebook dictionary
            filepath: Output path
        """
        with open(filepath, 'w', encoding='utf-8') as f:
            self.nbformat.write(notebook, f)
    
    def create_notebook(self, cells: Optional[List[NotebookCell]] = None) -> Dict[str, Any]:
        """
        Create a new notebook
        
        Args:
            cells: List of NotebookCell objects
        
        Returns:
            New notebook dictionary
        """
        nb = self.nbformat.v4.new_notebook()
        
        if cells:
            for cell in cells:
                if cell.cell_type == 'code':
                    nb_cell = self.nbformat.v4.new_code_cell(
                        source=''.join(cell.source),
                        execution_count=cell.execution_count,
                        metadata=cell.metadata or {}
                    )
                    if cell.outputs:
                        nb_cell['outputs'] = cell.outputs
                elif cell.cell_type == 'markdown':
                    nb_cell = self.nbformat.v4.new_markdown_cell(
                        source=''.join(cell.source),
                        metadata=cell.metadata or {}
                    )
                else:  # raw
                    nb_cell = self.nbformat.v4.new_raw_cell(
                        source=''.join(cell.source),
                        metadata=cell.metadata or {}
                    )
                
                nb.cells.append(nb_cell)
        
        return nb
    
    def to_python(self, notebook_path: str, output_path: Optional[str] = None) -> str:
        """
        Convert notebook to Python script
        
        Args:
            notebook_path: Path to .ipynb file
            output_path: Optional output path for .py file
        
        Returns:
            Python code as string
        """
        notebook = self.read_notebook(notebook_path)
        
        python_code = []
        python_code.append("# Converted from Jupyter Notebook")
        python_code.append("# Original file: " + notebook_path)
        python_code.append("")
        
        for cell in notebook.cells:
            if cell.cell_type == 'code':
                source = cell.source
                if isinstance(source, list):
                    source = ''.join(source)
                python_code.append(source)
                python_code.append("")
            elif cell.cell_type == 'markdown':
                # Convert markdown to comments
                source = cell.source
                if isinstance(source, list):
                    source = ''.join(source)
                for line in source.split('\n'):
                    python_code.append(f"# {line}")
                python_code.append("")
        
        result = '\n'.join(python_code)
        
        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(result)
        
        return result
    
    def from_python(self, python_path: str, output_path: Optional[str] = None) -> Dict[str, Any]:
        """
        Convert Python script to notebook
        
        Args:
            python_path: Path to .py file
            output_path: Optional output path for .ipynb file
        
        Returns:
            Notebook dictionary
        """
        with open(python_path, 'r', encoding='utf-8') as f:
            code = f.read()
        
        # Split by cells (simple heuristic: split on # %% or # <codecell>)
        cells = []
        current_cell = []
        cell_type = 'code'
        
        for line in code.split('\n'):
            if line.startswith('# %%') or line.startswith('# <codecell>'):
                if current_cell:
                    cells.append(NotebookCell(
                        cell_type=cell_type,
                        source=['\n'.join(current_cell) + '\n']
                    ))
                    current_cell = []
            elif line.startswith('# <markdowncell>'):
                if current_cell:
                    cells.append(NotebookCell(
                        cell_type=cell_type,
                        source=['\n'.join(current_cell) + '\n']
                    ))
                    current_cell = []
                cell_type = 'markdown'
            else:
                current_cell.append(line)
        
        # Add last cell
        if current_cell:
            cells.append(NotebookCell(
                cell_type=cell_type,
                source=['\n'.join(current_cell) + '\n']
            ))
        
        # If no cell markers, treat entire file as one code cell
        if not cells:
            cells = [NotebookCell(
                cell_type='code',
                source=[code]
            )]
        
        notebook = self.create_notebook(cells)
        
        if output_path:
            self.write_notebook(notebook, output_path)
        
        return notebook
    
    def extract_code_cells(self, notebook_path: str) -> List[str]:
        """
        Extract all code cells from a notebook
        
        Args:
            notebook_path: Path to .ipynb file
        
        Returns:
            List of code cell contents
        """
        notebook = self.read_notebook(notebook_path)
        
        code_cells = []
        for cell in notebook.cells:
            if cell.cell_type == 'code':
                source = cell.source
                if isinstance(source, list):
                    source = ''.join(source)
                code_cells.append(source)
        
        return code_cells
    
    def get_cell_outputs(self, notebook_path: str) -> List[Dict[str, Any]]:
        """
        Extract outputs from all code cells
        
        Args:
            notebook_path: Path to .ipynb file
        
        Returns:
            List of outputs
        """
        notebook = self.read_notebook(notebook_path)
        
        all_outputs = []
        for i, cell in enumerate(notebook.cells):
            if cell.cell_type == 'code' and hasattr(cell, 'outputs'):
                all_outputs.append({
                    'cell_index': i,
                    'execution_count': cell.execution_count,
                    'outputs': cell.outputs
                })
        
        return all_outputs
    
    def clear_outputs(self, notebook_path: str, output_path: Optional[str] = None):
        """
        Clear all outputs from a notebook
        
        Args:
            notebook_path: Path to .ipynb file
            output_path: Output path (if None, overwrites original)
        """
        notebook = self.read_notebook(notebook_path)
        
        for cell in notebook.cells:
            if cell.cell_type == 'code':
                cell.outputs = []
                cell.execution_count = None
        
        output_path = output_path or notebook_path
        self.write_notebook(notebook, output_path)
    
    def merge_notebooks(self, notebook_paths: List[str], output_path: str):
        """
        Merge multiple notebooks into one
        
        Args:
            notebook_paths: List of paths to .ipynb files
            output_path: Output path for merged notebook
        """
        merged_cells = []
        
        for path in notebook_paths:
            notebook = self.read_notebook(path)
            
            # Add markdown cell with filename
            merged_cells.append(NotebookCell(
                cell_type='markdown',
                source=[f"# From: {path}\n"]
            ))
            
            # Add all cells from this notebook
            for cell in notebook.cells:
                source = cell.source
                if isinstance(source, list):
                    source = source
                else:
                    source = [source]
                
                merged_cells.append(NotebookCell(
                    cell_type=cell.cell_type,
                    source=source,
                    outputs=getattr(cell, 'outputs', None),
                    execution_count=getattr(cell, 'execution_count', None),
                    metadata=getattr(cell, 'metadata', {})
                ))
        
        merged_notebook = self.create_notebook(merged_cells)
        self.write_notebook(merged_notebook, output_path)
    
    def get_metadata(self, notebook_path: str) -> Dict[str, Any]:
        """Get notebook metadata"""
        notebook = self.read_notebook(notebook_path)
        return {
            'nbformat': notebook.nbformat,
            'nbformat_minor': notebook.nbformat_minor,
            'metadata': notebook.metadata,
            'cell_count': len(notebook.cells),
            'code_cells': sum(1 for c in notebook.cells if c.cell_type == 'code'),
            'markdown_cells': sum(1 for c in notebook.cells if c.cell_type == 'markdown'),
        }

