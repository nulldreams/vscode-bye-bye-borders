"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.commands.executeCommand('workbench.action.generateColorTheme');
        const configuration = vscode.workspace.getConfiguration('workbench');
        const colorThemeName = configuration.get('colorTheme');
        const findPropertyInStringObject = (property, objString) => {
            const filledProperty = `"${property}": "`;
            const configPosition = objString.indexOf(filledProperty) + filledProperty.length;
            return objString.substring(configPosition, configPosition + 7);
        };
        vscode.workspace.onDidOpenTextDocument((e) => {
            const fileText = e.getText();
            const isColorThemeFile = fileText.includes('"$schema": "vscode://schemas/color-theme"');
            console.log(fileText);
            console.log('aaa', isColorThemeFile);
            if (isColorThemeFile) {
                const mainColor = findPropertyInStringObject('editor.background', fileText);
                const borderlessTheme = { [`[${colorThemeName}]`]: {} };
                borderlessTheme[`[${colorThemeName}]`] = {
                    'sideBar.background': mainColor,
                    'sideBar.border': mainColor,
                    'sideBarSectionHeader.background': mainColor,
                    'sideBarSectionHeader.border': mainColor,
                    'activityBar.background': mainColor,
                    'activityBar.border': mainColor,
                    'tab.activeBackground': mainColor,
                    'tab.border': mainColor,
                    'tab.unfocusedActiveBackground': mainColor,
                    'tab.inactiveBackground': mainColor,
                    'statusBar.background': mainColor,
                    'statusBar.border': mainColor,
                };
                const actualColorCustomizations = configuration.get('colorCustomizations');
                configuration.update('colorCustomizations', Object.assign(Object.assign({}, borderlessTheme), actualColorCustomizations), true);
                vscode.commands.executeCommand('workbench.action.closeActiveEditor');
            }
        });
        let disposable = vscode.commands.registerCommand('borderless-theme.generateOneStyleTheme', () => {
            vscode.window.showInformationMessage(`Color settings of ${colorThemeName} added to workbench.colorCustomizations.`);
        });
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map