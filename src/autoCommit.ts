import * as vscode from 'vscode';
import * as util from './util';

//-//

const SYNC_DELAY = 0;
const AUTO_COMMIT_TEXT_START = 'Performing auto commit...';
const AUTO_COMMIT_TEXT_DONE = 'Auto commit complete!';

let currentlyAutoCommitting = false;

//-//

export async function go() {
    const commit = new AutoCommit();

    await commit.commit();
}

//-//

class AutoCommit {

    private topLevel: string | null = null;

    public async commit(): Promise<void> {
        if (currentlyAutoCommitting) {
            return;
        }
        currentlyAutoCommitting = true;

        await this.commit_();

        currentlyAutoCommitting = false;
    }
    private async commit_(): Promise<void> {
        await AutoCommit.pushPending();

        await this.performAutoCommit();

        await AutoCommit.popPending();
    }

    private static async pushPending(): Promise<void> {
        util.inform(AUTO_COMMIT_TEXT_START);
    }
    private static async popPending(): Promise<void> {
        util.inform(AUTO_COMMIT_TEXT_DONE);
    }

    private async performAutoCommit(): Promise<void> {
        try {
            await this.performAutoCommit_();
        } catch (e: any) {
            console.error(e);
            vscode.window.showErrorMessage(e.message);
        }
    }
    private async performAutoCommit_(): Promise<void> {
        await this.storeTopLevel();

        await this.saveAll();
        await this.stageAll();

        await this.performCommit();

        await this.syncAll();
    }
    private async storeTopLevel(): Promise<void> {
        this.topLevel = await AutoCommit.findGitRoot();
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
        const message = AutoCommit.generateCommitMessage();

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

        return await AutoCommit.findGitRoot_(doc);
    }
    private static async findGitRoot_(doc: vscode.TextDocument): Promise<string | null> {
        const currentFolder = AutoCommit.getCurrentFolder(doc);
        const topLevel = await AutoCommit.getTopLevel(currentFolder);

        return topLevel || null;
    }
    private static getCurrentFolder(doc: vscode.TextDocument): string {
        const currentFilePath = doc.uri.fsPath.trim().replace(/\\/g, '/');
        const currentFolder = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));

        AutoCommit.printFolder(currentFolder);

        return currentFolder;
    }
    private static async getTopLevel(currentFolder: string): Promise<string> {
        const topLevelResult = await util.system('git rev-parse --show-toplevel', currentFolder);
        const topLevel = topLevelResult.trim();

        AutoCommit.printTopLevel(topLevel);

        return topLevel;
    }

    //-//

    private static generateCommitMessage(): string {
        const now = new Date(Date.now());

        const displayedMinutes = AutoCommit.getDisplayedMinutes(now);

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
