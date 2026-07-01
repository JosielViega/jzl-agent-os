import { registerInstaller } from '../kernel/registries/index.js';
import { filesystemInstaller } from './filesystem.js';

const builtinInstallers = [
  filesystemInstaller
];

export function loadInstallers() {
  for (const installer of builtinInstallers) {
    registerInstaller(installer);
  }
  return builtinInstallers;
}

export { filesystemInstaller };

