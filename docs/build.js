import { mkdirSync, writeFileSync, cpSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { renderToString } from './renderer.js';
import { HomePage } from './pages/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, 'dist');

// Clean and create dist directory
if (existsSync(distDir)) {
  cpSync(distDir, distDir + '_backup', { recursive: true, force: true });
}
mkdirSync(distDir, { recursive: true });

// Copy UI styles
cpSync(
  join(__dirname, '../packages/ui/dist/styles.css'),
  join(distDir, 'styles.css')
);

// Generate HTML wrapper
function htmlTemplate(content, title = 'Solidum - Fine-Grained Reactive Framework') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="/solidum/styles.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #1f2937;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
}

// Build pages
console.log('Building documentation site with Solidum...');

// Home page
const homeHtml = renderToString(HomePage());
writeFileSync(join(distDir, 'index.html'), htmlTemplate(homeHtml));

console.log('✓ Documentation site built successfully!');
console.log(`  Output: ${distDir}`);
