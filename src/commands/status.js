import { listInbox, listPendingDependencies, readEvents } from '../agents.js';
import { getWorkspaceInfo } from '../kernel/index.js';
import { getCurrentTask, loadSession } from '../state.js';
import { tryReadGitStatus } from './git.js';

export function showStatus({ cwd, io }) {
  const workspace = getWorkspaceInfo(cwd);
  const session = loadSession(cwd);
  const role = session.currentRole || null;
  const task = role ? getCurrentTask(cwd, role) : null;
  const unread = role ? listInbox(cwd, role).filter((item) => item.status === 'unread') : [];
  const dependencies = role && task ? listPendingDependencies(cwd, role, task.id) : [];
  const [lastEvent] = readEvents(cwd, 1).slice(-1);
  const git = tryReadGitStatus(cwd);

  if (workspace.source === 'manifest') io.log(`workspace: ${workspace.name}`);
  io.log(`tipo: ${workspace.template || 'unknown'}`);
  io.log(`sessao: ${role || 'nenhuma'}`);
  io.log(`task atual: ${task ? `${task.id} - ${task.title}` : 'nenhuma'}`);
  io.log(`mensagens unread: ${unread.length}`);
  io.log(`dependencies pending da task: ${dependencies.length}`);
  io.log(`ultimo evento: ${lastEvent ? `${lastEvent.type} ${lastEvent.at}` : 'nenhum'}`);
  if (git) {
    io.log(`git: ${git.branch} ${git.modified ? 'dirty' : 'clean'} ${git.lastCommit || 'sem commit'}`);
  } else {
    io.log('git: nao inicializado');
  }
}
