import * as assert from 'assert';
import * as util from '../../util';
// import * as vscode from 'vscode';

import * as mocha from 'mocha';
const describe = mocha.describe;

suite('Extension Test Suite', () => {
    describe('util', () => {
        test('util.system', () => {
            const result = util.system("pwd");

            console.error(result);

            // assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        });
    });
});
