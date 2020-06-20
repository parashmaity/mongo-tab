import * as vscode from 'vscode';
import TreeDataProvider from './dataSource/DBTreeViewProvider';
import RegisterDataTreeView from './register/RegisterView';


/**
 * 
 */
export async function ActionRefresh(){
    vscode.window.showInformationMessage('Add Connection from Mongo Tab!');
    
    
}