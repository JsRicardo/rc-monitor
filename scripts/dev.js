#!/usr/bin/env node

import { execSync, spawn } from 'child_process';

const packages = ['core', 'plugins', 'utils', 'platform', 'rc-monitor'];

function devPackage(pkgName) {
  console.log(`Starting dev mode for ${pkgName}...`);
  try {
    execSync(
      `npx tsup packages/${pkgName}/src/index.ts --dts --format esm,cjs --target es2020 --out-dir packages/${pkgName}/dist --tsconfig packages/${pkgName}/tsconfig.json --watch ${
        pkgName === 'plugins' ? '--external @rc-monitor/core' : ''
      }`,
      {
        stdio: 'inherit',
      }
    );
  } catch (error) {
    console.error(`✗ Dev mode failed for ${pkgName}`);
    process.exit(1);
  }
}

function devAll() {
  console.log('Starting dev mode for all packages...');

  // Start dev mode for all packages sequentially
  // In watch mode, tsup will keep running so we need to run them in sequence
  packages.forEach(pkgName => {
    console.log(`Starting ${pkgName} in dev mode...`);
    devPackage(pkgName);
  });
}

const args = process.argv.slice(2);

console.log('process.argv', args);

if (args.length === 0) {
  devAll();
} else {
  const pkgName = args[0];
  if (packages.includes(pkgName)) {
    devPackage(pkgName);
  } else {
    console.error(`Unknown package: ${pkgName}`);
    console.error(`Available packages: ${packages.join(', ')}`);
    process.exit(1);
  }
}
