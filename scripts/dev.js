#!/usr/bin/env node

import { spawn } from 'child_process';
import { getPackages, showPackageList, validatePackageNames } from './utils.js';

const packages = getPackages();

// 存储所有正在运行的子进程
const runningProcesses = [];

function cleanup() {
  console.log('\nDev script is exiting.');
  console.log(
    'Note: You may need to manually close the individual terminal windows for each package.'
  );
  process.exit(0);
}

// 监听退出信号
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

function devPackage(pkgName) {
  console.log(`Starting dev mode for ${pkgName} in a new terminal window...`);
  const command = `npx tsup packages/${pkgName}/src/index.ts --config tsup.config.ts --out-dir packages/${pkgName}/dist --watch`;

  const proc = spawn(
    'cmd.exe',
    ['/c', `start "Dev: ${pkgName}" cmd /k "echo Running dev for ${pkgName}... && ${command}"`],
    {
      stdio: 'inherit',
      shell: true,
    }
  );

  runningProcesses.push(proc);

  proc.on('error', error => {
    console.error(`Error starting dev mode for ${pkgName}:`, error);
  });

  proc.on('exit', code => {
    if (code !== 0) {
      console.error(`Process to start dev mode for ${pkgName} exited with code ${code}`);
    }
  });
}

function devAll() {
  console.log('Starting dev mode for all packages in separate terminal windows...');
  console.log('Note: You need to manually close each terminal window to stop the processes.');

  // 并行启动所有包的开发模式
  packages.forEach(pkgName => {
    devPackage(pkgName);
  });
}

const args = process.argv.slice(2);

// 检查是否是列出包的命令
if (args.includes('--list-packages')) {
  showPackageList(packages);
  process.exit(0);
}

// 显示帮助信息
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/dev.js [options] [package1] [package2] ...');
  console.log('Options:');
  console.log('  --list-packages  List all available packages');
  console.log('  --help, -h       Show this help message');
  console.log('  No arguments     Start dev mode for all packages in separate terminal windows');
  console.log(
    '  Package names    Start dev mode for specified packages in separate terminal windows'
  );
  console.log(
    'Note: Each package will run in its own terminal window. You need to manually close these windows to stop the processes.'
  );
  console.log('Available packages:', packages.join(', '));
  process.exit(0);
}

if (args.length === 0) {
  // 没有参数时，启动所有包的开发模式
  devAll();
} else {
  // 检查参数中是否包含有效的包名
  const invalidPackages = validatePackageNames(args, packages);

  if (invalidPackages.length > 0) {
    console.error(`Unknown package(s): ${invalidPackages.join(', ')}`);
    console.error(`Available packages: ${packages.join(', ')}`);
    process.exit(1);
  }

  // 启动指定的多个包的开发模式
  console.log(`Starting dev mode for specified packages: ${args.join(', ')}`);
  console.log(
    'Note: Each package will run in its own terminal window. You need to manually close these windows to stop the processes.'
  );

  args.forEach(pkgName => {
    devPackage(pkgName);
  });
}
