import * as vscode from 'vscode';
import {ActionRefresh } from '../EventHandler';
import TreeDataProvider from '../dataSource/DBTreeViewProvider';


export default class RegisterCommandEvent {

    db =  new TreeDataProvider();

    constructor(context: vscode.ExtensionContext){
        this.registerView();
        // Register all command
        this.registerCommand(context);
    }

    /**
     * 
     */
    registerView(){
        vscode.window.registerTreeDataProvider('mongoDBService', this.db);
    }
    /**
     * 
     * @param context 
     */
    registerCommand(context: vscode.ExtensionContext){
        const disposableRefresh = vscode.commands.registerCommand('appService.AddConnection', () => this.db.refresh() );
        context.subscriptions.push(disposableRefresh);
    }
}