#!/usr/bin/env node

/**
 * Build CSS by concatenating all CSS files
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cssDir = join(__dirname, '..', 'src', 'styles');
const outputFile = join(__dirname, '..', 'dist', 'styles.css');

// Read all CSS files
const chalkCss = readFileSync(join(cssDir, 'chalk.css'), 'utf8');
const componentsCss = readFileSync(join(cssDir, 'components.css'), 'utf8');

// Concatenate
const fullCss = `${chalkCss}\n\n${componentsCss}`;

// Ensure dist directory exists
if (!existsSync(join(__dirname, '..', 'dist'))) {
  mkdirSync(join(__dirname, '..', 'dist'), { recursive: true });
}

// Write output
writeFileSync(outputFile, fullCss);

// eslint-disable-next-line no-console
console.log('✓ Chalkboard CSS built successfully');
