// Oliver Kovacs MIT

import * as vscode from 'vscode';

export function activate({ subscriptions }: vscode.ExtensionContext) {

	const statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		0,
	);

	subscriptions.push(vscode.commands.registerCommand('word-count.show', () => {
		statusBarItem.show();
	}));

	subscriptions.push(vscode.commands.registerCommand('word-count.hide', () => {
		statusBarItem.hide();
	}));

	const count = (text: string): number => {
		return text.split(/\s+/g).filter(word => word).length;
	};

	const getText = (): string | null => {
        const editor = vscode.window.activeTextEditor;
		if (!editor) return null;
		const { document } = editor;
		return document.getText();
	};

	subscriptions.push(vscode.commands.registerCommand('word-count.details', () => {
		const text = getText();
		if (text === null) return null;
		vscode.window.showInformationMessage(
			`Words: ${count(text)} Characters: ${text.length}`
		);
	}));

	const setWordCount = () => {
		const text = getText();
		if (text === null) return null;
		const words = count(text);
		statusBarItem.text = `${words} Word${words === 1 ? "" : "s"}`;
	};

	setWordCount();
	statusBarItem.show();
	statusBarItem.command = 'word-count.details';

	vscode.workspace.onDidChangeTextDocument(setWordCount);
}

export function deactivate() {}
