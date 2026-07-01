import fs from 'node:fs';
import path from 'node:path';

const MANIFEST_NAMES = ['manifest.json', 'jzl.plugin.json'];

export const filesystemInstaller = {
  name: 'filesystem',
  supports(source) {
    if (!source || typeof source !== 'string') return false;
    return fs.existsSync(path.resolve(source));
  },
  read(source) {
    const root = path.resolve(source);
    const manifestPath = findManifest(root);
    if (!manifestPath) {
      throw new Error('Manifesto de componente nao encontrado: manifest.json ou jzl.plugin.json');
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return {
      source: root,
      manifestPath,
      manifest,
      name: manifest.name || path.basename(root),
      type: manifest.type || inferType(manifestPath, manifest)
    };
  }
};

function findManifest(root) {
  if (fs.existsSync(root) && fs.statSync(root).isFile()) {
    return MANIFEST_NAMES.includes(path.basename(root)) ? root : null;
  }
  for (const name of MANIFEST_NAMES) {
    const candidate = path.join(root, name);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function inferType(manifestPath, manifest) {
  if (path.basename(manifestPath) === 'jzl.plugin.json') return 'plugin';
  if (manifest.providers || manifest.commands) return 'plugin';
  return 'component';
}

