

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { buildZip } from './build_zip';

class ProgressBar{
	bar: vscode.StatusBarItem;

	set text(value:string){
		this.bar.text = value;
		console.log(value);
		this.show();
	}
	
	constructor(){
		this.bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	}

	show(){
		this.bar.show();
	}

	hide(){
		this.bar.hide();
	};	
}



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(buildZip);
}

// This method is called when your extension is deactivated
export function deactivate() {}
