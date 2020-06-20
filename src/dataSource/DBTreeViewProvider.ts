import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface IBaseIcon {
    light : String;
    dark : String,
}

export default class TreeDataProvider implements vscode.TreeDataProvider<BaseTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BaseTreeItem | undefined> = new vscode.EventEmitter<BaseTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<BaseTreeItem | undefined> = this._onDidChangeTreeData.event;

    data: BaseTreeItem[];

    constructor() {
        const dataSource = new BaseTreeItem('Bata Source', []);
        dataSource.iconPath = this.getIcon('source');
        this.data = [ dataSource ];
        //
        this.addHostServer('localhost');
    }

    getTreeItem(element: BaseTreeItem): BaseTreeItem | Thenable<BaseTreeItem> {
        // element.iconPath = {
        //     light: path.join(__filename, '..', '..', '..', 'resources', 'f-icon.svg'),
        //     dark: path.join(__filename, '..', '..', '..', 'resources', 'f-icon.svg')
        // };
        return element;
    }

    getChildren(element?: BaseTreeItem | undefined): vscode.ProviderResult<BaseTreeItem[]> {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }

    public refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public addHostServer(name : any) : void {
        const host = new BaseTreeItem(name, [] );
        host.iconPath = this.getIcon('host');
        this.data[0].children?.push(host);
        this._onDidChangeTreeData.fire(undefined);
    }

    public addNewDatabase() {
        const database = new BaseTreeItem('database', [] );
        database.iconPath = this.getIcon('database');
        this.data[0].children?.push(database);
        this._onDidChangeTreeData.fire(undefined);

    }

    getIcon(iconName : string) : any {
        return {
            light : path.join(__filename, '..', '..', '..', 'resources', 'light', `${iconName}.svg`),
            dark : path.join(__filename, '..', '..', '..', 'resources','dark', `${iconName}.svg`)
        };
    }
}

class BaseTreeItem extends vscode.TreeItem {
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