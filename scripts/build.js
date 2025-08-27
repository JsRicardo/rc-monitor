#!/usr/bin/env node

import { execSync } from 'child_process';
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

function buildPackage(pkgName) {
  console.log(`Building ${pkgName}...`);
  try {
    execSync(
      `npx tsup packages/${pkgName}/src/index.ts --config tsup.config.ts --out-dir packages/${pkgName}/dist`,
      {
        stdio: 'inherit',
      }
    );
    console.log(`✓ ${pkgName} built successfully`);
  } catch (error) {
    console.error(`✗ Failed to build ${pkgName}`);
    process.exit(1);
  }
}

function buildAll() {
  console.log('Building all packages...');
  packages.forEach(buildPackage);
  console.log('✓ All packages built successfully');
}

const args = process.argv.slice(2);

// 检查是否是列出包的命令
if (args.includes('--list-packages')) {
  console.log('Available packages:', packages.join(', '));
  process.exit(0);
}

// 正常的构建逻辑
if (args.length === 0) {
  buildAll();
} else {
  const pkgName = args[0];
  if (packages.includes(pkgName)) {
    buildPackage(pkgName);
  } else {
    console.error(`Unknown package: ${pkgName}`);
    console.error(`Available packages: ${packages.join(', ')}`);
    process.exit(1);
  }
}
