import { requireCapability } from '../kernel/index.js';
import { loadPlugins } from '../plugins/index.js';
import { getCurrentTask, requireCurrentRole } from '../state.js';

export function showGitStatus({ cwd, io }) {
  const status = versionControlProvider().services.status({ cwd });
  io.log(`branch: ${status.branch}`);
  io.log(`modified: ${status.modified ? 'sim' : 'nao'}`);
  io.log(`working tree: ${status.modified ? 'dirty' : 'clean'}`);
  io.log(`last commit: ${status.lastCommit || 'nenhum'}`);
}

export function linkCurrentTaskToCommit({ cwd, io }) {
  const role = requireCurrentRole(cwd);
  const task = getCurrentTask(cwd, role);
  if (!task) throw new Error('Nenhuma task atual. Rode: jzl task take --id <id>');

  const { commit } = versionControlProvider().services.linkTask({ cwd, role, task });

  io.log(`task: ${task.id}`);
  io.log(`commit: ${commit.hash}`);
}

export function showCurrentGitLink({ cwd, io }) {
  const role = requireCurrentRole(cwd);
  const task = getCurrentTask(cwd, role);
  if (!task) {
    io.log('tarefa atual: nenhuma');
    return;
  }

  io.log(`task: ${task.id}`);
  io.log(`title: ${task.title}`);
  io.log(`commit: ${task.gitCommit || 'nenhum'}`);
  if (task.gitCommitSubject) io.log(`commit subject: ${task.gitCommitSubject}`);
}

export function tryReadGitStatus(cwd) {
  try {
    return versionControlProvider().services.status({ cwd });
  } catch {
    return null;
  }
}

function versionControlProvider() {
  loadPlugins();
  const provider = requireCapability('version-control');
  for (const service of ['status', 'lastCommit', 'currentBranch', 'linkTask']) {
    if (typeof provider.services?.[service] !== 'function') {
      throw new Error(`Provider sem servico obrigatorio: ${service}`);
    }
  }
  return provider;
}
