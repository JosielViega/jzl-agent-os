import { readJson } from '../fs-store.js';
import { jzlPath } from '../fs-store.js';
import { loadSession } from '../state.js';

export function getCurrentSession(cwd) {
  return loadSession(cwd);
}

export function getProject(cwd) {
  return readJson(jzlPath(cwd, 'type.json'), { type: 'unknown' });
}

