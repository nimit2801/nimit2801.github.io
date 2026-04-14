import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const distPath = path.join(repoRoot, 'dist');

await mkdir(distPath, { recursive: true });
await copyFile(path.join(distPath, 'index.html'), path.join(distPath, '404.html'));
console.log('copied dist/index.html to dist/404.html');
