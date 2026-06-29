import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const roots = ['bin', 'src', 'scripts', 'test'];
let failed = false;

for (const file of jsFiles(process.cwd(), roots)) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr || result.stdout);
  }
}

if (failed) process.exit(1);
console.log('check: ok');

function* jsFiles(cwd, roots) {
  for (const root of roots) {
    const absolute = path.join(cwd, root);
    yield* walk(absolute);
  }
}

function* walk(dir) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    if (entry.isFile() && entry.name.endsWith('.js')) yield full;
  }
}
