import * as vscode from 'vscode';
import {ActionRefresh } from '../EventHandler';
import {TreeDataProvider} from '../dataSource/DBTreeViewProvider';
import DBConnection from '../dataSource/DBConnection';
import Settings from '../Settings';


export default class RegisterCommandEvent {

    dbProvider =  new TreeDataProvider();
    settings = new Settings();

    constructor(context: vscode.ExtensionContext){
        this.registerView();
        // Register all command
        this.registerCommand(context);

        
    }

    /**
     * 
     */
    registerView(){
        vscode.window.registerTreeDataProvider('mongoDBService', this.dbProvider);
    }
    /**
     * 
     * @param context 
     */
    async registerCommand(context: vscode.ExtensionContext){
        // 
        const connect = new DBConnection(this.dbProvider);

        const sett = vscode.commands.registerCommand('appService.settings', () => this.settings.openSettings(context) );
        context.subscriptions.push(sett);

        const disposableAddNewDB = vscode.commands.registerCommand('appService.AddConnection', () => {});
        context.subscriptions.push(disposableAddNewDB);
        const disposableRefresh = vscode.commands.registerCommand('appService.Refresh', () => {
            this.dbProvider =  new TreeDataProvider();
            new DBConnection(this.dbProvider);
         });
        context.subscriptions.push(disposableRefresh);
        const disposableOpenCollection = vscode.commands.registerCommand('appService.openCollection', (collectionOpenParams) => {
            this.open(context, connect, collectionOpenParams);
            
            }
         );
        context.subscriptions.push(disposableOpenCollection);
        
    }

    async open(context: vscode.ExtensionContext, connect : DBConnection, name : string){
        const myScheme = 'MongoTab';
        
        const myProvider = new class implements vscode.TextDocumentContentProvider {

            // emitter and its event
            onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
            onDidChange = this.onDidChangeEmitter.event;

           provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
                // simply invoke cowsay, use uri-path as text
                const data = connect.getDataCollection(name);
                return connect.getDataCollection(name);
            }
        };
        vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider);
        //const data = await connect.getDataCollection(name);
        let uri = vscode.Uri.parse('MongoTab:'+name);
        const data = connect.getDataCollection(name);
        let doc = await vscode.workspace.openTextDocument(uri); // calls back into the provider
        const newDoc = await vscode.languages.setTextDocumentLanguage(doc, 'json');
        
        await vscode.window.showTextDocument(newDoc, { preview: false });
 
        await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', uri, doc. );
        //vscode.executeFormatDocumentProvider();
    }

}