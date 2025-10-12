import * as vscode from 'vscode';
import { CodeParser } from './codeParser';
import { FlowChartGenerator } from './flowChartGenerator';
import { StructureGenerator } from './structureGenerator';
import { CodeExecutor } from './codeExecutor';
import { OutputGenerator } from './outputGenerator';

let codeExecutor: CodeExecutor;
let outputGenerator: OutputGenerator;

export function activate(context: vscode.ExtensionContext) {
	console.log('Code Lab extension is now active!');

	// Initialize components
	codeExecutor = new CodeExecutor();
	outputGenerator = new OutputGenerator();

	// Register execute selection command
	let executeSelectionCommand = vscode.commands.registerCommand('codeLab.executeSelection', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active editor found');
			return;
		}

		const selection = editor.selection;
		if (selection.isEmpty) {
			vscode.window.showWarningMessage('Please select some code to execute');
			return;
		}

		const selectedCode = editor.document.getText(selection);
		await executeCode(selectedCode, editor.document.languageId, context);
	});

	// Register execute function command
	let executeFunctionCommand = vscode.commands.registerCommand('codeLab.executeFunction', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active editor found');
			return;
		}

		const selection = editor.selection;
		if (selection.isEmpty) {
			vscode.window.showWarningMessage('Please select a function to execute');
			return;
		}

		const selectedCode = editor.document.getText(selection);
		// Try to auto-call the function if it looks like a function definition
		let codeToExecute = selectedCode;
		if (selectedCode.includes('function ') || selectedCode.includes('=>')) {
			// Try to extract function name and call it
			const functionMatch = selectedCode.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(|(\w+)\s*:\s*(?:async\s+)?\(/);
			if (functionMatch) {
				const functionName = functionMatch[1] || functionMatch[2] || functionMatch[3];
				codeToExecute = `${selectedCode}\n\n// Execute the function\n${functionName}();`;
			}
		}

		await executeCode(codeToExecute, editor.document.languageId, context);
	});

	// Register flow chart command for selected code
	let flowChartCommand = vscode.commands.registerCommand('codeLab.showFlowChart', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active editor found');
			return;
		}

		const selection = editor.selection;
		if (selection.isEmpty) {
			vscode.window.showWarningMessage('Please select some code to visualize');
			return;
		}

		const selectedCode = editor.document.getText(selection);
		const startLine = selection.start.line + 1;
		const endLine = selection.end.line + 1;

		try {
			const parser = new CodeParser();
			const ast = parser.parseCode(selectedCode, editor.document.languageId);
			
			const generator = new FlowChartGenerator();
			const flowChartHtml = generator.generateFlowChart(ast, editor.document.fileName, startLine, endLine);
			
			await showVisualizationPanel(flowChartHtml, 'Code Flow Chart', context);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to generate flow chart: ${error}`);
		}
	});

	// Register structure command
	let structureCommand = vscode.commands.registerCommand('codeLab.showStructure', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active editor found');
			return;
		}

		const code = editor.document.getText();
		
		try {
			const parser = new CodeParser();
			const ast = parser.parseCode(code, editor.document.languageId);
			
			const generator = new StructureGenerator();
			const structureHtml = generator.generateStructure(ast, editor.document.fileName);
			
			await showVisualizationPanel(structureHtml, 'Code Structure', context);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to generate structure: ${error}`);
		}
	});

	// Register inspect variables command
	let inspectVariablesCommand = vscode.commands.registerCommand('codeLab.inspectVariables', async () => {
		const variables = codeExecutor.getVariables();
		const variableEntries = Object.entries(variables);
		
		if (variableEntries.length === 0) {
			vscode.window.showInformationMessage('No variables found. Execute some code first!');
			return;
		}

		// Create a simple variables display
		const variablesText = variableEntries.map(([name, value]) => 
			`${name}: ${JSON.stringify(value, null, 2)}`
		).join('\n\n');

		const doc = await vscode.workspace.openTextDocument({
			content: variablesText,
			language: 'json'
		});
		
		await vscode.window.showTextDocument(doc);
	});

	context.subscriptions.push(
		executeSelectionCommand,
		executeFunctionCommand,
		flowChartCommand,
		structureCommand,
		inspectVariablesCommand
	);
}

async function executeCode(code: string, languageId: string, context: vscode.ExtensionContext) {
	if (!['javascript', 'typescript'].includes(languageId)) {
		vscode.window.showWarningMessage('Code execution is currently only supported for JavaScript and TypeScript');
		return;
	}

	// Show progress
	await vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Code Lab",
		cancellable: false
	}, async (progress) => {
		progress.report({ message: "Executing code..." });
		
		try {
			const result = await codeExecutor.executeCode(code, languageId);
			const outputHtml = outputGenerator.generateOutputHTML(result, code, languageId);
			
			await showVisualizationPanel(outputHtml, 'Code Lab Output', context);
			
			if (result.error) {
				vscode.window.showErrorMessage(`Execution failed: ${result.error}`);
			} else {
				vscode.window.showInformationMessage(`Code executed successfully in ${result.executionTime}ms`);
			}
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to execute code: ${error}`);
		}
	});
}

async function showVisualizationPanel(htmlContent: string, title: string, context: vscode.ExtensionContext) {
	const panel = vscode.window.createWebviewPanel(
		'codeVisualizer',
		title,
		vscode.ViewColumn.Beside,
		{
			enableScripts: true,
			retainContextWhenHidden: true
		}
	);

	panel.webview.html = htmlContent;
}

export function deactivate() {}
