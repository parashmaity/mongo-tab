import * as vscode from 'vscode';
import  {TreeDataProvider} from './DBTreeViewProvider';
import  {BaseTreeItem} from './DBTreeViewProvider';
const {MongoClient} = require('mongodb');

import {getSettings} from '../Settings';

export default class DBConnection {

    settings = getSettings();
    url = `mongodb://${this.settings.username}:${this.settings.password}@${this.settings.hostName}:${this.settings.hostPort}/${this.settings.database}?retryWrites=true&w=majority`;
    client = new MongoClient(this.url, { useUnifiedTopology: true });
        

    constructor(dbView: TreeDataProvider) {
        this.connect(dbView);
    }

    public async connect(dbView: TreeDataProvider){
        const settings = getSettings();
        var url = `mongodb://${settings.username}:${settings.password}@${settings.hostName}:${settings.hostPort}/${settings.database}?retryWrites=true&w=majority`;
        const client = new MongoClient(url, { useUnifiedTopology: true });
        try {
            await client.connect();
           //const databasesList = await client.db().admin().listDatabases();
            console.log('Database connection successful');
            vscode.window.showInformationMessage("Database connection successful.");
            const hostName = `${client.s.options.servers[0].host} ( ${client.s.options.auth.username} )`;
            dbView.addHostServer(hostName);
            dbView.addNewDatabase(hostName, client.s.options.dbName);
            await this.getCollectionFromDatabases(client, hostName, client.s.options.dbName, dbView);
        }catch( ex){
            console.log(ex);
            vscode.window.showErrorMessage(`Database connection failed host (${settings.hostName})`);
        }finally{
            // client.close();
        }
    }

    public async getCollectionFromDatabases(client : any , hostName : string, dbName : string, dbView: TreeDataProvider) {
        
        const dbList = await client.db(dbName).listCollections().toArray();
        // console.log(dbList);
        let allCollections : BaseTreeItem[] = [];
        dbList.forEach( (element : any )=> {
            const coll = new BaseTreeItem(element.name);
            coll.command = {
                command: 'appService.openCollection',
                title : '',
                arguments : [element.name]
            };
            allCollections.push(coll);
            dbView.addNewCollections(hostName, dbName, allCollections);
        });
    }

    public async getDataCollection(coll : string) : Promise<string> {
        this.showProgress(`Fetching collection data from data server`);
        const settings = getSettings();
        var url = `mongodb://${settings.username}:${settings.password}@${settings.hostName}:${settings.hostPort}/${settings.database}?retryWrites=true&w=majority`;
        const client = new MongoClient(url, { useUnifiedTopology: true });
        try {
            await client.connect();
            const databasesList = await client.db().collection(coll).find().limit(50).toArray();
            return JSON.stringify(databasesList);
        }catch( ex){
            console.log(ex);
            return '';
        }finally{
            
        }
         
    }

    public showProgress( txt : string) :any {
       return vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: txt,
			cancellable: true
		}, (progress, token) => {
            const p = new Promise(resolve => {
                vscode.commands.registerCommand('appService.stopProgress', () => {
                    resolve();
                });
			});
			return p;
		});
    }


}