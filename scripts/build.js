#!/usr/bin/env node

import { execSync } from 'child_process';
import { getPackages, getSortedPackages, showPackageList, validatePackageNames } from './utils.js';

// 包的依赖关系
const dependencies = {
  utils: [],
  core: ['utils'],
  adapter: ['core', 'utils'],
  plugins: ['core', 'utils'],
  'rc-monitor': ['core', 'adapter'],
};

const packages = getPackages();

// 获取构建顺序
const getBuildOrder = () => {
  return getSortedPackages(packages, dependencies);
};

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
  showPackageList(packages);
  process.exit(0);
}

// 正常的构建逻辑
if (args.length === 0) {
  buildAll();
} else {
  const pkgName = args[0];
  const invalidPackages = validatePackageNames([pkgName], packages);

  if (invalidPackages.length === 0) {
    buildPackage(pkgName);
  } else {
    console.error(`Unknown package: ${pkgName}`);
    console.error(`Available packages: ${packages.join(', ')}`);
    process.exit(1);
  }
}
