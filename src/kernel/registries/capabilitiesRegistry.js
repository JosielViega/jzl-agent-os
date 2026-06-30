const capabilities = new Map();

export function registerCapability(name, provider) {
  if (!name) throw new Error('Capability name obrigatorio.');
  if (!capabilities.has(name)) capabilities.set(name, []);
  const providers = capabilities.get(name);
  if (!providers.some((item) => item.name === provider.name)) {
    providers.push(provider);
  }
  return { name, providers };
}

export function resolveCapability(name) {
  const providers = capabilities.get(name) || [];
  return providers[0] || null;
}

export function listCapabilities() {
  return [...capabilities.entries()].map(([name, providers]) => ({ name, providers }));
}

export function clearCapabilities() {
  capabilities.clear();
}

