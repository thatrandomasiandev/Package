import { CodeNode } from './codeParser';

export class StructureGenerator {
    generateStructure(ast: CodeNode, fileName: string): string {
        const structureData = this.buildStructureTree(ast);
        return this.generateHTML(structureData, fileName);
    }

    private buildStructureTree(node: CodeNode): StructureNode {
        const structureNode: StructureNode = {
            id: this.generateId(),
            text: this.getDisplayText(node),
            type: node.type,
            icon: this.getIcon(node.type),
            children: node.children.map(child => this.buildStructureTree(child)),
            line: node.line,
            details: this.getDetails(node)
        };

        return structureNode;
    }

    private getDisplayText(node: CodeNode): string {
        switch (node.type) {
            case 'function':
                return `${node.name}(${node.parameters?.join(', ') || ''})`;
            case 'method':
                return `${node.name}(${node.parameters?.join(', ') || ''})`;
            case 'class':
                return `class ${node.name}`;
            case 'variable':
                return `${node.name}${node.value ? ` = ${node.value}` : ''}`;
            case 'condition':
                return 'if statement';
            case 'loop':
                return node.name || 'loop';
            case 'return':
                return `return${node.value ? ` ${node.value}` : ''}`;
            case 'block':
                return 'code block';
            case 'program':
                return 'Program';
            default:
                return node.name || node.type;
        }
    }

    private getIcon(type: string): string {
        switch (type) {
            case 'function':
            case 'method':
                return '🔧';
            case 'class':
                return '📦';
            case 'variable':
                return '📝';
            case 'condition':
                return '❓';
            case 'loop':
                return '🔄';
            case 'return':
                return '↩️';
            case 'block':
                return '📋';
            case 'program':
                return '📁';
            default:
                return '📄';
        }
    }

    private getDetails(node: CodeNode): string[] {
        const details: string[] = [];
        
        if (node.line) {
            details.push(`Line ${node.line}`);
        }
        
        if (node.parameters && node.parameters.length > 0) {
            details.push(`Parameters: ${node.parameters.length}`);
        }
        
        if (node.children.length > 0) {
            details.push(`Children: ${node.children.length}`);
        }
        
        if (node.value) {
            details.push(`Value: ${node.value}`);
        }
        
        return details;
    }

    private generateId(): string {
        return 'node_' + Math.random().toString(36).substr(2, 9);
    }

    private generateHTML(structureData: StructureNode, fileName: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Code Structure - ${fileName}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/themes/default/style.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/jstree.min.js"></script>
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
        .structure-container {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-height: 400px;
        }
        .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
            min-width: 120px;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .stat-label {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .jstree-default .jstree-anchor {
            font-size: 14px;
            line-height: 20px;
        }
        .jstree-default .jstree-icon {
            width: 16px;
            height: 16px;
        }
        .type-function { color: #4CAF50; }
        .type-method { color: #4CAF50; }
        .type-class { color: #2196F3; }
        .type-variable { color: #607D8B; }
        .type-condition { color: #FF9800; }
        .type-loop { color: #9C27B0; }
        .type-return { color: #F44336; }
        .type-block { color: #9E9E9E; }
        .type-program { color: #795548; }
        .details-panel {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 15px;
            margin-top: 20px;
            display: none;
        }
        .details-panel h4 {
            margin-top: 0;
            color: #333;
        }
        .details-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .details-list li {
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }
        .details-list li:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Code Structure</h1>
        <p>File: ${fileName}</p>
    </div>
    
    <div class="structure-container">
        <div class="stats">
            ${this.generateStats(structureData)}
        </div>
        
        <div id="code-structure-tree"></div>
        
        <div class="details-panel" id="details-panel">
            <h4>Details</h4>
            <ul class="details-list" id="details-list"></ul>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            const treeData = ${JSON.stringify(this.convertToJsTreeFormat(structureData))};
            
            $('#code-structure-tree').jstree({
                'core': {
                    'data': treeData,
                    'themes': {
                        'responsive': true,
                        'dots': true,
                        'icons': true
                    }
                },
                'plugins': ['wholerow', 'state']
            }).on('select_node.jstree', function(e, data) {
                const node = data.node;
                const details = node.data.details || [];
                const line = node.data.line;
                
                if (details.length > 0 || line) {
                    let detailsHtml = '';
                    if (line) {
                        detailsHtml += '<li><strong>Line:</strong> ' + line + '</li>';
                    }
                    details.forEach(detail => {
                        detailsHtml += '<li>' + detail + '</li>';
                    });
                    $('#details-list').html(detailsHtml);
                    $('#details-panel').show();
                } else {
                    $('#details-panel').hide();
                }
            });
        });
    </script>
</body>
</html>`;
    }

    private generateStats(structureData: StructureNode): string {
        const stats = this.calculateStats(structureData);
        
        return `
            <div class="stat-card">
                <div class="stat-number">${stats.totalNodes}</div>
                <div class="stat-label">Total Elements</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.functions}</div>
                <div class="stat-label">Functions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.classes}</div>
                <div class="stat-label">Classes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.variables}</div>
                <div class="stat-label">Variables</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.maxDepth}</div>
                <div class="stat-label">Max Depth</div>
            </div>
        `;
    }

    private calculateStats(node: StructureNode): any {
        let totalNodes = 1;
        let functions = 0;
        let classes = 0;
        let variables = 0;
        let maxDepth = 1;

        const traverse = (n: StructureNode, depth: number = 1) => {
            maxDepth = Math.max(maxDepth, depth);
            
            switch (n.type) {
                case 'function':
                case 'method':
                    functions++;
                    break;
                case 'class':
                    classes++;
                    break;
                case 'variable':
                    variables++;
                    break;
            }

            n.children.forEach(child => {
                totalNodes++;
                traverse(child, depth + 1);
            });
        };

        traverse(node);
        
        return {
            totalNodes,
            functions,
            classes,
            variables,
            maxDepth
        };
    }

    private convertToJsTreeFormat(node: StructureNode): any {
        return {
            id: node.id,
            text: `${node.icon} ${node.text}`,
            type: node.type,
            data: {
                details: node.details,
                line: node.line
            },
            children: node.children.map(child => this.convertToJsTreeFormat(child))
        };
    }
}

interface StructureNode {
    id: string;
    text: string;
    type: string;
    icon: string;
    children: StructureNode[];
    line?: number;
    details: string[];
}
