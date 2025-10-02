#!/usr/bin/env node
/**
 * Prepare all packages for npm publishing
 * - Adds npm metadata to package.json files
 * - Updates workspace dependencies to version references
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

const commonMetadata = {
  author: {
    name: 'Matthias Kluth',
    email: 'matthias.kluth@prodot.de',
  },
  license: 'MIT',
  repository: {
    type: 'git',
    url: 'git+https://github.com/kluth/solidum.git',
  },
  homepage: 'https://kluth.github.io/solidum',
  bugs: {
    url: 'https://github.com/kluth/solidum/issues',
  },
  publishConfig: {
    access: 'public',
  },
};

const packageKeywords = {
  core: ['solidum', 'reactive', 'framework', 'fine-grained', 'signals', 'atoms'],
  ui: ['solidum', 'ui', 'components', 'glassmorphism', '3d', 'interactive'],
  router: ['solidum', 'router', 'spa', 'routing'],
  store: ['solidum', 'state', 'store', 'state-management'],
  context: ['solidum', 'context', 'dependency-injection'],
  ssr: ['solidum', 'ssr', 'server-side-rendering'],
  testing: ['solidum', 'testing', 'test-runner'],
  utils: ['solidum', 'utils', 'utilities', 'helpers'],
};

// Get all package directories
const packages = fs
  .readdirSync(packagesDir)
  .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory());

console.log('📦 Preparing packages for publishing...\n');

for (const pkg of packages) {
  const pkgDir = path.join(packagesDir, pkg);
  const pkgJsonPath = path.join(pkgDir, 'package.json');

  if (!fs.existsSync(pkgJsonPath)) {
    console.log(`⚠️  Skipping ${pkg} (no package.json)`);
    continue;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));

  // Add common metadata
  Object.assign(pkgJson, commonMetadata);

  // Add keywords
  pkgJson.keywords = packageKeywords[pkg] || ['solidum'];

  // Ensure files field exists
  if (!pkgJson.files) {
    pkgJson.files = ['dist'];
  }

  // Update workspace dependencies to version references
  const currentVersion = pkgJson.version;
  if (pkgJson.dependencies) {
    for (const [dep, ver] of Object.entries(pkgJson.dependencies)) {
      if (ver === 'workspace:*') {
        pkgJson.dependencies[dep] = `^${currentVersion}`;
      }
    }
  }

  // Write updated package.json
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log(`✅ Updated ${pkg}`);
}

console.log('\n✨ All packages prepared for publishing!');
