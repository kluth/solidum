#!/usr/bin/env node
/**
 * Update package organization from @solidum to @sldm
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

console.log('📦 Updating organization name from @solidum to @sldm...\n');

// Update all package.json files
const packages = fs
  .readdirSync(packagesDir)
  .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory());

for (const pkg of packages) {
  const pkgDir = path.join(packagesDir, pkg);
  const pkgJsonPath = path.join(pkgDir, 'package.json');

  if (!fs.existsSync(pkgJsonPath)) continue;

  let content = fs.readFileSync(pkgJsonPath, 'utf-8');
  const originalContent = content;

  // Update package name
  content = content.replace(/@solidum\//g, '@sldm/');

  if (content !== originalContent) {
    fs.writeFileSync(pkgJsonPath, content);
    console.log(`✅ Updated ${pkg}`);
  }
}

// Update root package.json
const rootPkgPath = path.join(rootDir, 'package.json');
let rootContent = fs.readFileSync(rootPkgPath, 'utf-8');
const originalRoot = rootContent;

rootContent = rootContent.replace(/@solidum\//g, '@sldm/');

if (rootContent !== originalRoot) {
  fs.writeFileSync(rootPkgPath, rootContent);
  console.log('✅ Updated root package.json');
}

// Update prepare-publish.js
const preparePublishPath = path.join(rootDir, 'scripts', 'prepare-publish.js');
if (fs.existsSync(preparePublishPath)) {
  let prepContent = fs.readFileSync(preparePublishPath, 'utf-8');
  const originalPrep = prepContent;

  prepContent = prepContent.replace(/@solidum\//g, '@sldm/');

  if (prepContent !== originalPrep) {
    fs.writeFileSync(preparePublishPath, prepContent);
    console.log('✅ Updated prepare-publish.js');
  }
}

console.log('\n✨ Organization name updated to @sldm!');
console.log('\n⚠️  Note: You may need to update import statements in source files manually.');
