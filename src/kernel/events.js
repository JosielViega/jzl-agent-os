import { appendEvent, readEvents as readAgentEvents } from '../agents.js';

export function publishEvent(cwd, type, data = {}) {
  appendEvent(cwd, type, data);
}

export function readEvents(cwd, limit = 10) {
  return readAgentEvents(cwd, limit);
}

