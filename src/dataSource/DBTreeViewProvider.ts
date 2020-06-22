import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface IBaseIcon {
    light : String;
    dark : String,
}

export class TreeDataProvider implements vscode.TreeDataProvider<BaseTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BaseTreeItem | undefined> = new vscode.EventEmitter<BaseTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<BaseTreeItem | undefined> = this._onDidChangeTreeData.event;

    data: BaseTreeItem[] = [];
    hostServer : BaseTreeItem[] = [];

    constructor() {
        this.refresh();
    }

    getTreeItem(element: BaseTreeItem): BaseTreeItem | Thenable<BaseTreeItem> {
        return element;
    }

    getChildren(element?: BaseTreeItem | undefined): vscode.ProviderResult<BaseTreeItem[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }

    public refresh(): void {
        this.data = [];
        const settings = new BaseTreeItem('Settings', undefined);
        settings.iconPath = this.getIcon('settings');
        settings.command = {
            command: 'appService.settings',
            title : ''
        };
        this.data.push(settings);
        const dataSource = new BaseTreeItem('Data Source', []);
        dataSource.iconPath = this.getIcon('source');
        this.data.push(dataSource);
        this._onDidChangeTreeData.fire(undefined);
    }

    public addHostServer(name : any) : void {
        const host = new BaseTreeItem(name, [] );
        host.iconPath = this.getIcon('host');
        this.hostServer.push(host);
        this.data[1].children = this.hostServer ;
        this._onDidChangeTreeData.fire(undefined);
    }

    public addNewDatabase( hostName : string, name : string) {
        const database = new BaseTreeItem(name, [] );
        database.iconPath = this.getIcon('database');
        //console.log(this.data);
        this.data[1].children?.map(h => {
            if ( h.label === hostName){
                h.children?.push(database);
                this._onDidChangeTreeData.fire(undefined);
            }
        });

    }

    public addNewCollections( hostName : string, dbName : string, collections : BaseTreeItem[]) {
        this.data[1].children?.map(h => {
            if ( h.label === hostName){
                h.children?.map(n => {
                    if ( n.label === dbName){
                        collections.map(d => {
                            d.iconPath = this.getIcon('collection');
                            //n.children?.push(d);
                        });
                        n.children = collections;
                        this._onDidChangeTreeData.fire(undefined);
                    }
                });
            }
        });
    }

    public getHostByName(name : string) : BaseTreeItem {
        const host = this.data[1].children;
        host?.map(h => {
            if ( h.label === name){
                return h;
            }
        });
        return new BaseTreeItem(name, []);
    }

    getIcon(iconName : string) : any {
        return {
            light : path.join(__filename, '..', '..', '..', 'resources', 'light', `${iconName}.svg`),
            dark : path.join(__filename, '..', '..', '..', 'resources','dark', `${iconName}.svg`)
        };
    }
}

export class BaseTreeItem extends vscode.TreeItem {
    children: BaseTreeItem[] | undefined;

    constructor(label: string, children?: BaseTreeItem[]) {
        super(
            label,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                vscode.TreeItemCollapsibleState.Expanded);
        this.children = children;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', '..', 'resources', 'icon.svg'),
        dark: path.join(__filename, '..', '..', '..', 'resources', 'icon.svg')
    };
}