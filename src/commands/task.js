import { printTask } from '../format.js';
import { completeTask as kernelCompleteTask, createTask as kernelCreateTask, takeTask as kernelTakeTask } from '../kernel/index.js';
import { evaluatePreflight } from './preflight.js';
import { getCurrentTask, requireCurrentRole } from '../state.js';

export function createTask({ cwd, to, title, description, io }) {
  if (!to) throw new Error('Informe destino: --to <role>');
  if (!title) throw new Error('Informe titulo: --title "..."');

  const task = kernelCreateTask(cwd, { to, title, description: description || '' });
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
  const task = kernelTakeTask(cwd, { role, id });

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
  const result = kernelCompleteTask(cwd, { role, summary });
  io.log(`tarefa concluida: ${result.task.id}`);
  const pending = result.pendingTasks;
  io.log(pending.length ? `tarefas pendentes: ${pending.length}` : 'tarefas pendentes: nenhuma');
}
