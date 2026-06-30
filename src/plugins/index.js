import gitPlugin from './git/index.js';
import { getPlugin, listPlugins, registerPlugin } from './registry.js';

const builtinPlugins = [
  gitPlugin
];

export function loadPlugins() {
  for (const plugin of builtinPlugins) {
    registerPlugin(plugin);
  }
  return listPlugins();
}

export { getPlugin, listPlugins };

