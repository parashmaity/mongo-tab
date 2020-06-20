import * as vscode from 'vscode';
import TreeDataProvider from '../dataSource/DBTreeViewProvider';

export default class RegisterDataTreeView {

    constructor(){
        vscode.window.registerTreeDataProvider('mongoDBService', new TreeDataProvider());
    }
}