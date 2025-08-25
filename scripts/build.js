#!/usr/bin/env node

import { execSync } from 'child_process';

const packages = ['core', 'plugins', 'utils', 'platform', 'rc-monitor'];

function buildPackage(pkgName) {
  console.log(`Building ${pkgName}...`);
  try {
    execSync(
      `npx tsup packages/${pkgName}/src/index.ts --dts --format esm,cjs --target es2020 --out-dir packages/${pkgName}/dist --tsconfig packages/${pkgName}/tsconfig.json ${
        pkgName === 'plugins' ? '--external @rc-monitor/core' : ''
      }`,
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
