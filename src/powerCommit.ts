import * as vscode from 'vscode';
import * as util from './util';

//-//

const SYNC_DELAY = 0;
const COMMIT_TEXT_START = 'Performing power commit...';
const COMMIT_TEXT_DONE = 'Power commit complete!';

let currentlyPowerCommitting: boolean = false;

//-//

export async function go(): Promise<void> {
    const commit = new PowerCommit();

    await commit.commit();
}

//-//

class PowerCommit {

    private topLevel: string | null = null;

    public async commit(): Promise<void> {
        if (currentlyPowerCommitting) {
            return;
        }
        currentlyPowerCommitting = true;

        await this.commit_();

        currentlyPowerCommitting = false;
    }
    private async commit_(): Promise<void> {
        await PowerCommit.pushPending();

        await this.performPowerCommit();

        await PowerCommit.popPending();
    }

    private static async pushPending(): Promise<void> {
        util.inform(COMMIT_TEXT_START);
    }
    private static async popPending(): Promise<void> {
        util.inform(COMMIT_TEXT_DONE);
    }

    private async performPowerCommit(): Promise<void> {
        try {
            await this.performPowerCommit_();
        } catch (e: any) {
            console.error(e);
            vscode.window.showErrorMessage(e.message);
        }
    }
    private async performPowerCommit_(): Promise<void> {
        await this.storeTopLevel();

        await this.saveAll();
        await this.stageAll();

        await this.performCommit();

        await this.syncAll();
    }
    private async storeTopLevel(): Promise<void> {
        this.topLevel = await PowerCommit.findGitRoot();
    }

    //-//

    private async saveAll(): Promise<void> {
        await vscode.commands.executeCommand('workbench.action.files.saveFiles');
    }
    private async stageAll(): Promise<void> {
        // 'git.stageAll'
        await util.system('git add .', this.topLevel);
    }

    private async performCommit(): Promise<void> {
        const message = PowerCommit.generateCommitMessage();

        await util.system(`git commit -m "${message}"`, this.topLevel);
    }

    private async syncAll(): Promise<void> {
        await util.sleep(SYNC_DELAY);

        // 'git.sync', 'git._syncAll'
        await util.system('git pull', this.topLevel);
        await util.system('git push', this.topLevel);
    }

    //-//

    private static async findGitRoot(): Promise<string | null> {
        const doc = util.getActiveDocument();
        if (!doc) {
            return null;
        }

        return await PowerCommit.findGitRoot_(doc);
    }
    private static async findGitRoot_(doc: vscode.TextDocument): Promise<string | null> {
        const currentFolder = PowerCommit.getCurrentFolder(doc);
        const topLevel = await PowerCommit.getTopLevel(currentFolder);

        return topLevel || null;
    }
    private static getCurrentFolder(doc: vscode.TextDocument): string {
        const currentFilePath = doc.uri.fsPath.trim().replace(/\\/g, '/');
        const currentFolder = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));

        PowerCommit.printFolder(currentFolder);

        return currentFolder;
    }
    private static async getTopLevel(currentFolder: string): Promise<string> {
        const topLevelResult = await util.system('git rev-parse --show-toplevel', currentFolder);
        const topLevel = topLevelResult.trim();

        PowerCommit.printTopLevel(topLevel);

        return topLevel;
    }

    //-//

    private static generateCommitMessage(): string {
        const now = new Date(Date.now());

        const displayedMinutes = PowerCommit.getDisplayedMinutes(now);

        // 6/21/2023 04:00 +
        return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${displayedMinutes} +`;
    }
    private static getDisplayedMinutes(now: Date): string {
        let displayedMinutes = `${now.getMinutes()}`;

        if (displayedMinutes.length < 2) {
            displayedMinutes = '0' + displayedMinutes;
        }

        return `${displayedMinutes}`;
    }

    //-//

    private static printFolder(folder: string): void {
        console.log(`Auto commit current folder: ${folder}`);
    }
    private static printTopLevel(folder: string): void {
        console.log(`Auto commit top-level folder: ${folder}`);
    }

};
