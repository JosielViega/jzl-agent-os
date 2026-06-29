import { formatList, printTask } from '../format.js';
import { listInbox, listOutbox, listPendingDependencies, readJournalSummary } from '../agents.js';
import { getCurrentTask, getOpenDependencies, getRole, loadSession, saveSession } from '../state.js';

export function boot({ cwd, role: roleName, io }) {
  if (!roleName) throw new Error('Informe a role: jzl boot --role <role>');

  const session = loadSession(cwd);
  session.currentRole = roleName;
  session.updatedAt = new Date().toISOString();
  saveSession(cwd, session);

  const role = getRole(cwd, roleName);
  const task = getCurrentTask(cwd, roleName);
  const inbox = listInbox(cwd, roleName).filter((item) => item.type !== 'task' || item.status === 'pending');
  const unreadMessages = inbox.filter((item) => item.type !== 'task' && item.status === 'unread');
  const readMessages = inbox.filter((item) => item.type !== 'task' && item.status === 'read');
  const outbox = listOutbox(cwd, roleName);
  const dependencies = getOpenDependencies(cwd, roleName);
  const taskDependencies = task ? listPendingDependencies(cwd, roleName, task.id) : [];
  const journal = readJournalSummary(cwd, roleName, 3);

  io.log('JZL BOOT');
  io.log(`role: ${roleName}`);
  io.log('modo: agente operacional');
  io.log('');
  io.log('Contrato:');
  io.log(extractContract(role));
  io.log('');
  io.log('Permissoes:');
  printBullets(io, role.permissions);
  io.log('');
  io.log('Proibido:');
  printBullets(io, role.prohibitions);
  io.log('');
  io.log('Tarefa atual:');
  printTask(io, task);
  io.log('');
  io.log('Inbox:');
  printTasks(io, inbox);
  io.log('');
  io.log('Mensagens unread:');
  printTasks(io, unreadMessages);
  io.log('');
  io.log('Mensagens read pendentes:');
  printTasks(io, readMessages);
  io.log('');
  io.log('Outbox pendente:');
  printTasks(io, outbox);
  io.log('');
  io.log('Journal:');
  io.log(journal);
  io.log('');
  io.log('Dependencias abertas:');
  printDependencies(io, dependencies);
  io.log('');
  io.log('Dependencias da tarefa atual:');
  printDependencies(io, taskDependencies);
  io.log('');
  io.log('Comandos durante o trabalho:');
  io.log('- rode jzl task current');
  io.log('- rode jzl inbox');
  io.log('- para assumir uma tarefa pending, rode jzl task take --id <id>');
  io.log('- se encontrar assunto fora da funcao, rode jzl dependency create --to <sector> --reason "..."');
  io.log('- ao terminar, rode jzl handoff create --to revisor --summary "..."');
  io.log('- ao concluir a tarefa atual, rode jzl task complete --summary "..."');
}

function extractContract(role) {
  if (!role.contractText) return role.contract;
  const match = role.contractText.match(/## Contrato\s+([\s\S]*?)(\n## |\s*$)/);
  return match ? match[1].trim() : role.contract;
}

function printBullets(io, items) {
  if (!items || !items.length) {
    io.log('- nenhuma');
    return;
  }

  for (const item of items) io.log(`- ${item}`);
}

function printTasks(io, tasks) {
  if (!tasks.length) {
    io.log('- vazia');
    return;
  }

  for (const task of tasks) {
    io.log(`- ${task.id}: ${label(task)} [${task.status}]`);
  }
}

function label(item) {
  if (item.type === 'task') return item.title || item.description || item.id;
  return item.summary || item.reason || item.title || item.id;
}

function printDependencies(io, dependencies) {
  if (!dependencies.length) {
    io.log('- nenhuma');
    return;
  }

  for (const dependency of dependencies) {
    io.log(`- ${dependency.id}: ${dependency.to} (${dependency.reason})`);
  }
  io.log(`ids: ${formatList(dependencies.map((item) => item.id))}`);
}
