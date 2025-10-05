import * as acorn from 'acorn';

export interface CodeNode {
    type: string;
    name?: string;
    children: CodeNode[];
    line?: number;
    column?: number;
    value?: any;
    parameters?: string[];
    returnType?: string;
}

export class CodeParser {
    parseCode(code: string, languageId: string): CodeNode {
        switch (languageId.toLowerCase()) {
            case 'javascript':
            case 'typescript':
                return this.parseJavaScript(code);
            case 'python':
                return this.parsePython(code);
            case 'java':
                return this.parseJava(code);
            default:
                return this.parseGeneric(code);
        }
    }

    private parseJavaScript(code: string): CodeNode {
        try {
            const ast = acorn.parse(code, {
                ecmaVersion: 2020,
                sourceType: 'module',
                locations: true
            }) as any;

            return this.convertASTToCodeNode(ast);
        } catch (error) {
            // Fallback to generic parsing if AST parsing fails
            return this.parseGeneric(code);
        }
    }

    private parsePython(code: string): CodeNode {
        // For Python, we'll do basic parsing since we don't have a Python parser
        return this.parseGeneric(code);
    }

    private parseJava(code: string): CodeNode {
        // For Java, we'll do basic parsing since we don't have a Java parser
        return this.parseGeneric(code);
    }

    private parseGeneric(code: string): CodeNode {
        const lines = code.split('\n');
        const functions: CodeNode[] = [];
        const classes: CodeNode[] = [];
        const variables: CodeNode[] = [];

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            // Detect functions
            if (this.isFunctionDefinition(trimmedLine)) {
                functions.push({
                    type: 'function',
                    name: this.extractFunctionName(trimmedLine),
                    children: [],
                    line: index + 1,
                    parameters: this.extractParameters(trimmedLine)
                });
            }
            // Detect classes
            else if (this.isClassDefinition(trimmedLine)) {
                classes.push({
                    type: 'class',
                    name: this.extractClassName(trimmedLine),
                    children: [],
                    line: index + 1
                });
            }
            // Detect variables
            else if (this.isVariableDefinition(trimmedLine)) {
                variables.push({
                    type: 'variable',
                    name: this.extractVariableName(trimmedLine),
                    children: [],
                    line: index + 1,
                    value: this.extractVariableValue(trimmedLine)
                });
            }
        });

        return {
            type: 'program',
            name: 'Program',
            children: [...classes, ...functions, ...variables]
        };
    }

    private convertASTToCodeNode(node: any): CodeNode {
        const codeNode: CodeNode = {
            type: node.type,
            children: []
        };

        // Add location information
        if (node.loc) {
            codeNode.line = node.loc.start.line;
            codeNode.column = node.loc.start.column;
        }

        // Handle different node types
        switch (node.type) {
            case 'Program':
                codeNode.name = 'Program';
                node.body.forEach((child: any) => {
                    codeNode.children.push(this.convertASTToCodeNode(child));
                });
                break;

            case 'FunctionDeclaration':
                codeNode.name = node.id?.name || 'Anonymous Function';
                codeNode.type = 'function';
                codeNode.parameters = node.params.map((param: any) => param.name || param.type);
                break;

            case 'ClassDeclaration':
                codeNode.name = node.id?.name;
                codeNode.type = 'class';
                node.body.body.forEach((child: any) => {
                    codeNode.children.push(this.convertASTToCodeNode(child));
                });
                break;

            case 'MethodDefinition':
                codeNode.name = node.key?.name;
                codeNode.type = 'method';
                codeNode.parameters = node.value?.params?.map((param: any) => param.name || param.type);
                break;

            case 'VariableDeclaration':
                node.declarations.forEach((declaration: any) => {
                    const varNode = this.convertASTToCodeNode(declaration);
                    varNode.type = 'variable';
                    codeNode.children.push(varNode);
                });
                break;

            case 'VariableDeclarator':
                codeNode.name = node.id?.name;
                if (node.init) {
                    codeNode.value = this.extractValueFromNode(node.init);
                }
                break;

            case 'IfStatement':
                codeNode.type = 'condition';
                codeNode.name = 'If Statement';
                codeNode.children.push(this.convertASTToCodeNode(node.consequent));
                if (node.alternate) {
                    codeNode.children.push(this.convertASTToCodeNode(node.alternate));
                }
                break;

            case 'ForStatement':
            case 'WhileStatement':
            case 'DoWhileStatement':
                codeNode.type = 'loop';
                codeNode.name = node.type.replace('Statement', ' Loop');
                if (node.body) {
                    codeNode.children.push(this.convertASTToCodeNode(node.body));
                }
                break;

            case 'BlockStatement':
                codeNode.type = 'block';
                codeNode.name = 'Code Block';
                node.body.forEach((child: any) => {
                    codeNode.children.push(this.convertASTToCodeNode(child));
                });
                break;

            case 'ReturnStatement':
                codeNode.type = 'return';
                codeNode.name = 'Return';
                if (node.argument) {
                    codeNode.value = this.extractValueFromNode(node.argument);
                }
                break;
        }

        return codeNode;
    }

    private extractValueFromNode(node: any): any {
        switch (node.type) {
            case 'Literal':
                return node.value;
            case 'Identifier':
                return node.name;
            case 'BinaryExpression':
                return `${this.extractValueFromNode(node.left)} ${node.operator} ${this.extractValueFromNode(node.right)}`;
            default:
                return node.type;
        }
    }

    private isFunctionDefinition(line: string): boolean {
        const functionPatterns = [
            /function\s+\w+\s*\(/,
            /\w+\s*=\s*function/,
            /const\s+\w+\s*=\s*\(/,
            /def\s+\w+\s*\(/,
            /public\s+\w+\s+\w+\s*\(/,
            /private\s+\w+\s+\w+\s*\(/
        ];
        return functionPatterns.some(pattern => pattern.test(line));
    }

    private isClassDefinition(line: string): boolean {
        const classPatterns = [
            /class\s+\w+/,
            /interface\s+\w+/,
            /struct\s+\w+/
        ];
        return classPatterns.some(pattern => pattern.test(line));
    }

    private isVariableDefinition(line: string): boolean {
        const variablePatterns = [
            /let\s+\w+/,
            /const\s+\w+/,
            /var\s+\w+/,
            /int\s+\w+/,
            /string\s+\w+/,
            /boolean\s+\w+/
        ];
        return variablePatterns.some(pattern => pattern.test(line));
    }

    private extractFunctionName(line: string): string {
        const match = line.match(/(?:function\s+|def\s+|const\s+|let\s+|var\s+|public\s+\w+\s+|private\s+\w+\s+)(\w+)/);
        return match ? match[1] : 'Unknown Function';
    }

    private extractClassName(line: string): string {
        const match = line.match(/(?:class|interface|struct)\s+(\w+)/);
        return match ? match[1] : 'Unknown Class';
    }

    private extractVariableName(line: string): string {
        const match = line.match(/(?:let|const|var|int|string|boolean)\s+(\w+)/);
        return match ? match[1] : 'Unknown Variable';
    }

    private extractParameters(line: string): string[] {
        const paramMatch = line.match(/\(([^)]*)\)/);
        if (paramMatch && paramMatch[1].trim()) {
            return paramMatch[1].split(',').map(param => param.trim());
        }
        return [];
    }

    private extractVariableValue(line: string): string {
        const match = line.match(/=\s*(.+)/);
        return match ? match[1].trim() : 'undefined';
    }
}
