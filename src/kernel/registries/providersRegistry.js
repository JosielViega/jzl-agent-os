const providers = new Map();
const providersByCapability = new Map();

export function registerProvider(provider) {
  if (!provider?.name) throw new Error('Provider name obrigatorio.');
  if (!provider.plugin) throw new Error('Provider plugin obrigatorio.');
  const normalized = {
    ...provider,
    capabilities: provider.capabilities || [],
    services: provider.services || {}
  };
  providers.set(normalized.name, normalized);
  for (const capability of normalized.capabilities) {
    if (!providersByCapability.has(capability)) providersByCapability.set(capability, []);
    const capabilityProviders = providersByCapability.get(capability);
    if (!capabilityProviders.some((item) => item.name === normalized.name)) {
      capabilityProviders.push(normalized);
    }
  }
  return normalized;
}

export function getProvider(name) {
  return providers.get(name) || null;
}

export function listProviders() {
  return [...providers.values()];
}

export function resolveProviderByCapability(capabilityName) {
  const capabilityProviders = providersByCapability.get(capabilityName) || [];
  return capabilityProviders[0] || null;
}

export function clearProviders() {
  providers.clear();
  providersByCapability.clear();
}

