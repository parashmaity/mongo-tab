import * as vscode from 'vscode';
import { ConfigurationTarget, Uri, workspace, WorkspaceConfiguration } from 'vscode';

export default class Settings {

    // Track currently webview panel
    currentPanel: vscode.WebviewPanel | undefined = undefined;

    constructor() {

    }

    openSettings(context: vscode.ExtensionContext) {
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : 0;

        if (this.currentPanel) {
            // If we already have a panel, show it in the target column
            this.currentPanel.reveal(columnToShowIn);
        } else {
            // Otherwise, create a new panel
            this.currentPanel = vscode.window.createWebviewPanel(
                'Settings',
                'Settings',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );
            this.currentPanel.webview.html = this.getHTMLContent();
        }
        this.currentPanel.onDidDispose(
            () => {
              this.currentPanel = undefined;
            },
            undefined,
            context.subscriptions
          );
    }

    getHTMLContent(): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
        </head>
        <body>
            <h1>Settings</h1>
            <h2>MongoDB connection</h2>
            <input type="text" id="txt_url" width="300px" placeholder="Enter host name"/></br></br>
            <input type="number" id="txt_url" width="300px" placeholder="Enter port"/></br></br>
            <input type="text" id="txt_url" width="300px" placeholder="Enter username"/></br></br>
            <input type="text" id="txt_url" width="300px" placeholder="Enter password"/></br></br>
            <input type="text" id="txt_url" width="300px" placeholder="Enter database name"/></br></br>
            <button>Save</button>
        </body>
        </html>`;
    }
}

export async function updateSettings<T = string>(section: string, value: T){
    const projectConfiguration: WorkspaceConfiguration = workspace.getConfiguration("appService");
    await projectConfiguration.update(section, value, ConfigurationTarget.Global);
}

export function getSettings() : any {
    const projectConfiguration : any = workspace.getConfiguration("appService");
    //console.log(projectConfiguration);
    return projectConfiguration;
}

