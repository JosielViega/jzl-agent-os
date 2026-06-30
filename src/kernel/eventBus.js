import { appendText, jzlPath, nowIso, readText } from '../fs-store.js';

const subscribers = new Map();

export function publish(type, payload = {}) {
  const { cwd, ...data } = payload;
  if (!cwd) throw new Error('Event Bus requer cwd para gravar events.log.');

  const event = {
    at: nowIso(),
    type,
    ...data
  };
  appendText(jzlPath(cwd, 'events.log'), `${JSON.stringify(event)}\n`);
  emit(type, event);
  return event;
}

export function subscribe(type, handler) {
  if (!subscribers.has(type)) subscribers.set(type, new Set());
  subscribers.get(type).add(handler);
  return () => subscribers.get(type)?.delete(handler);
}

export function emit(type, payload = {}) {
  const handlers = subscribers.get(type) || new Set();
  for (const handler of handlers) {
    handler(payload);
  }
  return payload;
}

export function readLog(cwd, limit = 10) {
  const lines = readText(jzlPath(cwd, 'events.log'), '')
    .split(/\r?\n/)
    .filter(Boolean);
  return lines
    .slice(-limit)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { at: '', type: 'invalid', raw: line };
      }
    });
}

