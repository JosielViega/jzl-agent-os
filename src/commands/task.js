import { appendEvent, appendJournal, agentPath, listInboxAll, listPendingDependencies, readAgentSession, saveAgentSession, saveInboxItem } from '../agents.js';
import { ensureJzl, makeId, nowIso, readJson, writeJson } from '../fs-store.js';
import { printTask } from '../format.js';
import { evaluatePreflight } from './preflight.js';
import { getCurrentTask, requireCurrentRole, saveTask } from '../state.js';

export function createTask({ cwd, to, title, description, io }) {
  ensureJzl(cwd);
  if (!to) throw new Error('Informe destino: --to <role>');
  if (!title) throw new Error('Informe titulo: --title "..."');

  const task = {
    id: makeId('task', title),
    type: 'task',
    from: 'system',
    to,
    title,
    description: description || '',
    status: 'pending',
    createdAt: nowIso(),
    completedAt: null,
    summary: null
  };

  saveTask(cwd, task);
  appendEvent(cwd, 'task.create', { id: task.id, from: task.from, to, title });
  io.log(`tarefa criada: ${task.id}`);
  io.log(`para: ${to}`);
  io.log(`status: ${task.status}`);
}

export function showCurrentTask({ cwd, io }) {
  const role = requireCurrentRole(cwd);
  printTask(io, getCurrentTask(cwd, role));
}

export function takeTask({ cwd, id, io }) {
  if (!id) throw new Error('Informe task: --id <id>');
  const role = requireCurrentRole(cwd);
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
  appendEvent(cwd, 'task.take', { id: task.id, role });

  io.log(`tarefa assumida: ${task.id}`);
  io.log(`titulo: ${task.title}`);
}

export function completeTask({ cwd, summary, io }) {
  if (!summary) throw new Error('Informe resumo: --summary "..."');
  const role = requireCurrentRole(cwd);
  const task = getCurrentTask(cwd, role);
  if (!task) {
    io.log('tarefa atual: nenhuma');
    return;
  }
  io.log('preflight: rode jzl preflight antes de concluir');
  const preflight = evaluatePreflight(cwd);
  if (preflight.status !== 'passed') {
    throw new Error(`Preflight falhou: ${preflight.problems.join('; ')}`);
  }
  const blockers = listPendingDependencies(cwd, role, task.id);
  if (blockers.length) {
    throw new Error(`Tarefa bloqueada por dependencias pendentes: ${blockers.map((item) => item.id).join(', ')}`);
  }

  task.status = 'completed';
  task.summary = summary;
  task.completedAt = nowIso();
  writeJson(agentPath(cwd, role, 'inbox', `${task.id}.json`), task);
  appendJournal(cwd, role, `Tarefa concluida: ${task.title}\nResumo: ${summary}`);
  appendEvent(cwd, 'task.complete', { id: task.id, role, summary });

  const session = readAgentSession(cwd, role);
  if (session.currentTaskId === task.id) delete session.currentTaskId;
  session.updatedAt = nowIso();
  saveAgentSession(cwd, role, session);

  io.log(`tarefa concluida: ${task.id}`);
  const pending = listInboxAll(cwd, role).filter((item) => item.type === 'task' && item.status === 'pending');
  io.log(pending.length ? `tarefas pendentes: ${pending.length}` : 'tarefas pendentes: nenhuma');
}
