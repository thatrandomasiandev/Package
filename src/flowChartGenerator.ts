import { CodeNode } from './codeParser';

export class FlowChartGenerator {
    generateFlowChart(ast: CodeNode, fileName: string): string {
        const nodes = this.extractFlowNodes(ast);
        const connections = this.extractConnections(ast);
        
        return this.generateHTML(nodes, connections, fileName, 'Flow Chart');
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

    private generateHTML(nodes: FlowNode[], connections: Connection[], fileName: string, title: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>${title} - ${fileName}</title>
    <script src="https://unpkg.com/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
        }
        .diagram-container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-height: 400px;
        }
        .mermaid {
            text-align: center;
        }
        .legend {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #667eea;
        }
        .legend h3 {
            margin-top: 0;
            color: #333;
        }
        .legend-item {
            display: inline-block;
            margin: 5px 15px 5px 0;
            font-size: 14px;
        }
        .legend-color {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 3px;
            margin-right: 8px;
            vertical-align: middle;
        }
        .error-message {
            background: #ffebee;
            color: #c62828;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #f44336;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>File: ${fileName}</p>
    </div>
    
    <div class="diagram-container">
        ${this.generateMermaidDiagram(nodes, connections)}
    </div>
    
    <div class="legend">
        <h3>Legend</h3>
        <div class="legend-item">
            <span class="legend-color" style="background-color: #4CAF50;"></span>
            Functions & Methods
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

    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
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
