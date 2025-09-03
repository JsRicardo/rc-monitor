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

// 包的依赖关系（根据依赖关系排序，先构建依赖少的包）
const getBuildOrder = () => {
  // 定义依赖关系
  const dependencies = {
    utils: [],
    core: ['utils'],
    adapter: ['core', 'utils'],
    plugins: ['core', 'utils'],
    'rc-monitor': ['core', 'adapter'],
  };

  const packages = getPackages();
  // 构建依赖图并拓扑排序
  const order = [];
  const visited = new Set();

  function visit(pkgName) {
    if (visited.has(pkgName)) return;
    visited.add(pkgName);

    // 先访问依赖的包
    const deps = dependencies[pkgName] || [];
    for (const dep of deps) {
      if (packages.includes(dep)) {
        visit(dep);
      }
    }

    order.push(pkgName);
  }

  // 对所有包进行拓扑排序
  for (const pkgName of packages) {
    visit(pkgName);
  }

  return order;
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
  const buildOrder = getBuildOrder();
  console.log(`Build order: ${buildOrder.join(', ')}`);
  buildOrder.forEach(buildPackage);
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
