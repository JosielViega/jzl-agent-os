import { createDependency as kernelCreateDependency, readDependencies, resolveDependency as kernelResolveDependency } from '../kernel/index.js';
import { getCurrentTask, requireCurrentRole } from '../state.js';

export function createDependency({ cwd, to, reason, io }) {
  if (!to) throw new Error('Informe setor: --to <sector>');
  if (!reason) throw new Error('Informe motivo: --reason "..."');
  const from = requireCurrentRole(cwd);
  const task = getCurrentTask(cwd, from);
  if (!task) throw new Error('Nenhuma tarefa atual. Rode: jzl task take --id <id>');

  const { dependency, delivered } = kernelCreateDependency(cwd, { from, to, task, reason });
  io.log(`dependencia criada: ${dependency.id}`);
  io.log(delivered ? `entregue para: ${to}` : `setor: ${to}`);
  io.log(`task: ${task.id}`);
}

export function listDependencyItems({ cwd, io }) {
  const role = requireCurrentRole(cwd);
  const dependencies = readDependencies(cwd, role);
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
  kernelResolveDependency(cwd, { role, id, summary });

  io.log(`dependencia resolvida: ${id}`);
}
