import { publish, readLog } from './eventBus.js';

export function publishEvent(cwd, type, data = {}) {
  return publish(type, { cwd, ...data });
}

export function readEvents(cwd, limit = 10) {
  return readLog(cwd, limit);
}
