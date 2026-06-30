import gitPlugin from './git/index.js';
import { getPlugin, listPlugins, registerPlugin } from './registry.js';
import { registerPlugin as registerKernelPlugin } from '../kernel/registries/index.js';

const builtinPlugins = [
  gitPlugin
];

export function loadPlugins() {
  for (const plugin of builtinPlugins) {
    registerPlugin(plugin);
    registerKernelPlugin(plugin);
  }
  return listPlugins();
}

export { getPlugin, listPlugins };
