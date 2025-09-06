import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

/**
 * 获取packages目录下的所有包
 * @returns {string[]} 包名数组
 */
export function getPackages() {
  const packagesDir = join(import.meta.dirname, '../packages');
  return readdirSync(packagesDir).filter(item => {
    const itemPath = join(packagesDir, item);
    // 只返回目录，排除隐藏文件
    return statSync(itemPath).isDirectory() && !item.startsWith('.');
  });
}

/**
 * 根据依赖关系对包进行拓扑排序
 * @param {string[]} packages 包列表
 * @param {Object} dependencies 依赖关系配置
 * @returns {string[]} 排序后的包名数组
 */
export function getSortedPackages(packages, dependencies) {
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
}

/**
 * 获取包的当前版本
 * @param {string} pkgName 包名
 * @returns {string} 版本号
 */
export function getPackageVersion(pkgName) {
  const pkgPath = join(import.meta.dirname, `../packages/${pkgName}/package.json`);
  const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  return pkgJson.version;
}

/**
 * 递增版本号
 * @param {string} currentVersion 当前版本号
 * @param {string} type 版本类型 ('major', 'minor', 'patch')
 * @returns {string} 递增后的版本号
 */
export function incrementVersion(currentVersion, type = 'patch') {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

/**
 * 检查包是否有变更
 * @param {string} pkgName 包名
 * @returns {boolean} 是否有变更
 */
export function hasChanges(pkgName) {
  try {
    const pkgDir = join(import.meta.dirname, `../packages/${pkgName}`);
    // 正确处理带空格的路径，在Windows上用双引号包裹
    const escapedPath = process.platform === 'win32' ? `"${pkgDir}"` : pkgDir;
    const result = execSync(`git status --porcelain ${escapedPath}`, { encoding: 'utf-8' });
    return result.trim().length > 0;
  } catch (error) {
    console.error(`Error checking changes for ${pkgName}:`, error);
    return false;
  }
}

/**
 * 显示包列表帮助信息
 * @param {string[]} packages 包列表
 * @param {Object} dependencies 依赖关系配置（可选）
 */
export function showPackageList(packages, dependencies = null) {
  console.log('Available packages:', packages.join(', '));
  if (dependencies) {
    const sortedPackages = getSortedPackages(packages, dependencies);
    console.log('Release order:', sortedPackages.join(', '));
  }
}

/**
 * 验证包名是否有效
 * @param {string[]} pkgNames 要验证的包名列表
 * @param {string[]} validPackages 有效的包名列表
 * @returns {string[]} 无效的包名列表
 */
export function validatePackageNames(pkgNames, validPackages) {
  return pkgNames.filter(pkgName => !validPackages.includes(pkgName));
}
