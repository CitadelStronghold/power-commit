import * as vscode from 'vscode';
import * as powerCommit from './powerCommit';

//-//

export function activate(context: vscode.ExtensionContext) {
    activatePowerCommitCommand(context);
}

//-//

function activatePowerCommitCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('powercommit.powerCommit', powerCommit.go));
}
