import { ExecutionResult, ChartData } from './codeExecutor';

export class OutputGenerator {
    generateOutputHTML(result: ExecutionResult, code: string, languageId: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Code Lab Output</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"></script>
    <script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--vscode-font-family, 'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif);
            font-size: var(--vscode-font-size, 13px);
            font-weight: var(--vscode-font-weight, 400);
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background-color: var(--vscode-editor-background, #1e1e1e);
            color: var(--vscode-editor-foreground, #d4d4d4);
            overflow: hidden;
        }
        
        .webview-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        
        .header {
            background-color: var(--vscode-titleBar-activeBackground, #3c3c3c);
            border-bottom: 1px solid var(--vscode-titleBar-border, #2d2d30);
            padding: 8px 16px;
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header-left {
            display: flex;
            flex-direction: column;
        }
        
        .header-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--vscode-titleBar-activeForeground, #ffffff);
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .header-subtitle {
            font-size: 12px;
            color: var(--vscode-descriptionForeground, #cccccc);
            margin: 2px 0 0 0;
        }
        
        .execution-info {
            font-size: 11px;
            color: var(--vscode-descriptionForeground, #cccccc);
            display: flex;
            gap: 16px;
        }
        
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .output-panel {
            flex: 1;
            background-color: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            margin: 8px;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        
        .output-content {
            padding: 16px;
            height: 100%;
            overflow: auto;
        }
        
        .code-section {
            background-color: var(--vscode-textCodeBlock-background, #2d2d30);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 4px;
            margin-bottom: 16px;
            overflow: hidden;
        }
        
        .code-header {
            background-color: var(--vscode-panel-background, #252526);
            padding: 8px 12px;
            border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
            font-size: 11px;
            font-weight: 600;
            color: var(--vscode-foreground, #d4d4d4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .code-content {
            padding: 12px;
            font-family: var(--vscode-editor-font-family, 'Cascadia Code', 'Consolas', monospace);
            font-size: 12px;
            color: var(--vscode-editor-foreground, #d4d4d4);
            white-space: pre-wrap;
            background-color: var(--vscode-editor-background, #1e1e1e);
        }
        
        .output-section {
            margin-bottom: 16px;
        }
        
        .output-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 600;
            color: var(--vscode-foreground, #d4d4d4);
        }
        
        .output-icon {
            margin-right: 8px;
            font-size: 14px;
        }
        
        .console-output {
            background-color: var(--vscode-textCodeBlock-background, #2d2d30);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 4px;
            padding: 12px;
            font-family: var(--vscode-editor-font-family, 'Cascadia Code', 'Consolas', monospace);
            font-size: 12px;
            color: var(--vscode-editor-foreground, #d4d4d4);
            white-space: pre-wrap;
            min-height: 40px;
        }
        
        .error-output {
            background-color: var(--vscode-inputValidation-errorBackground, #5a1d1d);
            border: 1px solid var(--vscode-inputValidation-errorBorder, #be1100);
            color: var(--vscode-inputValidation-errorForeground, #f48771);
        }
        
        .chart-container {
            background-color: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 4px;
            margin-bottom: 16px;
            overflow: hidden;
        }
        
        .chart-header {
            background-color: var(--vscode-panel-background, #252526);
            padding: 12px;
            border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
            font-size: 13px;
            font-weight: 600;
            color: var(--vscode-foreground, #d4d4d4);
        }
        
        .chart-content {
            padding: 16px;
            height: 300px;
        }
        
        .variables-section {
            background-color: var(--vscode-panel-background, #252526);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 4px;
            margin-bottom: 16px;
        }
        
        .variables-header {
            padding: 12px;
            border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
            font-size: 13px;
            font-weight: 600;
            color: var(--vscode-foreground, #d4d4d4);
        }
        
        .variables-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            padding: 16px;
        }
        
        .variable-item {
            background-color: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            border-radius: 4px;
            padding: 12px;
        }
        
        .variable-name {
            font-weight: 600;
            color: var(--vscode-symbolIcon-variableForeground, #9cdcfe);
            margin-bottom: 4px;
        }
        
        .variable-value {
            font-family: var(--vscode-editor-font-family, 'Cascadia Code', 'Consolas', monospace);
            font-size: 11px;
            color: var(--vscode-editor-foreground, #d4d4d4);
            word-break: break-all;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--vscode-descriptionForeground, #cccccc);
        }
        
        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
        }
        
        .empty-state-text {
            font-size: 14px;
            line-height: 1.5;
        }
        
        /* VSCode scrollbar styling */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--vscode-scrollbarSlider-background, #2d2d30);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--vscode-scrollbarSlider-background, #464647);
            border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--vscode-scrollbarSlider-hoverBackground, #5a5d5e);
        }
    </style>
</head>
<body>
    <div class="webview-container">
        <div class="header">
            <div class="header-left">
                <div class="header-title">Code Lab Output</div>
                <div class="header-subtitle">Execution Results</div>
            </div>
            <div class="execution-info">
                <span>⏱️ ${result.executionTime}ms</span>
                <span>📊 ${result.charts ? result.charts.length : 0} charts</span>
                <span>🔢 ${Object.keys(result.variables).length} variables</span>
            </div>
        </div>
        
        <div class="content">
            <div class="output-panel">
                <div class="output-content">
                    ${this.generateCodeSection(code)}
                    ${this.generateOutputSection(result)}
                    ${this.generateChartsSection(result.charts)}
                    ${this.generateVariablesSection(result.variables)}
                </div>
            </div>
        </div>
    </div>

    <script>
        ${this.generateChartScripts(result.charts)}
    </script>
</body>
</html>`;
    }

    private generateCodeSection(code: string): string {
        return `
        <div class="code-section">
            <div class="code-header">📝 Executed Code</div>
            <div class="code-content">${this.escapeHtml(code)}</div>
        </div>
        `;
    }

    private generateOutputSection(result: ExecutionResult): string {
        if (result.error) {
            return `
            <div class="output-section">
                <div class="output-header">
                    <span class="output-icon">❌</span>
                    Error
                </div>
                <div class="console-output error-output">${this.escapeHtml(result.error)}</div>
            </div>
            `;
        }

        if (result.output) {
            return `
            <div class="output-section">
                <div class="output-header">
                    <span class="output-icon">📤</span>
                    Output
                </div>
                <div class="console-output">${this.escapeHtml(result.output)}</div>
            </div>
            `;
        }

        return `
        <div class="output-section">
            <div class="output-header">
                <span class="output-icon">✅</span>
                Execution Complete
            </div>
            <div class="console-output">Code executed successfully</div>
        </div>
        `;
    }

    private generateChartsSection(charts?: ChartData[]): string {
        if (!charts || charts.length === 0) {
            return '';
        }

        return charts.map((chart, index) => `
        <div class="chart-container">
            <div class="chart-header">📊 ${this.escapeHtml(chart.title)}</div>
            <div class="chart-content">
                <canvas id="chart-${index}" width="400" height="300"></canvas>
            </div>
        </div>
        `).join('');
    }

    private generateVariablesSection(variables: Record<string, any>): string {
        const variableEntries = Object.entries(variables);
        
        if (variableEntries.length === 0) {
            return `
            <div class="variables-section">
                <div class="variables-header">🔍 Variables</div>
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <div class="empty-state-text">No variables defined</div>
                </div>
            </div>
            `;
        }

        const variableItems = variableEntries.map(([name, value]: [string, any]) => `
        <div class="variable-item">
            <div class="variable-name">${this.escapeHtml(name)}</div>
            <div class="variable-value">${this.escapeHtml(this.formatValue(value))}</div>
        </div>
        `).join('');

        return `
        <div class="variables-section">
            <div class="variables-header">🔍 Variables (${variableEntries.length})</div>
            <div class="variables-grid">
                ${variableItems}
            </div>
        </div>
        `;
    }

    private generateChartScripts(charts?: ChartData[]): string {
        if (!charts || charts.length === 0) {
            return '';
        }

        return charts.map((chart, index) => {
            switch (chart.type) {
                case 'line':
                case 'bar':
                case 'pie':
                    return this.generateChartJSScript(chart, index);
                case 'scatter':
                case 'histogram':
                    return this.generatePlotlyScript(chart, index);
                default:
                    return '';
            }
        }).join('');
    }

    private generateChartJSScript(chart: ChartData, index: number): string {
        const config = {
            type: chart.type === 'line' ? 'line' : chart.type === 'bar' ? 'bar' : 'pie',
            data: this.processChartJSData(chart),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d4d4d4'
                        }
                    }
                },
                scales: chart.type !== 'pie' ? {
                    x: {
                        ticks: { color: '#d4d4d4' },
                        grid: { color: '#3c3c3c' }
                    },
                    y: {
                        ticks: { color: '#d4d4d4' },
                        grid: { color: '#3c3c3c' }
                    }
                } : undefined
            }
        };

        return `
        (function() {
            const ctx = document.getElementById('chart-${index}').getContext('2d');
            new Chart(ctx, ${JSON.stringify(config)});
        })();
        `;
    }

    private generatePlotlyScript(chart: ChartData, index: number): string {
        const data = this.processPlotlyData(chart);
        const layout = {
            title: chart.title,
            paper_bgcolor: '#1e1e1e',
            plot_bgcolor: '#1e1e1e',
            font: { color: '#d4d4d4' },
            xaxis: { color: '#d4d4d4' },
            yaxis: { color: '#d4d4d4' }
        };

        return `
        (function() {
            Plotly.newPlot('chart-${index}', ${JSON.stringify(data)}, ${JSON.stringify(layout)});
        })();
        `;
    }

    private processChartJSData(chart: ChartData): any {
        if (chart.type === 'pie') {
            return {
                labels: chart.data.map((item: any) => item.label),
                datasets: [{
                    data: chart.data.map((item: any) => item.value),
                    backgroundColor: this.generateColors(chart.data.length)
                }]
            };
        }

        return {
            labels: chart.data.map((item: any) => item.x),
            datasets: [{
                label: chart.title,
                data: chart.data.map((item: any) => item.y),
                borderColor: '#007acc',
                backgroundColor: chart.type === 'bar' ? '#007acc80' : undefined,
                fill: chart.type === 'line'
            }]
        };
    }

    private processPlotlyData(chart: ChartData): any {
        if (chart.type === 'scatter') {
            return [{
                x: chart.data.map((item: any) => item.x),
                y: chart.data.map((item: any) => item.y),
                mode: 'markers',
                type: 'scatter',
                marker: { color: '#007acc' }
            }];
        }

        if (chart.type === 'histogram') {
            return [{
                x: chart.data,
                type: 'histogram',
                marker: { color: '#007acc' }
            }];
        }

        return [];
    }

    private generateColors(count: number): string[] {
        const colors = ['#007acc', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#607D8B'];
        return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
    }

    private formatValue(value: any): string {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return `"${value}"`;
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'boolean') return value.toString();
        if (Array.isArray(value)) {
            if (value.length === 0) return '[]';
            if (value.length <= 5) return JSON.stringify(value);
            return `Array(${value.length})`;
        }
        if (typeof value === 'object') {
            const keys = Object.keys(value);
            if (keys.length === 0) return '{}';
            if (keys.length <= 3) return JSON.stringify(value);
            return `Object {${keys.slice(0, 3).join(', ')}...}`;
        }
        return String(value);
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
