import manifest from './manifest.json' with { type: 'json' };

const plugin = {
  manifest
};

plugin.providers = (manifest.providers || []).map((provider) => ({
  ...provider,
  plugin,
  services: {}
}));

export default plugin;
