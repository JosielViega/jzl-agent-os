import { readEvents } from '../kernel/index.js';

export function showHistory({ cwd, io }) {
  const events = readEvents(cwd, 10);
  if (!events.length) {
    io.log('history: vazio');
    return;
  }

  io.log(`history: ${events.length}`);
  for (const event of events) {
    const target = event.to ? ` -> ${event.to}` : '';
    const actor = event.from || event.role || 'system';
    io.log(`- ${event.at}: ${event.type} ${actor}${target}`);
  }
}
