#!/usr/bin/env node
const { exec } = require("child_process");
const args = process.argv.slice(2); // 获取命令行参数

if (!args[0]) {
  console.error("请指定迁移文件名，例如：pnpm migrate your-file.ts");
  process.exit(1);
}

const file = `./server/migrations/${args[0]}.ts`;
console.log(`执行迁移脚本: ${file}`);

exec(`tsx ${file}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行出错: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});
