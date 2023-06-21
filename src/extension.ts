import * as vscode from 'vscode';
import * as autoCommit from './autoCommit';

//-//

export function activate(context: vscode.ExtensionContext) {
    activateAutoCommitCommand(context);
}

//-//

function activateAutoCommitCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('autocommit.autoCommit', autoCommit.go));
}
