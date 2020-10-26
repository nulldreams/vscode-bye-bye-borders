import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
  vscode.commands.executeCommand('workbench.action.generateColorTheme');

  const configuration = vscode.workspace.getConfiguration('workbench');
  const colorThemeName: string = configuration.get('colorTheme') as string;

  const findPropertyInStringObject = (property: string, objString: string) => {
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

      const actualColorCustomizations = configuration.get('colorCustomizations') as Object;

      configuration.update(
        'colorCustomizations',
        {
          ...borderlessTheme,
          ...actualColorCustomizations,
        },
        true
      );

      vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    }
  });

  let disposable = vscode.commands.registerCommand('borderless-theme.generateOneStyleTheme', () => {
    vscode.window.showInformationMessage(`Color settings of ${colorThemeName} added to workbench.colorCustomizations.`);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
