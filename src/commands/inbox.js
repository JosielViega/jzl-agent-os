import { listInbox, listInboxAll, readInboxItem, saveInboxItem } from '../agents.js';
import { requireCurrentRole } from '../state.js';

export function showInbox({ cwd, all = false, io }) {
  const role = requireCurrentRole(cwd);
  const tasks = all ? listInboxAll(cwd, role) : listInbox(cwd, role);

  if (!tasks.length) {
    io.log('inbox: vazia');
    return;
  }

  io.log(`inbox: ${tasks.length}`);
  for (const task of tasks) {
    io.log(`- ${task.id}: ${label(task)} [${task.type || 'message'}:${task.status}]`);
  }
}

export function readInboxMessage({ cwd, id, io }) {
  if (!id) throw new Error('Informe mensagem: --id <id>');
  const role = requireCurrentRole(cwd);
  const message = readInboxItem(cwd, role, id);
  if (!message) throw new Error('Mensagem nao encontrada na inbox do agente atual.');

  if (message.status === 'unread') {
    message.status = 'read';
    message.readAt = new Date().toISOString();
    saveInboxItem(cwd, role, message);
  }

  io.log(`id: ${message.id}`);
  io.log(`type: ${message.type || 'message'}`);
  io.log(`from: ${message.from || 'system'}`);
  io.log(`to: ${message.to || role}`);
  io.log(`status: ${message.status}`);
  io.log(`title: ${message.title || 'sem titulo'}`);
  io.log(`summary: ${message.summary || message.reason || message.description || 'sem resumo'}`);
  if (message.relatedTaskId || message.taskId) io.log(`relatedTaskId: ${message.relatedTaskId || message.taskId}`);
  if (message.relatedDependencyId || message.dependencyId) io.log(`relatedDependencyId: ${message.relatedDependencyId || message.dependencyId}`);
}

export function archiveInboxMessage({ cwd, id, io }) {
  if (!id) throw new Error('Informe mensagem: --id <id>');
  const role = requireCurrentRole(cwd);
  const message = readInboxItem(cwd, role, id);
  if (!message) throw new Error('Mensagem nao encontrada na inbox do agente atual.');

  message.status = 'archived';
  message.archivedAt = new Date().toISOString();
  saveInboxItem(cwd, role, message);
  io.log(`mensagem arquivada: ${id}`);
}

function label(item) {
  if (item.type === 'task') return item.title || item.description || item.id;
  return item.summary || item.reason || item.title || item.id;
}
