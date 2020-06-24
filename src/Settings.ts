import * as vscode from 'vscode';
import { ConfigurationTarget, Uri, workspace, WorkspaceConfiguration } from 'vscode';

export default class Settings {

    // Track currently webview panel
    currentPanel: vscode.WebviewPanel | undefined = undefined;

    constructor() {

    }

   async openSettings(context: vscode.ExtensionContext) {
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

        this.currentPanel.webview.postMessage({ command: 'loadSettings', settings : getSettings()});

        this.currentPanel.webview.onDidReceiveMessage( async function(message){
            switch (message.command) {
                case 'save':
                    await updateSettings('hostName', message.settings.hostName);
                    await updateSettings('hostPort', message.settings.hostPort);
                    await updateSettings('username', message.settings.username);
                    await updateSettings('password', message.settings.password);
                    await updateSettings('database', message.settings.database);
                    vscode.window.showInformationMessage('Connection updated.');
                    vscode.commands.executeCommand('appService.Refresh');
                  return;
              }
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
            <input type="text" id="txt_host" width="300px" placeholder="Enter host name"/></br></br>
            <input type="number" id="txt_port" width="300px" placeholder="Enter port"/></br></br>
            <input type="text" id="txt_username" width="300px" placeholder="Enter username"/></br></br>
            <input type="password" id="txt_password" width="300px" placeholder="Enter password"/></br></br>
            <input type="text" id="txt_database" width="300px" placeholder="Enter database name"/></br></br>
            <button id="btn_save">Save</button>

            <script>
                const vscode = acquireVsCodeApi();

                const txt_host = document.getElementById('txt_host');
                const txt_port = document.getElementById('txt_port');
                const txt_username = document.getElementById('txt_username');
                const txt_password = document.getElementById('txt_password');
                const txt_database = document.getElementById('txt_database');
                const btn_save = document.getElementById('btn_save');

                btn_save.addEventListener("click", saveSettings);

                window.addEventListener('message', event => {

                    const message = event.data;
                    console.log(message);
                    switch (message.command) {
                        case 'loadSettings':
                            txt_host.value = message.settings.hostName;
                            txt_port.value = message.settings.hostPort;
                            txt_username.value = message.settings.username;
                            txt_password.value = message.settings.password;
                            txt_database.value = message.settings.database;
                        
                            break;
                    }
                });

                function saveSettings(){
                    vscode.postMessage({
                        command: 'save',
                        settings: {
                            hostName : txt_host.value,
                            hostPort : txt_port.value,
                            username : txt_username.value,
                            password : txt_password.value,
                            database : txt_database.value
                            
                        }
                    })
                }
                
                
            </script>
        </body>
        </html>`;
    }
}

export async function updateSettings<T = string>(section: string, value: T) {
    const projectConfiguration: WorkspaceConfiguration = workspace.getConfiguration("appService");
    await projectConfiguration.update(section, value, ConfigurationTarget.Global);
}

export function getSettings(): any {
    const projectConfiguration: any = workspace.getConfiguration("appService");
    //console.log(projectConfiguration);
    return projectConfiguration;
}

