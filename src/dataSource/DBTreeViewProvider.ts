import * as vscode from 'vscode';

export default class TreeDataProvider implements vscode.TreeDataProvider<BaseTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BaseTreeItem | undefined> = new vscode.EventEmitter<BaseTreeItem| undefined>();
    readonly onDidChangeTreeData: vscode.Event<BaseTreeItem|undefined> = this._onDidChangeTreeData.event;
  
    data: BaseTreeItem[];
  
    constructor() {
      this.data = [new BaseTreeItem('Bata Source') ];
      //this.data.push(new TreeItem('localhost'));
    }
  
    getTreeItem(element: BaseTreeItem): BaseTreeItem|Thenable<BaseTreeItem> {
      return element;
    }
  
    getChildren(element?: BaseTreeItem|undefined): vscode.ProviderResult<BaseTreeItem[]> {
      if (element === undefined) {
        return this.data;
      }
      return element.children;
    }

    public refresh() : void {
        this.data.push(new BaseTreeItem('localhost', [new BaseTreeItem('gg')]));
        this._onDidChangeTreeData.fire(undefined);
    }

    public addNew(){
        this.data.push(new BaseTreeItem('localhost', [new BaseTreeItem('gg')]));
        this._onDidChangeTreeData.fire(new BaseTreeItem('gg'));
        console.log(this.data);
    }
  }
  
  class BaseTreeItem extends vscode.TreeItem {
    children: BaseTreeItem[]|undefined;
  
    constructor(label: string, children?: BaseTreeItem[]) {
      super(
          label,
          children === undefined ? vscode.TreeItemCollapsibleState.None :
                                   vscode.TreeItemCollapsibleState.Expanded);
      this.children = children;
    }
  }