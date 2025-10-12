import * as vscode from 'vscode';

export interface ExecutionResult {
    output: string;
    error?: string;
    variables: Record<string, any>;
    executionTime: number;
    charts?: ChartData[];
}

export interface ChartData {
    type: 'line' | 'bar' | 'pie' | 'scatter' | 'histogram';
    data: any;
    title: string;
    labels?: string[];
}

export class CodeExecutor {
    private variables: Record<string, any> = {};
    private charts: ChartData[] = [];
    private output: string[] = [];

    constructor() {
        // Initialize with safe environment
        this.variables = {};
        this.charts = [];
        this.output = [];
    }

    async executeCode(code: string, languageId: string): Promise<ExecutionResult> {
        const startTime = Date.now();
        let output = '';
        let error: string | undefined;
        this.charts = [];
        this.output = [];

        try {
            // For now, simulate code execution with mock results
            // In a real implementation, you'd use a proper JavaScript engine
            output = this.simulateExecution(code);
            
            // Mock some variables and charts for demo
            this.variables = {
                numbers: [1, 2, 3, 4, 5],
                result: 42,
                data: [{x: 1, y: 2}, {x: 2, y: 4}, {x: 3, y: 6}]
            };

        } catch (err) {
            error = err instanceof Error ? err.message : String(err);
        }

        const executionTime = Date.now() - startTime;

        return {
            output: output.trim(),
            error,
            variables: this.variables,
            executionTime,
            charts: this.charts.length > 0 ? this.charts : undefined
        };
    }

    private simulateExecution(code: string): string {
        // Simulate console.log outputs
        const lines = code.split('\n');
        const outputs: string[] = [];

        lines.forEach(line => {
            const trimmed = line.trim();
            
            // Simulate console.log
            if (trimmed.includes('console.log')) {
                const match = trimmed.match(/console\.log\(['"]([^'"]*)['"]\)/);
                if (match) {
                    outputs.push(match[1]);
                } else {
                    outputs.push('Logged output');
                }
            }
            
            // Simulate variable assignments
            if (trimmed.includes('const ') || trimmed.includes('let ') || trimmed.includes('var ')) {
                const match = trimmed.match(/(?:const|let|var)\s+(\w+)/);
                if (match) {
                    outputs.push(`Variable '${match[1]}' created`);
                }
            }
            
            // Simulate function definitions
            if (trimmed.includes('function ')) {
                const match = trimmed.match(/function\s+(\w+)/);
                if (match) {
                    outputs.push(`Function '${match[1]}' defined`);
                }
            }
        });

        return outputs.join('\n') || 'Code executed successfully';
    }

    private preprocessCode(code: string, languageId: string): string {
        // Add common imports and setup
        let processedCode = `
            // Common utilities
            const print = (...args) => console.log(...args);
            const len = (obj) => obj ? obj.length : 0;
            const range = (start, end) => Array.from({length: end - start}, (_, i) => start + i);
            
            // Data generation utilities
            const generateData = (n = 10) => Array.from({length: n}, (_, i) => Math.random() * 100);
            const generateTimeSeries = (n = 30) => Array.from({length: n}, (_, i) => ({x: i, y: Math.sin(i * 0.2) * 50 + 50}));
            
            // Chart creation helpers
            const createLineChart = (data, title = 'Line Chart') => plot(data, {title});
            const createBarChart = (data, title = 'Bar Chart') => barChart(data, {title});
            const createPieChart = (data, title = 'Pie Chart') => pieChart(data, {title});
            
            ${code}
        `;

        if (languageId === 'typescript') {
            // Simple TypeScript to JavaScript conversion
            processedCode = processedCode
                .replace(/:\s*\w+/g, '') // Remove type annotations
                .replace(/interface\s+\w+\s*\{[^}]*\}/g, '') // Remove interfaces
                .replace(/type\s+\w+\s*=/g, 'const ') // Convert type aliases
                .replace(/export\s+/g, '') // Remove exports
                .replace(/import\s+.*?from\s+['"].*?['"];?/g, ''); // Remove imports
        }

        return processedCode;
    }

    private handleConsoleLog(args: any[]): void {
        const message = args.map(arg => this.formatValue(arg)).join(' ');
        console.log('[Code Lab]', message);
    }

    private handleConsoleError(args: any[]): void {
        const message = args.map(arg => this.formatValue(arg)).join(' ');
        console.error('[Code Lab Error]', message);
    }

    private handleConsoleWarn(args: any[]): void {
        const message = args.map(arg => this.formatValue(arg)).join(' ');
        console.warn('[Code Lab Warning]', message);
    }

    private createChart(type: ChartData['type'], data: any, options: any = {}): void {
        const chart: ChartData = {
            type,
            data: this.processChartData(data, type),
            title: options.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
            labels: options.labels
        };
        this.charts.push(chart);
    }

    private processChartData(data: any, type: ChartData['type']): any {
        if (Array.isArray(data)) {
            switch (type) {
                case 'line':
                case 'scatter':
                    return data.map((item, index) => ({
                        x: typeof item === 'number' ? index : (item.x || item[0]),
                        y: typeof item === 'number' ? item : (item.y || item[1])
                    }));
                case 'bar':
                    return data.map((item, index) => ({
                        x: typeof item === 'object' ? (item.label || index) : index,
                        y: typeof item === 'number' ? item : (item.value || item)
                    }));
                case 'pie':
                    return data.map((item, index) => ({
                        label: typeof item === 'object' ? (item.label || `Item ${index}`) : `Item ${index}`,
                        value: typeof item === 'number' ? item : (item.value || item)
                    }));
                case 'histogram':
                    return data;
                default:
                    return data;
            }
        }
        return data;
    }

    private formatValue(value: any): string {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'boolean') return value.toString();
        if (value instanceof Date) return value.toISOString();
        if (Array.isArray(value)) {
            if (value.length === 0) return '[]';
            if (value.length <= 10) return JSON.stringify(value, null, 2);
            return `Array(${value.length}) [${value.slice(0, 5).join(', ')}...]`;
        }
        if (typeof value === 'object') {
            try {
                const keys = Object.keys(value);
                if (keys.length === 0) return '{}';
                if (keys.length <= 5) return JSON.stringify(value, null, 2);
                return `Object {${keys.slice(0, 3).join(', ')}...}`;
            } catch {
                return '[Object]';
            }
        }
        return String(value);
    }

    getVariables(): Record<string, any> {
        return { ...this.variables };
    }

    clearVariables(): void {
        this.variables = {};
        this.charts = [];
    }
}
