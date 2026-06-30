import { listInboxAll, listPendingDependencies, readAgentSession, saveAgentSession, saveInboxItem } from '../agents.js';
import { agentPath, appendJournal } from '../agents.js';
import { ensureJzl, makeId, nowIso, readJson, writeJson } from '../fs-store.js';
import { getCurrentTask, saveTask } from '../state.js';
import { publishEvent } from './events.js';

export function createTask(cwd, { to, title, description = '', from = 'system' }) {
  ensureJzl(cwd);
  const task = {
    id: makeId('task', title),
    type: 'task',
    from,
    to,
    title,
    description,
    status: 'pending',
    createdAt: nowIso(),
    completedAt: null,
    summary: null
  };

  saveTask(cwd, task);
  publishEvent(cwd, 'task.create', { id: task.id, from: task.from, to, title });
  return task;
}

export function takeTask(cwd, { role, id }) {
  const task = readJson(agentPath(cwd, role, 'inbox', `${id}.json`), null);
  if (!task || task.type !== 'task') {
    throw new Error('Task nao encontrada na inbox do agente atual.');
  }
  if (task.status === 'completed') {
    throw new Error('Task ja concluida.');
  }

  const session = readAgentSession(cwd, role);
  if (session.currentTaskId && session.currentTaskId !== id) {
    throw new Error(`Ja existe tarefa atual: ${session.currentTaskId}`);
  }

  task.status = 'current';
  task.takenAt = nowIso();
  saveInboxItem(cwd, role, task);
  session.currentTaskId = task.id;
  session.updatedAt = nowIso();
  saveAgentSession(cwd, role, session);
  publishEvent(cwd, 'task.take', { id: task.id, role });
  return task;
}

export function completeTask(cwd, { role, summary }) {
  const task = getCurrentTask(cwd, role);
  if (!task) return { task: null, pendingTasks: [] };

  const blockers = listPendingDependencies(cwd, role, task.id);
  if (blockers.length) {
    throw new Error(`Tarefa bloqueada por dependencias pendentes: ${blockers.map((item) => item.id).join(', ')}`);
  }

  task.status = 'completed';
  task.summary = summary;
  task.completedAt = nowIso();
  writeJson(agentPath(cwd, role, 'inbox', `${task.id}.json`), task);
  appendJournal(cwd, role, `Tarefa concluida: ${task.title}\nResumo: ${summary}`);
  publishEvent(cwd, 'task.complete', { id: task.id, role, summary });

  const session = readAgentSession(cwd, role);
  if (session.currentTaskId === task.id) delete session.currentTaskId;
  session.updatedAt = nowIso();
  saveAgentSession(cwd, role, session);

  const pendingTasks = listInboxAll(cwd, role).filter((item) => item.type === 'task' && item.status === 'pending');
  return { task, pendingTasks };
}

