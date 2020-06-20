
import * as vscode from 'vscode';
import RegisterDataTreeView from './register/RegisterView';
import RegisterCommandEvent from './register/RegisterEvent';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "mongo-tab" is now active!');

	// register all view tree
	//new RegisterDataTreeView();

	// register all action commands
	new RegisterCommandEvent(context);

	
}


export function deactivate() {}
