import { mkdir, readFile, rm, writeFile, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const out = resolve(root, 'www');

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const html = await readFile(resolve(root, 'index-v2.html'), 'utf8');
await writeFile(resolve(out, 'index.html'), html, 'utf8');

for (const file of ['styles-v2.css', 'crisp.css', 'ideas-v2.js', 'logic-v2.js']) {
  await copyFile(resolve(root, file), resolve(out, file));
}

console.log('Prepared offline SwipeStart web bundle in www/');
