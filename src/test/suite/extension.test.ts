import * as assert from 'assert';
import * as util from '../../util';

import * as mocha from 'mocha';
const describe = mocha.describe;

suite('Extension Test Suite', () => {
    describe('util', () => {
        test('util.system', async () => {
            // (vscode.workspace.workspaceFolders as any) = [{url: {fsPath: TEST_FOLDER}}];

            // We did not open a folder
            assert.strictEqual(await util.system('pwd'), '');
        });
    });
});
