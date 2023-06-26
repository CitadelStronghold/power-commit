import * as vscode from 'vscode';

const exec = require('child_process').exec;

//-//

const STATUS_TIMEOUT: number = 5000;

const DEFAULT_REPORTER: (text: string) => void = (text: string) => {
    console.error(text);
    throw new Error(text);
};

//-//

let statusBar: vscode.StatusBarItem | null = null;
let statusTimeout: any | null = null;

//-//

export async function system(
    command: string,
    cwd: string | null = null,
    reporter: (text: string) => void = DEFAULT_REPORTER
): Promise<string> {
    if (cwd === null) {
        if ((cwd = getCWD()) === null) {
            return '';
        }
    }

    return new Promise((resolve) => {
        exec(command, { cwd }, makeCommandResolver(resolve, reporter));
    });
}
function makeCommandResolver(resolve: any, reporter: (text: string) => void): any {
    return (error: string, stdout: string, stderr: string) => {
        if (error || stderr) {
            reporter(error || stderr);
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

export function inform(text: string): void {
    console.info(text);

    showStatus(text);
}
function showStatus(text: string): void {
    if(statusBar === null) {
        createStatusBar();
    }

    statusBar!.text = text;
    statusBar!.show();

    startStatusTimer();
}
function createStatusBar(): void {
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
}
function startStatusTimer(): void {
    if (statusTimeout !== null) {
        clearTimeout(statusTimeout);
    }

    statusTimeout = setTimeout(() => {
        statusBar!.text = '';
        statusBar!.hide();
    }, STATUS_TIMEOUT);
}


//-//

export function getActiveDocument(): vscode.TextDocument | undefined {
    return getActiveEditor()?.document;
}
export function getActiveEditor(): vscode.TextEditor | undefined {
    return vscode.window.activeTextEditor;
}
