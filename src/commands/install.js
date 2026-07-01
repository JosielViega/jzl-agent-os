import { ensureJzl, jzlPath, readJson, writeJson } from '../fs-store.js';
import { loadInstallers } from '../installers/index.js';
import { resolveInstaller } from '../kernel/registries/index.js';

export function installComponent({ cwd, source, force = false, io }) {
  ensureJzl(cwd);
  if (!source) throw new Error('Informe source: --source <path>');

  loadInstallers();
  const installer = resolveInstaller(source);
  if (!installer) throw new Error(`Nenhum installer suporta a source: ${source}`);

  const metadata = installer.read(source);
  if (metadata.type !== 'plugin') {
    throw new Error(`Tipo de componente nao suportado: ${metadata.type}`);
  }

  const installPath = jzlPath(cwd, 'installed', 'plugins', metadata.name, 'manifest.json');
  const existing = readJson(installPath, null);
  if (existing && !force) {
    throw new Error(`Plugin ja instalado: ${metadata.name}. Use --force para sobrescrever.`);
  }

  const record = {
    ...metadata.manifest,
    name: metadata.name,
    type: metadata.type,
    source: metadata.source,
    installedAt: new Date().toISOString()
  };

  writeJson(installPath, record);
  updateInstalledIndex(cwd, record);

  io.log(`componente instalado: ${record.name}`);
  io.log(`tipo: ${record.type}`);
  io.log(`source: ${record.source}`);
  io.log(`capabilities: ${(record.capabilities || []).join(', ') || 'nenhuma'}`);
  io.log(`providers: ${(record.providers || []).map((provider) => provider.name).join(', ') || 'nenhum'}`);
}

export function listInstalled({ cwd, io }) {
  ensureJzl(cwd);
  const index = readJson(jzlPath(cwd, 'installed', 'installed.json'), { components: [] });
  const components = index.components || [];
  if (!components.length) {
    io.log('installed: vazio');
    return;
  }

  io.log(`installed: ${components.length}`);
  for (const component of components) {
    io.log(`- ${component.name} [${component.type}] ${component.source}`);
  }
}

function updateInstalledIndex(cwd, record) {
  const indexPath = jzlPath(cwd, 'installed', 'installed.json');
  const index = readJson(indexPath, { components: [] });
  const components = (index.components || []).filter((item) => !(item.type === record.type && item.name === record.name));
  components.push({
    name: record.name,
    type: record.type,
    source: record.source,
    installedAt: record.installedAt
  });
  writeJson(indexPath, { components });
}
