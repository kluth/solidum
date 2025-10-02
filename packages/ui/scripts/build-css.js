import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Ensure dist directory exists
mkdirSync(join(rootDir, 'dist'), { recursive: true });

// Copy CSS file to dist
const css = readFileSync(join(rootDir, 'src/styles/index.css'), 'utf-8');
writeFileSync(join(rootDir, 'dist/styles.css'), css);

console.log('✓ CSS built successfully');
