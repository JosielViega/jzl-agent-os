import { registerCapability } from './capabilitiesRegistry.js';
import { registerProvider } from './providersRegistry.js';

const plugins = new Map();

export function registerPlugin(plugin) {
  if (!plugin?.manifest?.name) {
    throw new Error('Plugin invalido: manifest.name obrigatorio.');
  }
  plugins.set(plugin.manifest.name, plugin);
  for (const provider of plugin.providers || []) {
    registerProvider(provider);
  }
  for (const capability of plugin.manifest.capabilities || []) {
    registerCapability(capability, {
      name: plugin.manifest.name,
      plugin
    });
  }
  return plugin;
}

export function getPlugin(name) {
  return plugins.get(name) || null;
}

export function listPlugins() {
  return [...plugins.values()];
}

export function clearPlugins() {
  plugins.clear();
}
