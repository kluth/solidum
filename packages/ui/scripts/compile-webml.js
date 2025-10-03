#!/usr/bin/env node

/**
 * WebML Compiler Script
 *
 * Compiles all .webml files in src/ to .webml.ts files
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple WebML compiler (inline version for build script)
function compileWebML(template) {
  let compiled = template.trim();

  // Convert {{variable}} to ${props.variable}
  compiled = compiled.replace(/\{\{([^#/}][^}]*)\}\}/g, (_match, variable) => {
    const trimmed = variable.trim();
    return `\${props.${trimmed}}`;
  });

  // Convert {{#if condition}} ... {{/if}}
  compiled = compiled.replace(
    /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, condition, content) => {
      const trimmedCondition = condition.trim();
      const trimmedContent = content.trim();
      return `\${props.${trimmedCondition} ? \`${trimmedContent}\` : ''}`;
    }
  );

  // Convert {{#each array}} ... {{/each}}
  compiled = compiled.replace(
    /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_match, array, content) => {
      const trimmedArray = array.trim();
      let itemContent = content.trim();
      itemContent = itemContent.replace(/\{\{item\}\}/g, '${item}');
      itemContent = itemContent.replace(/\{\{@index\}\}/g, '${index}');
      return `\${props.${trimmedArray}.map((item, index) => \`${itemContent}\`).join('')}`;
    }
  );

  const moduleCode = `import { webml } from '@sldm/core';
import type { TemplateResult } from '@sldm/core';

export default function template(props: Record<string, unknown>): TemplateResult {
  return webml\`${compiled}\`;
}
`;

  return moduleCode;
}

function findWebMLFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      findWebMLFiles(filePath, fileList);
    } else if (file.endsWith('.webml')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function compileWebMLFiles() {
  const srcDir = join(__dirname, '..', 'src');
  const webmlFiles = findWebMLFiles(srcDir);

  console.log(`Found ${webmlFiles.length} .webml files`);

  let compiledCount = 0;
  let errors = 0;

  webmlFiles.forEach(file => {
    try {
      const content = readFileSync(file, 'utf-8');
      const compiledCode = compileWebML(content);
      const outputFile = file + '.ts';

      writeFileSync(outputFile, compiledCode, 'utf-8');
      console.log(`✓ Compiled: ${relative(srcDir, file)}`);
      compiledCount++;
    } catch (error) {
      console.error(`✗ Error compiling ${file}:`, error.message);
      errors++;
    }
  });

  console.log(`\n✓ Compiled ${compiledCount} files`);
  if (errors > 0) {
    console.error(`✗ ${errors} errors`);
    process.exit(1);
  }
}

compileWebMLFiles();
