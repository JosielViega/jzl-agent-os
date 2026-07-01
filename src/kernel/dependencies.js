import { agentExists, listDependencies, saveInboxItem } from '../agents.js';
import { jzlPath, makeId, nowIso, readJsonFirst, runtimeDataPath, runtimeInboxPath, writeJson } from '../fs-store.js';
import { publishEvent } from './events.js';

export function createDependency(cwd, { from, to, task, reason }) {
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

  writeJson(runtimeDataPath(cwd, 'dependencies', `${dependency.id}.json`), dependency);
  if (agentExists(cwd, to)) {
    saveInboxItem(cwd, to, {
      ...dependency,
      status: 'unread',
      relatedDependencyId: dependency.id
    });
  }
  publishEvent(cwd, 'dependency.create', { id: dependency.id, from, to, taskId: task.id, reason });
  return { dependency, delivered: agentExists(cwd, to) };
}

export function resolveDependency(cwd, { role, id, summary }) {
  const file = runtimeDataPath(cwd, 'dependencies', `${id}.json`);
  const legacyFile = jzlPath(cwd, 'dependencies', `${id}.json`);
  const dependency = readJsonFirst([file, legacyFile], null);
  if (!dependency || (dependency.from !== role && dependency.to !== role)) {
    throw new Error('Dependencia nao encontrada para o agente atual.');
  }

  dependency.status = 'resolved';
  dependency.summary = summary;
  dependency.resolvedBy = role;
  dependency.resolvedAt = nowIso();
  writeJson(file, dependency);
  if (agentExists(cwd, dependency.to)) {
    writeJson(runtimeInboxPath(cwd, dependency.to, `${dependency.id}.json`), {
      ...dependency,
      status: 'resolved',
      relatedDependencyId: dependency.id
    });
  }
  let response = null;
  if (agentExists(cwd, dependency.from)) {
    response = {
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
    };
    saveInboxItem(cwd, dependency.from, response);
  }
  publishEvent(cwd, 'dependency.resolve', { id, role, from: dependency.from, to: dependency.to, taskId: dependency.taskId, summary });
  return { dependency, response };
}

export function readDependencies(cwd, role, taskId = null) {
  return listDependencies(cwd, role, taskId);
}
