import { agentExists, agentPath, appendEvent, listDependencies, saveInboxItem } from '../agents.js';
import { jzlPath, makeId, nowIso, readJson, writeJson } from '../fs-store.js';
import { getCurrentTask, requireCurrentRole } from '../state.js';

export function createDependency({ cwd, to, reason, io }) {
  if (!to) throw new Error('Informe setor: --to <sector>');
  if (!reason) throw new Error('Informe motivo: --reason "..."');
  const from = requireCurrentRole(cwd);
  const task = getCurrentTask(cwd, from);
  if (!task) throw new Error('Nenhuma tarefa atual. Rode: jzl task take --id <id>');

  const dependency = {
    id: makeId('dep', to),
    type: 'dependency',
    from,
    to,
    taskId: task.id,
    relatedTaskId: task.id,
    title: `Dependencia: ${to}`,
    reason,
    status: 'pending',
    createdAt: nowIso(),
    resolvedAt: null,
    summary: null
  };

  writeJson(jzlPath(cwd, 'dependencies', `${dependency.id}.json`), dependency);
  if (agentExists(cwd, to)) {
    saveInboxItem(cwd, to, {
      ...dependency,
      status: 'unread',
      relatedDependencyId: dependency.id
    });
  }
  appendEvent(cwd, 'dependency.create', { id: dependency.id, from, to, taskId: task.id, reason });
  io.log(`dependencia criada: ${dependency.id}`);
  io.log(agentExists(cwd, to) ? `entregue para: ${to}` : `setor: ${to}`);
  io.log(`task: ${task.id}`);
}

export function listDependencyItems({ cwd, io }) {
  const role = requireCurrentRole(cwd);
  const dependencies = listDependencies(cwd, role);
  if (!dependencies.length) {
    io.log('dependencies: vazia');
    return;
  }

  io.log(`dependencies: ${dependencies.length}`);
  for (const dependency of dependencies) {
    io.log(`- ${dependency.id}: ${dependency.to} [${dependency.status}] task=${dependency.taskId || 'nenhuma'} ${dependency.reason}`);
  }
}

export function resolveDependency({ cwd, id, summary, io }) {
  if (!id) throw new Error('Informe dependencia: --id <id>');
  if (!summary) throw new Error('Informe resumo: --summary "..."');
  const role = requireCurrentRole(cwd);
  const file = jzlPath(cwd, 'dependencies', `${id}.json`);
  const dependency = readJson(file, null);
  if (!dependency || (dependency.from !== role && dependency.to !== role)) {
    throw new Error('Dependencia nao encontrada para o agente atual.');
  }

  dependency.status = 'resolved';
  dependency.summary = summary;
  dependency.resolvedBy = role;
  dependency.resolvedAt = nowIso();
  writeJson(file, dependency);
  if (agentExists(cwd, dependency.to)) {
    writeJson(agentPath(cwd, dependency.to, 'inbox', `${dependency.id}.json`), {
      ...dependency,
      status: 'resolved',
      relatedDependencyId: dependency.id
    });
  }
  if (agentExists(cwd, dependency.from)) {
    saveInboxItem(cwd, dependency.from, {
      id: makeId('dependency-response', id),
      type: 'dependency-response',
      from: role,
      to: dependency.from,
      title: `Resposta dependencia ${id}`,
      summary,
      relatedDependencyId: id,
      relatedTaskId: dependency.taskId,
      status: 'unread',
      createdAt: nowIso()
    });
  }
  appendEvent(cwd, 'dependency.resolve', { id, role, from: dependency.from, to: dependency.to, taskId: dependency.taskId, summary });

  io.log(`dependencia resolvida: ${id}`);
}
