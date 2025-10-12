/**
 * Jupyter notebook integration for Code Lab
 * Original implementation by Joshua Terranova
 */

export interface JupyterCell {
  cellType: 'code' | 'markdown';
  source: string[];
  outputs?: any[];
  executionCount?: number | null;
}

export interface JupyterNotebook {
  cells: JupyterCell[];
  metadata: Record<string, any>;
  nbformat: number;
  nbformatMinor: number;
}

export class JupyterConverter {
  parseNotebook(json: string): JupyterNotebook {
    return JSON.parse(json);
  }

  toCodeLabFormat(notebook: JupyterNotebook): string {
    return notebook.cells
      .map(cell => {
        if (cell.cellType === 'code') {
          return `// Code Cell ${cell.executionCount || ''}\n${cell.source.join('\n')}`;
        } else {
          return `/* Markdown\n${cell.source.join('\n')}\n*/`;
        }
      })
      .join('\n\n');
  }

  fromCodeLabFormat(code: string): JupyterNotebook {
    const cells: JupyterCell[] = [{
      cellType: 'code',
      source: code.split('\n'),
      executionCount: null,
    }];

    return {
      cells,
      metadata: { kernelspec: { name: 'javascript', display_name: 'JavaScript' } },
      nbformat: 4,
      nbformatMinor: 5,
    };
  }
}
