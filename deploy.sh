pnpm compile

rm -rf /Users/nan/.vscode/extensions/nan-vcode-tool

mkdir /Users/nan/.vscode/extensions/nan-vcode-tool

cp -r ./dist /Users/nan/.vscode/extensions/nan-vcode-tool/dist
cp ./package.json /Users/nan/.vscode/extensions/nan-vcode-tool/package.json
cp ./README.md /Users/nan/.vscode/extensions/nan-vcode-tool/README.md