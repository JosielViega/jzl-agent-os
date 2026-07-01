import cliHost from './cli/index.js';
import { getHost, listHosts, registerHost } from './hostRegistry.js';
import { registerHost as registerKernelHost } from '../kernel/registries/index.js';

const builtinHosts = [
  cliHost
];

export function loadHosts() {
  for (const host of builtinHosts) {
    registerHost(host);
    registerKernelHost(host);
  }
  return listHosts();
}

export { getHost, listHosts };
