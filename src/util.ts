import * as vscode from 'vscode';

const exec = require('child_process').exec;

//-//

export async function system(command: string, cwd: string | null = null): Promise<string> {
    if (cwd === null) {
        if ((cwd = getCWD()) === null) {
            return '';
        }
    }

    return new Promise(resolve => {
        exec(command, { cwd }, makeCommandResolver(resolve));
    });
}
function makeCommandResolver(resolve: any) {
    return (error: string, stdout: string, stderr: string) => {
        if (error) {
            console.error(error);
        }
        if (stderr) {
            console.error(stderr);
        }

        resolve(stdout);
    };
}
function getCWD(): string | null {
    if (vscode.workspace.workspaceFolders === undefined) {
        return null;
    }

    return `${vscode.workspace.workspaceFolders[0].uri.fsPath}`;
}

//-//

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function inform(text: string): Promise<void> {
    console.log(text);

    await vscode.window.showInformationMessage(text);
}

//-//

export function getActiveDocument(): vscode.TextDocument | undefined {
    return getActiveEditor()?.document;
}
export function getActiveEditor(): vscode.TextEditor | undefined {
    return vscode.window.activeTextEditor;
}
