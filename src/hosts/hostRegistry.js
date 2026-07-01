const hosts = new Map();

export function registerHost(host) {
  if (!host?.manifest?.name) {
    throw new Error('Host invalido: manifest.name obrigatorio.');
  }
  hosts.set(host.manifest.name, host);
  return host;
}

export function getHost(name) {
  return hosts.get(name) || null;
}

export function listHosts() {
  return [...hosts.values()];
}

export function clearHosts() {
  hosts.clear();
}
