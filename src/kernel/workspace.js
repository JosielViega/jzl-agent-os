import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { jzlPath, readJson, writeJsonIfMissing } from '../fs-store.js';

const WORKSPACE_MANIFEST = 'jzl.workspace.json';
const packagePath = fileURLToPath(new URL('../../package.json', import.meta.url));

export function createWorkspaceManifest(cwd, { template = 'game', profile = 'solo' } = {}) {
  const manifest = {
    workspaceId: `workspace-${randomUUID()}`,
    name: path.basename(path.resolve(cwd)),
    kernelVersion: readJson(packagePath, { version: '0.0.0' }).version,
    template,
    profile,
    createdAt: new Date().toISOString(),
    manifestVersion: 1
  };

  writeJsonIfMissing(path.join(cwd, WORKSPACE_MANIFEST), manifest);
  return readWorkspaceManifest(cwd);
}

export function readWorkspaceManifest(cwd) {
  return readJson(path.join(cwd, WORKSPACE_MANIFEST), null);
}

export function findWorkspaceRoot(startDir) {
  let current = path.resolve(startDir);
  while (true) {
    if (readWorkspaceManifest(current)) return current;
    if (readJson(jzlPath(current, 'type.json'), null)) return current;

    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

export function getWorkspaceInfo(cwd) {
  const root = findWorkspaceRoot(cwd) || cwd;
  const manifest = readWorkspaceManifest(root);
  if (manifest) {
    return {
      root,
      source: 'manifest',
      workspaceId: manifest.workspaceId,
      name: manifest.name,
      kernelVersion: manifest.kernelVersion,
      template: manifest.template,
      profile: manifest.profile,
      createdAt: manifest.createdAt,
      manifestVersion: manifest.manifestVersion
    };
  }

  const legacyType = readJson(jzlPath(root, 'type.json'), { type: 'unknown' });
  return {
    root,
    source: 'legacy',
    workspaceId: null,
    name: null,
    kernelVersion: null,
    template: legacyType.type || 'unknown',
    profile: null,
    createdAt: null,
    manifestVersion: null
  };
}

