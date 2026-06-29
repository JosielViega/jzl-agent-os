import { appendJournal, readJournalEntries, readJournalSummary } from '../agents.js';
import { getCurrentTask, requireCurrentRole } from '../state.js';

export function addJournalEntry({ cwd, text, io }) {
  if (!text) throw new Error('Informe texto: --text "..."');
  const role = requireCurrentRole(cwd);
  const task = getCurrentTask(cwd, role);
  appendJournal(cwd, role, task ? `Task: ${task.id}\n${text}` : text);
  io.log(`journal atualizado: ${role}`);
}

export function showJournal({ cwd, role: requestedRole, task, io }) {
  const role = requestedRole || requireCurrentRole(cwd);
  const currentTask = task === 'current' ? getCurrentTask(cwd, role) : null;
  const entries = readJournalEntries(cwd, role)
    .filter((entry) => !currentTask || entry.taskId === currentTask.id);

  if (task === 'current' && !currentTask) {
    io.log('journal: nenhuma task atual');
    return;
  }

  if (!entries.length) {
    io.log('journal: vazio');
    return;
  }

  io.log(`journal: ${role}`);
  for (const entry of entries) {
    io.log(`- ${entry.at}${entry.taskId ? ` task=${entry.taskId}` : ''}: ${entry.body.replace(/\r?\n/g, ' | ')}`);
  }
}

export function showJournalSummary({ cwd, io }) {
  const role = requireCurrentRole(cwd);
  io.log(`journal: ${readJournalSummary(cwd, role, 3)}`);
}
