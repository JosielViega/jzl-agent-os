const installers = new Map();

export function registerInstaller(installer) {
  if (!installer?.name) throw new Error('Installer name obrigatorio.');
  if (typeof installer.supports !== 'function') throw new Error('Installer supports() obrigatorio.');
  installers.set(installer.name, installer);
  return installer;
}

export function getInstaller(name) {
  return installers.get(name) || null;
}

export function listInstallers() {
  return [...installers.values()];
}

export function resolveInstaller(source) {
  return listInstallers().find((installer) => installer.supports(source)) || null;
}

export function clearInstallers() {
  installers.clear();
}

