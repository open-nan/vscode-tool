import * as vscode from 'vscode';
import ignore from 'ignore';
import * as fs  from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';


export const buildZip = vscode.commands.registerCommand('nanzip.pack', () => {
  // The code you place here will be executed every time your command is executed
  // Display a message box to the user

  // 获取当前工作区 
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const workspaceFolder = workspaceFolders?.[0] as vscode.WorkspaceFolder;
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('err: 找不到工作区, 请使用当前窗口打开工程文件');
    throw new Error('err: 找不到工作区, 请使用当前窗口打开工程文件');
  }
  const targerFiles:string[] = [];

  // 拷贝目标文件
  async function copyTargerFile(): Promise<string> {
    try{
      // 创建零时目录
      fs.rmSync(path.join(__dirname, '.temp'), { recursive: true, force: true });
      const tempDir = fs.mkdirSync(path.join(__dirname, '.temp'), { recursive: true });
      if(tempDir===undefined){
        throw new Error('创建零时目录失败');
      }

      // 获取工作区下所有的文件与目录
      let workspaceFilesAndDirs = await vscode.workspace.findFiles('**',''); // 使用项目根目录

      // 如果有工作区下有gitignore文件，就安装gitignore文件忽略指定的目录
      const gitignoreFilePath = path.join(workspaceFolder.uri.fsPath, '.gitignore');
      let gitignoreContent = fs.existsSync(gitignoreFilePath)? fs.readFileSync(gitignoreFilePath, 'utf8'):'';
      const ig = ignore().add(gitignoreContent);

      // 
      workspaceFilesAndDirs.forEach((item)=>{
        const relativePath = path.relative(workspaceFolder.uri.fsPath, item.fsPath);
        if (ig.ignores(relativePath)) {
          return;
        }
        const targetFilePath = path.join(tempDir, relativePath);
        fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
        fs.copyFileSync(item.fsPath, targetFilePath);
        targerFiles.push(targetFilePath);
      });

      return tempDir;
    }catch(err){
      vscode.window.showErrorMessage(err as string);
      throw new Error(err as string);
    }	
  }

  // 压缩文件
  async function buildZip(outPath: string){

    const outputPath = `${workspaceFolder.uri.fsPath}/${workspaceFolder.name}.zip`;
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // 压缩级别（可选）
    });

    // 为输出流添加事件处理程序
    output.on('close', () => {
      vscode.window.showInformationMessage(`${outputPath} 文件已创建，共 ${archive.pointer()} 字节`);
    });

    archive.on('error', (err) => {
      throw err;
    });

    // 添加文件夹到 ZIP
    archive.directory(outPath, false);

    // 将 ZIP 数据管道到输出流
    archive.pipe(output);

    // 完成并关闭 ZIP 文件
    archive.finalize();
  }

  !(async () =>{
    const outPath = await copyTargerFile().then(res=>{
      return res;
    });

    await buildZip(outPath);
  })();
});