#!/usr/bin/env node
/**
 * Update repository URLs in package.json to point to individual repos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

const repoMap = {
  core: 'solidum-core',
  ui: 'solidum-ui',
  router: 'solidum-router',
  store: 'solidum-store',
  context: 'solidum-context',
  ssr: 'solidum-ssr',
  testing: 'solidum-testing',
  utils: 'solidum-utils',
};

// Get all package directories
const packages = fs
  .readdirSync(packagesDir)
  .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory());

console.log('📦 Updating repository URLs...\n');

for (const pkg of packages) {
  const pkgDir = path.join(packagesDir, pkg);
  const pkgJsonPath = path.join(pkgDir, 'package.json');

  if (!fs.existsSync(pkgJsonPath)) {
    console.log(`⚠️  Skipping ${pkg} (no package.json)`);
    continue;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));

  // Update repository URL to individual repo
  const repoName = repoMap[pkg];
  if (repoName) {
    pkgJson.repository = {
      type: 'git',
      url: `git+https://github.com/kluth/${repoName}.git`,
    };
    pkgJson.homepage = `https://github.com/kluth/${repoName}#readme`;
    pkgJson.bugs = {
      url: `https://github.com/kluth/${repoName}/issues`,
    };

    // Write updated package.json
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
    console.log(`✅ Updated ${pkg} -> https://github.com/kluth/${repoName}`);
  } else {
    console.log(`⚠️  No repo mapping for ${pkg}`);
  }
}

console.log('\n✨ All repository URLs updated!');
