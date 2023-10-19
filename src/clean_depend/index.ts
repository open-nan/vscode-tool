import * as vscode from 'vscode';
import  * as os from 'os';
const { exec } = require('child_process');



export const cleanDepend = vscode.commands.registerCommand('clean.depend', () => {
  // The code you place here will be executed every time your command is executed
  // Display a message box to the user

  // 获取当前工作区 
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const workspaceFolder = workspaceFolders?.[0] as vscode.WorkspaceFolder;
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('err: 找不到工作区, 请使用当前窗口打开工程文件');
    throw new Error('err: 找不到工作区, 请使用当前窗口打开工程文件');
  }

  // 移除工作区下的node_modules
  const platform = os.platform();
  let command = '';
  if (platform === 'darwin') {
    command = `find ${workspaceFolder.uri.path} -name "node_modules" -type d -prune -exec rm -rf {} +`;
  } else if (platform === 'win32') {
    command = `FOR /d /r ${workspaceFolder.uri.path} %d in (node_modules) DO @IF EXIST "%d" rm -rf "%d"`;
  }

  exec(command, (error: Error) => {
    if (error) {
      console.error(`Error: ${error}`);
      vscode.window.showErrorMessage(`删除 node_modules 文件夹时出错: ${error.message}`);
    } else {
      vscode.window.showInformationMessage('node_modules 文件夹已成功删除！');
    }
  });
});