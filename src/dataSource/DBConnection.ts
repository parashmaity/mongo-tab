import * as vscode from 'vscode';
import  {TreeDataProvider} from './DBTreeViewProvider';
import  {BaseTreeItem} from './DBTreeViewProvider';
var mongoose = require('mongoose')
    , Admin = mongoose.mongo.Admin;

var {MongoClient} = require('mongodb');

import {getSettings} from '../Settings';

export default class DBConnection {

    //settings = getSettings();

    constructor(dbView: TreeDataProvider) {
        this.connectHost(dbView);

    }

    public connectHost(dbView: TreeDataProvider) {
        //mongoose.connect(`mongodb://${this.settings.username}:${this.settings.password}@${this.settings.hostName}:${this.settings.hostPort}/${this.settings.database}`,
        const settings = getSettings();
        // mongoose.connect(`mongodb://echo_user_one:echo2019@167.172.157.231:20020/echo_dev`,
        mongoose.connect(`mongodb://${settings.username}:${settings.password}@${settings.hostName}:${settings.hostPort}/${settings.database}`,
            { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Database connection successful');
                vscode.window.showInformationMessage("Database connection successful.");
                const con = mongoose.connection;
                const hostName = `${con.host} ( ${con.user} )`;
                dbView.addHostServer(hostName);
                //console.log(mongoose.connection);
                this.getDatabasesFromHost(con, dbView);
            })
            .catch((err: any) => {
                console.error('Database connection error');
                //console.error(err);
                vscode.window.showErrorMessage("Database connection error.");
            });
    }

    public async getDatabasesFromHost(con : any , dbView: TreeDataProvider) {
        const hostName = `${con.host} ( ${con.user} )`;
        dbView.addNewDatabase(hostName, con.db.databaseName);
        this.getCollectionFromDatabases(hostName, con.db.databaseName, dbView);
    }

    public async getCollectionFromDatabases(hostName : string, dbName : string, dbView: TreeDataProvider) {

        const dbList = await mongoose.connection.db.listCollections().toArray();
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
        const settings = getSettings();
        var url = `mongodb://${settings.username}:${settings.password}@${settings.hostName}:${settings.hostPort}/${settings.database}?retryWrites=true&w=majority`;
        try {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            await client.connect();
           //const databasesList = await client.db().admin().listDatabases();
            const databasesList = await client.db().collection(coll).find().limit(30).toArray();
            return JSON.stringify(databasesList);
        }catch( ex){
            console.log(ex);
            return '';
        }
    }
}