import { listOutbox } from '../agents.js';
import { requireCurrentRole } from '../state.js';

export function showOutbox({ cwd, io }) {
  const role = requireCurrentRole(cwd);
  const messages = listOutbox(cwd, role);

  if (!messages.length) {
    io.log('outbox: vazia');
    return;
  }

  io.log(`outbox: ${messages.length}`);
  for (const message of messages) {
    io.log(`- ${message.id}: ${label(message)} -> ${message.to} [${message.type}:${message.status}]`);
  }
}

function label(item) {
  if (item.type === 'task') return item.title || item.description || item.id;
  return item.summary || item.reason || item.title || item.id;
}
