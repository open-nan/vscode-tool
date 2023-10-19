# nan/vscode-tool README

使用方法：
  使用 vscode 打开项目
  在 vscode 的 Task 中输入对应的命令

## 将项目打包成为压缩zip文件
将项目打包成为压缩zip文件，并自动忽略.gitignore中的文件
``` sh
nan:build zip
```


## 快速递归清除本地node依赖包
``` sh
nan:build zip
```

MacOS/Linux 相当于执行: 
```sh
$ find . -name "node_modules" -type d -prune -exec rm -rf {} +
```

Windows 相当于执行: 
```sh
$ FOR /d /r . %d in (node_modules) DO @IF EXIST "%d" rm -rf "%d"
```