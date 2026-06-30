const services = new Map();

export function registerService(name, service) {
  if (!name) throw new Error('Service name obrigatorio.');
  services.set(name, service);
  return service;
}

export function getService(name) {
  return services.get(name) || null;
}

export function listServices() {
  return [...services.entries()].map(([name, service]) => ({ name, service }));
}

export function clearServices() {
  services.clear();
}

