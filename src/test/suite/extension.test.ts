import * as assert from 'assert';
import * as util from '../../util';
import * as vscode from 'vscode';

import * as mocha from 'mocha';
const describe = mocha.describe;

suite('Extension Test Suite', () => {
    const TEST_FOLDER = '/opt';

    describe('util', () => {
        test('util.system', async () => {
            (vscode.workspace.workspaceFolders as any) = [{url: {fsPath: TEST_FOLDER}}];

            const result = await util.system('pwd');

            console.info(`pwd result is ${result}`);

            // assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        });
    });
});
