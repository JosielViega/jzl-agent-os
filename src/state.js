import fs from 'node:fs';
import { ensureJzl, jzlPath, listJson, readJson, writeJson } from './fs-store.js';
import { agentPath, listInbox, listPendingDependencies, readAgentContract, readAgentSession, saveInboxItem } from './agents.js';

export function loadSession(cwd) {
  ensureJzl(cwd);
  return readJson(jzlPath(cwd, 'session.json'), { currentRole: null });
}

export function saveSession(cwd, session) {
  writeJson(jzlPath(cwd, 'session.json'), session);
}

export function requireCurrentRole(cwd) {
  const session = loadSession(cwd);
  if (!session.currentRole) {
    throw new Error('Nenhuma role ativa. Rode: jzl session start <role>');
  }
  return session.currentRole;
}

export function getRole(cwd, roleName) {
  const role = readAgentSession(cwd, roleName);
  role.contractText = readAgentContract(cwd, roleName);
  if (role.contractText || role.contract !== 'Contrato nao definido.') return role;

  const legacyRole = readJson(jzlPath(cwd, 'roles', `${roleName}.json`), {
    name: roleName,
    contract: 'Contrato nao definido.',
    permissions: [],
    prohibitions: []
  });
  const contractPath = jzlPath(cwd, 'contracts', `${roleName}.md`);
  legacyRole.contractText = fs.existsSync(contractPath) ? fs.readFileSync(contractPath, 'utf8') : '';
  return legacyRole;
}

export function getOpenTasksForRole(cwd, roleName) {
  const agentTasks = listInbox(cwd, roleName)
    .filter((task) => task.type === 'task')
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  if (agentTasks.length) return agentTasks;

  return listJson(jzlPath(cwd, 'tasks'))
    .filter((task) => task.to === roleName && task.status !== 'completed')
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

export function getCurrentTask(cwd, roleName) {
  const agentSession = readAgentSession(cwd, roleName);
  if (agentSession.currentTaskId) {
    const task = readJson(agentPath(cwd, roleName, 'inbox', `${agentSession.currentTaskId}.json`), null);
    if (task && task.status === 'current') return task;
  }
  const tasks = getOpenTasksForRole(cwd, roleName);
  return tasks.find((task) => task.status === 'current') || null;
}

export function saveTask(cwd, task) {
  saveInboxItem(cwd, task.to, task);
}

export function removeInboxCopy(cwd, task) {
  const fsPath = agentPath(cwd, task.to, 'inbox', `${task.id}.json`);
  if (fs.existsSync(fsPath)) fs.unlinkSync(fsPath);
}

export function getOpenDependencies(cwd, roleName) {
  const inboxDependencies = listInbox(cwd, roleName)
    .filter((item) => item.type === 'dependency')
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const pendingDependencies = listPendingDependencies(cwd, roleName);
  return [...inboxDependencies, ...pendingDependencies];
}
