import { formatList, printChecklist, printContractSummary, printRole, printTask } from '../format.js';
import { listInbox } from '../agents.js';
import { getCurrentTask, getOpenDependencies, getRole, loadSession, requireCurrentRole, saveSession } from '../state.js';

export function startSession({ cwd, role, io }) {
  if (!role) throw new Error('Informe a role: jzl session start <role>');
  const session = loadSession(cwd);
  session.currentRole = role;
  session.updatedAt = new Date().toISOString();
  saveSession(cwd, session);
  io.log(`role ativa: ${role}`);
}

export function resumeSession({ cwd, io }) {
  const roleName = requireCurrentRole(cwd);
  const role = getRole(cwd, roleName);
  const task = getCurrentTask(cwd, roleName);
  const inbox = listInbox(cwd, roleName);

  io.log(`role: ${roleName}`);
  io.log(`contrato: ${role.contract}`);
  printChecklist(io, role);
  printTask(io, task);
  io.log(`inbox: ${inbox.length}`);
}

export function whoami({ cwd, io }) {
  const roleName = requireCurrentRole(cwd);
  const role = getRole(cwd, roleName);
  const task = getCurrentTask(cwd, roleName);
  const dependencies = getOpenDependencies(cwd, roleName);

  printRole(io, role);
  printContractSummary(io, role);
  printTask(io, task);
  io.log(`dependencias abertas: ${dependencies.length ? dependencies.map((item) => item.to).join(', ') : 'nenhuma'}`);
  io.log(`dependencias ids: ${formatList(dependencies.map((item) => item.id))}`);
}
