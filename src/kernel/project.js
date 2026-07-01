import { readJson } from '../fs-store.js';
import { jzlPath, workspaceDefinitionPath } from '../fs-store.js';
import { loadSession } from '../state.js';

export function getCurrentSession(cwd) {
  return loadSession(cwd);
}

export function getProject(cwd) {
  return readJson(workspaceDefinitionPath(cwd, 'domains', 'game.json'), readJson(jzlPath(cwd, 'type.json'), { type: 'unknown' }));
}
