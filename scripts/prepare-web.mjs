import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const out = resolve(process.cwd(), 'www');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await writeFile(resolve(out, 'index.html'), await readFile(resolve(process.cwd(), 'index-v2.html'), 'utf8'));
console.log('Prepared offline Aether Particle Lab bundle');
