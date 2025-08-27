#!/usr/bin/env node

import { spawn } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// 自动获取packages目录下的所有包
const getPackages = () => {
  const packagesDir = join(import.meta.dirname, '../packages');
  return readdirSync(packagesDir).filter(item => {
    const itemPath = join(packagesDir, item);
    // 只返回目录，排除隐藏文件
    return statSync(itemPath).isDirectory() && !item.startsWith('.');
  });
};

const packages = getPackages();

// 存储所有正在运行的子进程
const runningProcesses = [];

// 清理函数：终止所有正在运行的子进程
function cleanup() {
  console.log('Cleaning up and terminating all processes...');
  runningProcesses.forEach(proc => {
    if (proc && !proc.killed) {
      proc.kill();
    }
  });
  process.exit(0);
}

// 监听退出信号
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function devPackage(pkgName) {
  console.log(`Starting dev mode for ${pkgName}...`);

  const externalFlag = pkgName === 'plugins' ? '--external @rc-monitor/core' : '';
  const command = `npx tsup packages/${pkgName}/src/index.ts --dts --format esm,cjs --target es2020 --out-dir packages/${pkgName}/dist --tsconfig tsconfig.json --watch ${externalFlag}`;

  const proc = spawn('cmd.exe', ['/c', command], {
    stdio: 'inherit',
    shell: true,
  });

  runningProcesses.push(proc);

  proc.on('error', error => {
    console.error(`Error starting dev mode for ${pkgName}:`, error);
  });

  proc.on('exit', code => {
    if (code !== 0) {
      console.error(`Dev mode for ${pkgName} exited with code ${code}`);
    }
  });
}

function devAll() {
  console.log('Starting dev mode for all packages in parallel...');
  console.log('(Press Ctrl+C to stop all processes)');

  // 并行启动所有包的开发模式
  packages.forEach(pkgName => {
    devPackage(pkgName);
  });
}

const args = process.argv.slice(2);

// 检查是否是列出包的命令
if (args.includes('--list-packages')) {
  console.log('Available packages:', packages.join(', '));
  process.exit(0);
}

// 显示帮助信息
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/dev.js [options] [package1] [package2] ...');
  console.log('Options:');
  console.log('  --list-packages  List all available packages');
  console.log('  --help, -h       Show this help message');
  console.log('  No arguments     Start dev mode for all packages in parallel');
  console.log('  Package names    Start dev mode for specified packages in parallel');
  console.log('Available packages:', packages.join(', '));
  process.exit(0);
}

if (args.length === 0) {
  // 没有参数时，启动所有包的开发模式
  devAll();
} else {
  // 检查参数中是否包含有效的包名
  const invalidPackages = args.filter(pkgName => !packages.includes(pkgName));

  if (invalidPackages.length > 0) {
    console.error(`Unknown package(s): ${invalidPackages.join(', ')}`);
    console.error(`Available packages: ${packages.join(', ')}`);
    process.exit(1);
  }

  // 启动指定的多个包的开发模式（并行）
  console.log(`Starting dev mode for specified packages: ${args.join(', ')}`);
  console.log('(Press Ctrl+C to stop all processes)');

  args.forEach(pkgName => {
    devPackage(pkgName);
  });
}
