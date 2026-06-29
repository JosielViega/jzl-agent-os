import { listInbox, listOutbox, listPendingDependencies } from '../agents.js';
import { getCurrentTask, loadSession } from '../state.js';

export function nextStep({ cwd, io }) {
  const session = loadSession(cwd);
  const role = session.currentRole;
  if (!role) {
    return printDecision(io, {
      action: 'iniciar contexto do agente',
      reason: 'nenhuma sessao ativa',
      command: 'jzl boot --role <role>'
    });
  }

  const inbox = listInbox(cwd, role);
  const unread = inbox.find((item) => item.status === 'unread');
  if (unread) {
    return printDecision(io, {
      action: 'ler primeira mensagem unread',
      reason: 'ha mensagem recebida ainda nao lida',
      command: `jzl inbox read --id ${unread.id}`
    });
  }

  const task = getCurrentTask(cwd, role);
  const taskDependencies = task ? listPendingDependencies(cwd, role, task.id) : [];
  if (task && taskDependencies.length) {
    return printDecision(io, {
      action: 'aguardar/resolver dependencia antes de concluir',
      reason: `task atual bloqueada por dependency pending ${taskDependencies[0].id}`,
      command: `jzl dependency list`
    });
  }

  const pendingTask = inbox.find((item) => item.type === 'task' && item.status === 'pending');
  if (!task && pendingTask) {
    return printDecision(io, {
      action: 'assumir primeira task pending',
      reason: 'ha task pendente e nenhuma task atual',
      command: `jzl task take --id ${pendingTask.id}`
    });
  }

  if (task) {
    return printDecision(io, {
      action: 'trabalhar na tarefa atual',
      reason: 'task atual sem dependency pending',
      command: 'ao terminar: jzl send --to revisor --summary "..." ou jzl task complete --summary "..."'
    });
  }

  const outbox = listOutbox(cwd, role);
  if (!inbox.length && !outbox.length) {
    return printDecision(io, {
      action: 'aguardar nova tarefa ou pedir task ao diretor',
      reason: 'inbox vazia, outbox vazia e nenhuma task atual',
      command: 'jzl send --to diretor --summary "Solicito nova tarefa."'
    });
  }

  return printDecision(io, {
    action: 'acompanhar mensagens pendentes',
    reason: 'ha itens pendentes no estado do agente',
    command: 'jzl inbox'
  });
}

function printDecision(io, decision) {
  io.log('next-step:');
  io.log(decision.action);
  io.log('');
  io.log('reason:');
  io.log(decision.reason);
  io.log('');
  io.log('command:');
  io.log(decision.command || 'nenhum');
}
