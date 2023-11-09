// Oliver Kovacs MIT

import * as vscode from 'vscode';

export function activate({ subscriptions }: vscode.ExtensionContext) {
  // creates the status bar word counter
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    0
  );

  // registers the word-count.show, hide commands which show/hide the status bar
  subscriptions.push(
    vscode.commands.registerCommand('word-count.show', () => {
      statusBarItem.show();
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand('word-count.hide', () => {
      statusBarItem.hide();
    })
  );

  // counts the number of words in a passed in string
  const count = (text: string): number => {
    return text.split(/\s+/g).filter((word) => word).length;
  };

  // gets the document from the active text editor, and then returns the text in the document. If text is selected, return that text instead
  const getText = (): string | null => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return null;
    const { document, selection } = editor;
    const selectionRange =
      selection && !selection.isEmpty
        ? new vscode.Range(
            selection.start.line,
            selection.start.character,
            selection.end.line,
            selection.end.character
          )
        : null;

    return selectionRange
      ? editor.document.getText(selectionRange)
      : document.getText();
  };

  // pops up the details pane
  subscriptions.push(
    vscode.commands.registerCommand('word-count.details', () => {
      const text = getText();
      if (text === null) return null;
      vscode.window.showInformationMessage(
        `Words: ${count(text)} Characters: ${text.length}`
      );
    })
  );

  // invoking this gets the text from the doc, counts the words, and then updates the status bar text
  const setWordCount = (): null | void => {
    const text = getText();
    if (text === null) return null;
    const words = count(text);
    statusBarItem.text = `${words} Word${words === 1 ? '' : 's'}`;
  };

  //on start up, set the word count, then show the status bar, and then show the details pane
  setWordCount();
  statusBarItem.show();
  statusBarItem.command = 'word-count.details';

  vscode.workspace.onDidChangeTextDocument(setWordCount);
  vscode.window.onDidChangeTextEditorSelection(setWordCount);
}

export function deactivate() {}
