import fs from 'node:fs';
import path from 'node:path';

export const JZL_DIR = '.jzl';

export function jzlPath(cwd, ...parts) {
  return path.join(cwd, JZL_DIR, ...parts);
}

export function ensureJzl(cwd) {
  const dir = jzlPath(cwd);
  if (!fs.existsSync(dir)) {
    throw new Error('Projeto JZL nao inicializado. Rode: jzl init --type game');
  }
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function writeJsonIfMissing(file, data) {
  ensureDir(path.dirname(file));
  if (!fs.existsSync(file)) {
    writeJson(file, data);
    return true;
  }
  return false;
}

export function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function writeTextIfMissing(file, content) {
  ensureDir(path.dirname(file));
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content, 'utf8');
    return true;
  }
  return false;
}

export function appendText(file, content) {
  ensureDir(path.dirname(file));
  fs.appendFileSync(file, content, 'utf8');
}

export function readText(file, fallback = '') {
  if (!fs.existsSync(file)) return fallback;
  return fs.readFileSync(file, 'utf8');
}

export function listJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => readJson(path.join(dir, name)));
}

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(input) {
  return String(input || 'item')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48) || 'item';
}

export function makeId(prefix, title = '') {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const tail = Math.random().toString(36).slice(2, 7);
  const slug = slugify(title);
  return `${prefix}-${stamp}-${slug}-${tail}`;
}
