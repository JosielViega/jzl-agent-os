import { listCapabilities, resolveCapability, resolveProviderByCapability } from './registries/index.js';

export function hasCapability(name) {
  return getCapabilityProvider(name) !== null;
}

export function requireCapability(name) {
  const provider = getCapabilityProvider(name);
  if (!provider) {
    throw new Error(`Capability nao disponivel: ${name}`);
  }
  return provider;
}

export function getCapabilityProvider(name) {
  return resolveProviderByCapability(name) || resolveCapability(name);
}

export function listAvailableCapabilities() {
  return listCapabilities();
}
