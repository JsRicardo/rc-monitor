// ES模块导入
import { execSync, spawnSync } from 'child_process';
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// 获取所有包列表
function getPackages() {
  const packagesDir = join(import.meta.dirname, '../packages');
  return readdirSync(packagesDir).filter(item => {
    const itemPath = join(packagesDir, item);
    // 只返回目录，排除隐藏文件
    return statSync(itemPath).isDirectory() && !item.startsWith('.');
  });
}

const packages = getPackages();

// 包的依赖顺序（根据依赖关系排序，先发布依赖少的包）
const getReleaseOrder = () => {
  // 定义依赖关系
  const dependencies = {
    utils: [],
    core: ['utils'],
    adapter: ['core', 'utils'],
    plugins: ['core', 'utils'],
    'rc-monitor': ['core', 'adapter'],
  };

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

// 检查包是否有变更
const hasChanges = pkgName => {
  try {
    const pkgDir = join(import.meta.dirname, `../packages/${pkgName}`);
    const result = execSync(`git status --porcelain ${pkgDir}`, { encoding: 'utf-8' });
    return result.trim().length > 0;
  } catch (error) {
    console.error(`Error checking changes for ${pkgName}:`, error);
    return false;
  }
};

// 获取包的当前版本
const getPackageVersion = pkgName => {
  const pkgPath = join(import.meta.dirname, `../packages/${pkgName}/package.json`);
  const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  return pkgJson.version;
};

// 递增版本号
const incrementVersion = (currentVersion, type = 'patch') => {
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
};

// 更新包的版本号（如果需要）
const updatePackageVersion = (pkgName, version) => {
  const pkgPath = join(import.meta.dirname, `../packages/${pkgName}/package.json`);
  const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  if (version) {
    pkgJson.version = version;
  } else {
    // 如果没有指定版本号，尝试从命令行参数中获取版本类型
    const args = process.argv.slice(2);
    const versionTypeIndex = args.findIndex(
      arg => arg === '--major' || arg === '--minor' || arg === '--patch'
    );

    if (versionTypeIndex !== -1) {
      const versionType = args[versionTypeIndex].substring(2); // 去除'--'
      pkgJson.version = incrementVersion(pkgJson.version, versionType);
      console.log(`📈 Incremented ${pkgName} version to ${pkgJson.version}`);
    }
  }

  // 确保有publishConfig配置
  if (!pkgJson.publishConfig) {
    pkgJson.publishConfig = { access: 'public' };
  }

  // 确保有必要的package.json字段
  const requiredFields = {
    name: pkgJson.name,
    version: pkgJson.version,
    description: pkgJson.description,
    main: pkgJson.main,
    module: pkgJson.module,
    types: pkgJson.types,
    files: pkgJson.files || ['dist'],
    author: pkgJson.author || 'Js Ricardo',
    license: pkgJson.license || 'MIT',
    publishConfig: pkgJson.publishConfig,
  };

  // 合并更新后的配置
  const updatedPkgJson = { ...pkgJson, ...requiredFields };

  // 写回文件
  writeFileSync(pkgPath, JSON.stringify(updatedPkgJson, null, 2), 'utf-8');
  console.log(`📝 Updated ${pkgName}/package.json with required publish fields`);
};

// 检查npm登录状态
function checkNpmLogin() {
  try {
    execSync('npm whoami', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// 全局标志，用于测试模式
let isDryRun = false;

// 存储原始的file依赖，用于发布后恢复
const originalFileDependencies = new Map();

// 存储已发布包的最新版本
const publishedPackageVersions = new Map();

/**
 * 将包中的file协议依赖转换为版本依赖
 * @param {string} pkgName 包名
 */
function convertFileDependenciesToVersion(pkgName) {
  console.log(`🔄 Converting file dependencies to version dependencies for ${pkgName}...`);

  const pkgPath = join(import.meta.dirname, `../packages/${pkgName}/package.json`);
  const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  // 保存原始的file依赖信息
  const fileDeps = {};
  let hasFileDeps = false;

  // 检查dependencies
  if (pkgJson.dependencies) {
    for (const [depName, fileVersion] of Object.entries(pkgJson.dependencies)) {
      if (typeof fileVersion === 'string' && fileVersion.startsWith('file:')) {
        hasFileDeps = true;
        fileDeps[depName] = fileVersion;

        // 找到对应的包名
        const depPkgName = fileVersion.replace('file:../', '').replace(/\\/g, '/');

        // 优先使用已发布的最新版本，如果没有则使用本地版本
        let version = publishedPackageVersions.get(depPkgName);
        if (!version) {
          version = getPackageVersion(depPkgName);
        }
        pkgJson.dependencies[depName] = `^${version}`;

        console.log(`  - ${depName}: ${fileVersion} -> ${version}`);
      }
    }
  }

  // 检查devDependencies
  if (pkgJson.devDependencies) {
    for (const [depName, fileVersion] of Object.entries(pkgJson.devDependencies)) {
      if (typeof fileVersion === 'string' && fileVersion.startsWith('file:')) {
        hasFileDeps = true;
        fileDeps[depName] = fileVersion;

        // 找到对应的包名
        const depPkgName = fileVersion.replace('file:../', '').replace(/\\/g, '/');

        // 优先使用已发布的最新版本，如果没有则使用本地版本
        let version = publishedPackageVersions.get(depPkgName);
        if (!version) {
          version = getPackageVersion(depPkgName);
        }
        pkgJson.devDependencies[depName] = version;

        console.log(`  - ${depName}: ${fileVersion} -> ${version}`);
      }
    }
  }

  // 如果有file依赖，保存原始信息并更新package.json
  if (hasFileDeps) {
    originalFileDependencies.set(pkgName, { pkgJsonPath: pkgPath, fileDependencies: fileDeps });
    writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2), 'utf-8');
    console.log(`✅ File dependencies for ${pkgName} converted to version dependencies`);
  } else {
    console.log(`ℹ️  No file dependencies found for ${pkgName}`);
  }
}

/**
 * 恢复包中的file协议依赖
 * @param {string} pkgName 包名
 */
function restoreFileDependencies(pkgName) {
  const originalInfo = originalFileDependencies.get(pkgName);

  if (!originalInfo) {
    console.log(`ℹ️  No original file dependencies to restore for ${pkgName}`);
    return;
  }

  console.log(`🔄 Restoring file dependencies for ${pkgName}...`);

  const { pkgJsonPath, fileDependencies } = originalInfo;
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));

  // 恢复dependencies
  if (pkgJson.dependencies) {
    for (const [depName, depPath] of Object.entries(fileDependencies)) {
      if (pkgJson.dependencies[depName]) {
        pkgJson.dependencies[depName] = depPath;
        console.log(`  - ${depName}: restored to ${depPath}`);
      }
    }
  }

  // 恢复devDependencies
  if (pkgJson.devDependencies) {
    for (const [depName, depPath] of Object.entries(fileDependencies)) {
      if (pkgJson.devDependencies[depName]) {
        pkgJson.devDependencies[depName] = depPath;
        console.log(`  - ${depName}: restored to ${depPath}`);
      }
    }
  }

  writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2), 'utf-8');
  console.log(`✅ File dependencies for ${pkgName} restored`);

  // 清理已恢复的信息
  originalFileDependencies.delete(pkgName);
}

// 发布单个包
function publishPackage(pkgName) {
  console.log(`\n🚀 Publishing ${pkgName}...`);

  // 预先定义包信息变量，确保在catch块中也能访问
  let pkgJson = null;
  let pkgDir = null;

  try {
    // 进入包目录
    pkgDir = join(import.meta.dirname, `../packages/${pkgName}`);

    // 读取包的package.json
    const pkgJsonPath = join(pkgDir, 'package.json');
    pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));

    // 检查npm登录状态 (仅在非测试模式下检查)
    if (!isDryRun && !checkNpmLogin()) {
      console.error('❌ You are not logged in to npm. Please run "npm login" first.');
      return false;
    }

    // 在构建前将file依赖转换为版本依赖
    convertFileDependenciesToVersion(pkgName);

    // 先构建包
    execSync(`node scripts/build.js ${pkgName}`, {
      stdio: 'inherit',
    });

    // 更新package.json，确保包含所有必要字段
    updatePackageVersion(pkgName);

    // 检查是否使用了作用域
    let publishCommand = 'npm publish';
    if (pkgJson.name.startsWith('@')) {
      const scope = pkgJson.name.split('/')[0];
      console.log(`🔍 Using npm scope: ${scope}`);

      // 确保作用域已在npm上创建
      // 在实际发布前，让用户确认是否已创建作用域
      console.log(`💡 Please make sure you have created the scope "${scope}" on npm.`);
      console.log(`💡 If not, visit: https://www.npmjs.com/org/create`);

      // 添加公开访问权限标记（如果尚未设置）
      if (!pkgJson.publishConfig?.access || pkgJson.publishConfig.access !== 'public') {
        publishCommand += ' --access public';
        console.log(`🔓 Adding "--access public" flag for scoped package`);
      }
    }

    // 执行npm publish命令或模拟发布（测试模式）
    console.log(`Running: ${publishCommand}`);

    if (isDryRun) {
      console.log(`🔧 Dry run mode: Skipping actual npm publish.`);
      console.log(`🔧 Would publish package: ${pkgJson.name}@${pkgJson.version}`);
      console.log(`🔧 To publish for real, remove the --dry-run flag.`);
    } else {
      execSync(publishCommand, {
        cwd: pkgDir,
        stdio: 'inherit',
      });
    }

    console.log(`✅ ${pkgName} published successfully`);

    // 更新已发布包的最新版本
    const updatedPkgJson = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf-8'));
    publishedPackageVersions.set(pkgName, updatedPkgJson.version);
    console.log(`📝 Updated published version for ${pkgName}: ${updatedPkgJson.version}`);

    // 发布成功后恢复file依赖
    restoreFileDependencies(pkgName);

    return true;
  } catch (error) {
    console.error(`❌ Failed to publish ${pkgName}`);
    console.error(error);

    // 即使发布失败，也要恢复file依赖
    restoreFileDependencies(pkgName);

    // 提供具体的错误处理建议
    if (error.status === 1) {
      // 对于npm发布错误，提供通用的解决方案
      console.error('💡 Common solutions for npm publish errors:');
      console.error('1. Make sure you are logged in: npm login');
      console.error('2. For scoped packages, ensure the scope exists on npm');
      console.error('   - Visit: https://www.npmjs.com/org/create');
      console.error('3. Check your package name for uniqueness');
      console.error('4. Try running with --dry-run to test without publishing');

      // 特别处理作用域未找到的情况
      if (pkgJson.name.startsWith('@')) {
        const scope = pkgJson.name.split('/')[0];
        console.error(`\n💡 Specific to your case:`);
        console.error(`- Your package uses scope "${scope}"`);
        console.error(`- This scope might not exist on npm yet`);
        console.error(`- To create it: https://www.npmjs.com/org/create`);
        console.error(`- Or change the package name in package.json to remove the scope`);
      }
    } else if (!checkNpmLogin() && !isDryRun) {
      console.error('💡 Solution: Run "npm login" to log in to your npm account.');
    }

    return false;
  }
}

// 全量发布
function publishAll() {
  console.log('📦 Starting full release for all packages...');
  const releaseOrder = getReleaseOrder();

  let allSuccess = true;
  for (const pkgName of releaseOrder) {
    if (!publishPackage(pkgName)) {
      allSuccess = false;
      break;
    }
  }

  if (allSuccess) {
    console.log('\n🎉 All packages published successfully!');
  } else {
    console.log('\n⚠️  Release process completed with errors.');
    process.exit(1);
  }
}

// 增量发布
function publishChanged() {
  console.log('🔍 Checking for changed packages...');
  const changedPackages = packages.filter(hasChanges);

  if (changedPackages.length === 0) {
    console.log('✅ No changes detected. Nothing to publish.');
    return;
  }

  console.log(
    `📦 Found ${changedPackages.length} changed package(s): ${changedPackages.join(', ')}`
  );

  // 根据依赖顺序排序变更的包
  const releaseOrder = getReleaseOrder().filter(pkgName => changedPackages.includes(pkgName));

  let allSuccess = true;
  for (const pkgName of releaseOrder) {
    if (!publishPackage(pkgName)) {
      allSuccess = false;
      break;
    }
  }

  if (allSuccess) {
    console.log('\n🎉 All changed packages published successfully!');
  } else {
    console.log('\n⚠️  Incremental release process completed with errors.');
    process.exit(1);
  }
}

// 指定发布
function publishSpecific(pkgNames) {
  console.log(`🎯 Publishing specific package(s): ${pkgNames.join(', ')}`);

  // 验证包名是否存在
  const invalidPackages = pkgNames.filter(pkgName => !packages.includes(pkgName));
  if (invalidPackages.length > 0) {
    console.error(`❌ Unknown package(s): ${invalidPackages.join(', ')}`);
    console.error(`Available packages: ${packages.join(', ')}`);
    process.exit(1);
  }

  // 根据依赖顺序排序指定的包
  const releaseOrder = getReleaseOrder().filter(pkgName => pkgNames.includes(pkgName));

  let allSuccess = true;
  for (const pkgName of releaseOrder) {
    if (!publishPackage(pkgName)) {
      allSuccess = false;
      break;
    }
  }

  if (allSuccess) {
    console.log('\n🎉 All specified packages published successfully!');
  } else {
    console.log('\n⚠️  Specific release process completed with errors.');
    process.exit(1);
  }
}

// 帮助信息
function showHelp() {
  console.log(`\n📚 rc-monitor Release Script\n`);
  console.log(`Usage: node scripts/release.js [options]\n`);
  console.log(`Options:`);
  console.log(`  --all           Publish all packages`);
  console.log(`  --changed       Publish only changed packages (incremental release)`);
  console.log(
    `  --package <pkg> Publish specific package(s). Multiple packages can be separated by commas.`
  );
  console.log(`  --dry-run       Test the release process without actually publishing`);
  console.log(`  --list-packages List all available packages`);
  console.log(`  --major         Increment major version (X.0.0)`);
  console.log(`  --minor         Increment minor version (0.X.0)`);
  console.log(`  --patch         Increment patch version (0.0.X)`);
  console.log(`  --help          Show this help message\n`);
  console.log(`Examples:`);
  console.log(`  node scripts/release.js --all`);
  console.log(`  node scripts/release.js --changed`);
  console.log(`  node scripts/release.js --package core,utils`);
  console.log(`  node scripts/release.js --all --patch`);
  console.log(`  node scripts/release.js --changed --minor`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  // 显示帮助信息
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  // 设置测试模式
  if (args.includes('--dry-run')) {
    isDryRun = true;
    console.log('🔧 Running in dry-run mode. No actual publishing will occur.');
    // 从参数中移除--dry-run，避免影响其他命令
    args.splice(args.indexOf('--dry-run'), 1);
  }

  // 列出所有包
  if (args.includes('--list-packages')) {
    console.log('Available packages:', packages.join(', '));
    console.log('Release order:', getReleaseOrder().join(', '));
    return;
  }

  // 全量发布
  if (args.includes('--all')) {
    publishAll();
    return;
  }

  // 增量发布
  if (args.includes('--changed')) {
    publishChanged();
    return;
  }

  // 指定发布
  const packageIndex = args.findIndex(arg => arg === '--package' || arg === '-p');
  if (packageIndex !== -1 && packageIndex + 1 < args.length) {
    const pkgNames = args[packageIndex + 1].split(',').map(pkg => pkg.trim());
    publishSpecific(pkgNames);
    return;
  }

  // 参数无效
  console.error('❌ Invalid arguments');
  showHelp();
  process.exit(1);
}

// 执行主函数
main();
