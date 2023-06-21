/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.go = void 0;
const vscode = __webpack_require__(1);
const util = __webpack_require__(3);
//-//
const SYNC_DELAY = 0;
const AUTO_COMMIT_TEXT_START = 'Performing auto commit...';
const AUTO_COMMIT_TEXT_DONE = 'Auto commit complete!';
let currentlyAutoCommitting = false;
//-//
async function go() {
    const commit = new AutoCommit();
    await commit.commit();
}
exports.go = go;
//-//
class AutoCommit {
    constructor() {
        this.topLevel = null;
    }
    async commit() {
        if (currentlyAutoCommitting) {
            return;
        }
        currentlyAutoCommitting = true;
        await this.commit_();
        currentlyAutoCommitting = false;
    }
    async commit_() {
        await AutoCommit.pushPending();
        await this.performAutoCommit();
        await AutoCommit.popPending();
    }
    static async pushPending() {
        util.inform(AUTO_COMMIT_TEXT_START);
    }
    static async popPending() {
        util.inform(AUTO_COMMIT_TEXT_DONE);
    }
    async performAutoCommit() {
        try {
            await this.performAutoCommit_();
        }
        catch (e) {
            console.error(e);
            vscode.window.showErrorMessage(e.message);
        }
    }
    async performAutoCommit_() {
        await this.storeTopLevel();
        await this.saveAll();
        await this.stageAll();
        await this.performCommit();
        await this.syncAll();
    }
    async storeTopLevel() {
        this.topLevel = await AutoCommit.findGitRoot();
    }
    //-//
    async saveAll() {
        await vscode.commands.executeCommand('workbench.action.files.saveFiles');
    }
    async stageAll() {
        // 'git.stageAll'
        await util.system('git add .', this.topLevel);
    }
    async performCommit() {
        const message = AutoCommit.generateCommitMessage();
        await util.system(`git commit -m "${message}"`, this.topLevel);
    }
    async syncAll() {
        await util.sleep(SYNC_DELAY);
        // 'git.sync', 'git._syncAll'
        await util.system('git pull', this.topLevel);
        await util.system('git push', this.topLevel);
    }
    //-//
    static async findGitRoot() {
        const doc = util.getActiveDocument();
        if (!doc) {
            return null;
        }
        return await AutoCommit.findGitRoot_(doc);
    }
    static async findGitRoot_(doc) {
        const currentFolder = AutoCommit.getCurrentFolder(doc);
        const topLevel = await AutoCommit.getTopLevel(currentFolder);
        return topLevel || null;
    }
    static getCurrentFolder(doc) {
        const currentFilePath = doc.uri.fsPath.trim().replace(/\\/g, '/');
        const currentFolder = currentFilePath.substring(0, currentFilePath.lastIndexOf('/'));
        AutoCommit.printFolder(currentFolder);
        return currentFolder;
    }
    static async getTopLevel(currentFolder) {
        const topLevelResult = await util.system('git rev-parse --show-toplevel', currentFolder);
        const topLevel = topLevelResult.trim();
        AutoCommit.printTopLevel(topLevel);
        return topLevel;
    }
    //-//
    static generateCommitMessage() {
        const now = new Date(Date.now());
        const displayedMinutes = AutoCommit.getDisplayedMinutes(now);
        // 6/21/2023 04:00 +
        return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${displayedMinutes} +`;
    }
    static getDisplayedMinutes(now) {
        let displayedMinutes = `${now.getMinutes()}`;
        if (displayedMinutes.length < 2) {
            displayedMinutes = '0' + displayedMinutes;
        }
        return `${displayedMinutes}`;
    }
    //-//
    static printFolder(folder) {
        console.log(`Auto commit current folder: ${folder}`);
    }
    static printTopLevel(folder) {
        console.log(`Auto commit top-level folder: ${folder}`);
    }
}
;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getActiveEditor = exports.getActiveDocument = exports.inform = exports.sleep = exports.system = void 0;
const vscode = __webpack_require__(1);
const exec = (__webpack_require__(4).exec);
//-//
async function system(command, cwd = null) {
    if (cwd === null) {
        if ((cwd = getCWD()) === null) {
            return '';
        }
    }
    return new Promise(resolve => {
        exec(command, { cwd }, makeCommandResolver(resolve));
    });
}
exports.system = system;
function makeCommandResolver(resolve) {
    return (error, stdout, stderr) => {
        if (error) {
            console.error(error);
        }
        if (stderr) {
            console.error(stderr);
        }
        resolve(stdout);
    };
}
function getCWD() {
    if (vscode.workspace.workspaceFolders === undefined) {
        return null;
    }
    return `${vscode.workspace.workspaceFolders[0].uri.fsPath}`;
}
//-//
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
async function inform(text) {
    console.log(text);
    await vscode.window.showInformationMessage(text);
}
exports.inform = inform;
//-//
function getActiveDocument() {
    return getActiveEditor()?.document;
}
exports.getActiveDocument = getActiveDocument;
function getActiveEditor() {
    return vscode.window.activeTextEditor;
}
exports.getActiveEditor = getActiveEditor;


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode = __webpack_require__(1);
const autoCommit = __webpack_require__(2);
//-//
function activate(context) {
    activateAutoCommitCommand(context);
}
exports.activate = activate;
//-//
function activateAutoCommitCommand(context) {
    context.subscriptions.push(vscode.commands.registerCommand('autocommit.autoCommit', autoCommit.go));
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map