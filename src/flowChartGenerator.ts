import { CodeNode } from './codeParser';

export class FlowChartGenerator {
    generateFlowChart(ast: CodeNode, fileName: string, startLine?: number, endLine?: number): string {
        const nodes = this.extractFlowNodes(ast);
        const connections = this.extractConnections(ast);
        
        return this.generateHTML(nodes, connections, fileName, 'Code Flow Chart', startLine, endLine);
    }

    private extractFlowNodes(ast: CodeNode): FlowNode[] {
        const nodes: FlowNode[] = [];
        let nodeId = 0;

        const traverse = (node: CodeNode, parentId?: string) => {
            const currentNode: FlowNode = {
                id: `node_${nodeId++}`,
                label: this.getNodeLabel(node),
                type: this.getNodeType(node),
                shape: this.getNodeShape(node),
                color: this.getNodeColor(node),
                parentId
            };

            nodes.push(currentNode);

            node.children.forEach(child => {
                traverse(child, currentNode.id);
            });
        };

        traverse(ast);
        return nodes;
    }

    private extractConnections(ast: CodeNode): Connection[] {
        const connections: Connection[] = [];
        let nodeId = 0;

        const traverse = (node: CodeNode, parentId?: string) => {
            const currentNodeId = `node_${nodeId++}`;

            if (parentId) {
                connections.push({
                    from: parentId,
                    to: currentNodeId,
                    label: this.getConnectionLabel(node, parentId)
                });
            }

            node.children.forEach(child => {
                traverse(child, currentNodeId);
            });
        };

        traverse(ast);
        return connections;
    }

    private getNodeLabel(node: CodeNode): string {
        switch (node.type) {
            case 'function':
                return `${node.name}(${node.parameters?.join(', ') || ''})`;
            case 'class':
                return `Class: ${node.name}`;
            case 'method':
                return `${node.name}(${node.parameters?.join(', ') || ''})`;
            case 'variable':
                return `${node.name}${node.value ? ` = ${node.value}` : ''}`;
            case 'condition':
                return 'If Statement';
            case 'loop':
                return node.name || 'Loop';
            case 'return':
                return `Return${node.value ? `: ${node.value}` : ''}`;
            case 'block':
                return 'Code Block';
            case 'program':
                return 'Program';
            default:
                return node.name || node.type;
        }
    }

    private getNodeType(node: CodeNode): string {
        return node.type;
    }

    private getNodeShape(node: CodeNode): string {
        switch (node.type) {
            case 'function':
            case 'method':
                return 'rectangle';
            case 'class':
                return 'cylinder';
            case 'condition':
                return 'diamond';
            case 'loop':
                return 'hexagon';
            case 'return':
                return 'circle';
            case 'variable':
                return 'ellipse';
            default:
                return 'rectangle';
        }
    }

    private getNodeColor(node: CodeNode): string {
        switch (node.type) {
            case 'function':
            case 'method':
                return '#4CAF50';
            case 'class':
                return '#2196F3';
            case 'condition':
                return '#FF9800';
            case 'loop':
                return '#9C27B0';
            case 'return':
                return '#F44336';
            case 'variable':
                return '#607D8B';
            default:
                return '#E0E0E0';
        }
    }

    private getConnectionLabel(node: CodeNode, parentId: string): string {
        if (node.type === 'condition') {
            return 'condition';
        }
        return '';
    }

    private generateHTML(nodes: FlowNode[], connections: Connection[], fileName: string, title: string, startLine?: number, endLine?: number): string {
        const lineRange = startLine && endLine ? `Lines ${startLine}-${endLine}` : '';
        
        return `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <script src="https://unpkg.com/mermaid@10.6.1/dist/mermaid.min.js"></script>
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
        
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .diagram-panel {
            flex: 1;
            background-color: var(--vscode-editor-background, #1e1e1e);
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
            margin: 8px;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        
        .diagram-content {
            padding: 16px;
            height: 100%;
            overflow: auto;
        }
        
        .mermaid {
            background: var(--vscode-editor-background, #1e1e1e);
            border-radius: 4px;
            padding: 16px;
        }
        
        .legend-panel {
            background-color: var(--vscode-panel-background, #252526);
            border-top: 1px solid var(--vscode-panel-border, #3c3c3c);
            padding: 12px 16px;
            flex-shrink: 0;
        }
        
        .legend-title {
            font-size: 12px;
            font-weight: 600;
            color: var(--vscode-foreground, #d4d4d4);
            margin: 0 0 8px 0;
        }
        
        .legend-items {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            font-size: 11px;
            color: var(--vscode-foreground, #d4d4d4);
        }
        
        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            margin-right: 6px;
            border: 1px solid var(--vscode-panel-border, #3c3c3c);
        }
        
        .error-message {
            background-color: var(--vscode-inputValidation-errorBackground, #5a1d1d);
            color: var(--vscode-inputValidation-errorForeground, #f48771);
            border: 1px solid var(--vscode-inputValidation-errorBorder, #be1100);
            padding: 12px;
            border-radius: 4px;
            margin: 16px;
            font-size: 12px;
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
            <div class="header-title">${title}</div>
            <div class="header-subtitle">${fileName}${lineRange ? ` • ${lineRange}` : ''}</div>
        </div>
        
        <div class="content">
            <div class="diagram-panel">
                <div class="diagram-content">
                    ${this.generateMermaidDiagram(nodes, connections)}
                </div>
            </div>
            
            <div class="legend-panel">
                <div class="legend-title">Legend</div>
                <div class="legend-items">
                    <div class="legend-item">
                        <span class="legend-color" style="background-color: #4CAF50;"></span>
                        Functions
                    </div>
                    <div class="legend-item">
                        <span class="legend-color" style="background-color: #2196F3;"></span>
                        Classes
                    </div>
                    <div class="legend-item">
                        <span class="legend-color" style="background-color: #FF9800;"></span>
                        Conditions
                    </div>
                    <div class="legend-item">
                        <span class="legend-color" style="background-color: #9C27B0;"></span>
                        Loops
                    </div>
                    <div class="legend-item">
                        <span class="legend-color" style="background-color: #607D8B;"></span>
                        Variables
                    </div>
                    <div class="legend-item">
                        <span class="legend-color" style="background-color: #F44336;"></span>
                        Returns
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            },
            themeVariables: {
                primaryColor: '#007acc',
                primaryTextColor: '#d4d4d4',
                primaryBorderColor: '#3c3c3c',
                lineColor: '#3c3c3c',
                sectionBkgColor: '#2d2d30',
                altSectionBkgColor: '#252526',
                gridColor: '#3c3c3c',
                secondaryColor: '#007acc',
                tertiaryColor: '#1e1e1e'
            }
        });
    </script>
</body>
</html>`;
    }

    private generateMermaidDiagram(nodes: FlowNode[], connections: Connection[]): string {
        if (nodes.length === 0) {
            return '<div class="error-message">No code elements found to visualize.</div>';
        }

        let mermaidCode = 'flowchart TD\n';
        
        // Generate node definitions
        nodes.forEach(node => {
            const shape = this.getMermaidShape(node.shape);
            const label = this.escapeMermaidText(node.label);
            mermaidCode += `    ${node.id}[${label}]:::${node.type}\n`;
        });

        // Generate connections
        connections.forEach(conn => {
            const label = conn.label ? `|${conn.label}|` : '';
            mermaidCode += `    ${conn.from} -->${label} ${conn.to}\n`;
        });

        // Add custom styles
        mermaidCode += '\n    classDef function fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff\n';
        mermaidCode += '    classDef method fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff\n';
        mermaidCode += '    classDef class fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff\n';
        mermaidCode += '    classDef condition fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff\n';
        mermaidCode += '    classDef loop fill:#9C27B0,stroke:#4A148C,stroke-width:2px,color:#fff\n';
        mermaidCode += '    classDef return fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff\n';
        mermaidCode += '    classDef variable fill:#607D8B,stroke:#37474F,stroke-width:2px,color:#fff\n';
        mermaidCode += '    classDef block fill:#E0E0E0,stroke:#9E9E9E,stroke-width:2px,color:#000\n';
        mermaidCode += '    classDef program fill:#795548,stroke:#3E2723,stroke-width:3px,color:#fff\n';

        return `<div class="mermaid">${mermaidCode}</div>`;
    }

    private getMermaidShape(shape: string): string {
        switch (shape) {
            case 'diamond': return '{{}}';
            case 'circle': return '(())';
            case 'cylinder': return '[()]';
            case 'hexagon': return '{{}}';
            case 'ellipse': return '([[]])';
            default: return '[]';
        }
    }

    private escapeMermaidText(text: string): string {
        return text.replace(/[{}[\]()]/g, '\\$&').replace(/"/g, '&quot;');
    }
}

interface FlowNode {
    id: string;
    label: string;
    type: string;
    shape: string;
    color: string;
    parentId?: string;
}

interface Connection {
    from: string;
    to: string;
    label?: string;
}
