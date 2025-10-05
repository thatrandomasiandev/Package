import * as vscode from 'vscode';
import { CodeParser } from './codeParser';
import { FlowChartGenerator } from './flowChartGenerator';
import { StructureGenerator } from './structureGenerator';

export function activate(context: vscode.ExtensionContext) {
	console.log('Code Visualizer extension is now active!');

	// Register flow chart command
	let flowChartCommand = vscode.commands.registerCommand('codeVisualizer.showFlowChart', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active editor found');
			return;
		}

		const code = editor.document.getText();
		const selection = editor.selection;
		const selectedCode = selection.isEmpty ? code : editor.document.getText(selection);

		try {
			const parser = new CodeParser();
			const ast = parser.parseCode(selectedCode, editor.document.languageId);
			
			const generator = new FlowChartGenerator();
			const flowChartHtml = generator.generateFlowChart(ast, editor.document.fileName);
			
			await showVisualizationPanel(flowChartHtml, 'Code Flow Chart', context);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to generate flow chart: ${error}`);
		}
	});

	// Register structure command
	let structureCommand = vscode.commands.registerCommand('codeVisualizer.showStructure', async () => {
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

	context.subscriptions.push(flowChartCommand, structureCommand);
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
