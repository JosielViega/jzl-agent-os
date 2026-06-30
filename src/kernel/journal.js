import { appendJournal } from '../agents.js';

export function addJournalEntry(cwd, { role, text, taskId = null }) {
  const body = taskId ? `Task: ${taskId}\n${text}` : text;
  appendJournal(cwd, role, body);
  return { role, text: body, taskId };
}

