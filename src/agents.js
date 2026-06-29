import fs from 'node:fs';
import { appendText, ensureDir, jzlPath, listJson, makeId, nowIso, readJson, readText, writeJson } from './fs-store.js';

export const ROLE_AGENTS = ['diretor', 'arquiteto', 'programador', 'revisor', 'testador', 'documentador'];
export const GAME_SECTORS = ['gameplay', 'performance', 'ui-game', 'audio', 'save-system', 'level-design'];
export const GAME_AGENTS = [...ROLE_AGENTS, ...GAME_SECTORS];

export function agentPath(cwd, role, ...parts) {
  return jzlPath(cwd, 'agents', role, ...parts);
}

export function agentExists(cwd, role) {
  return fs.existsSync(agentPath(cwd, role));
}

export function ensureAgentDirs(cwd, role) {
  ensureDir(agentPath(cwd, role, 'inbox'));
  ensureDir(agentPath(cwd, role, 'outbox'));
}

export function listInbox(cwd, role) {
  return listJson(agentPath(cwd, role, 'inbox'))
    .filter((item) => !['archived', 'resolved', 'completed'].includes(item.status))
    .filter((item) => item.type !== 'task' || item.status === 'pending')
    .sort(byCreatedAt);
}

export function listInboxAll(cwd, role) {
  return listJson(agentPath(cwd, role, 'inbox')).sort(byCreatedAt);
}

export function listOutbox(cwd, role) {
  return listJson(agentPath(cwd, role, 'outbox'))
    .filter((item) => !['archived', 'resolved', 'completed'].includes(item.status))
    .sort(byCreatedAt);
}

export function listDependencies(cwd, role, taskId = null) {
  return listJson(jzlPath(cwd, 'dependencies'))
    .filter((item) => item.from === role || item.to === role)
    .filter((item) => !taskId || item.taskId === taskId)
    .sort(byCreatedAt);
}

export function listPendingDependencies(cwd, role, taskId = null) {
  return listDependencies(cwd, role, taskId)
    .filter((item) => item.from === role)
    .filter((item) => item.status === 'pending');
}

export function saveInboxItem(cwd, role, item) {
  writeJson(agentPath(cwd, role, 'inbox', `${item.id}.json`), item);
}

export function readInboxItem(cwd, role, id) {
  return readJson(agentPath(cwd, role, 'inbox', `${id}.json`), null);
}

export function saveOutboxItem(cwd, role, item) {
  writeJson(agentPath(cwd, role, 'outbox', `${item.id}.json`), item);
}

export function createAgentMessage(cwd, { from, to, type = 'message', title = '', summary = '', description = '', reason = '' }) {
  const id = makeId(type, title || summary || reason || to);
  const message = {
    id,
    type,
    from,
    to,
    title,
    summary,
    description,
    reason,
    status: type === 'task' ? 'pending' : 'unread',
    createdAt: nowIso(),
    completedAt: null
  };

  saveOutboxItem(cwd, from, message);
  saveInboxItem(cwd, to, message);
  appendEvent(cwd, type, { id, from, to, title, summary, reason });
  return message;
}

export function appendEvent(cwd, type, data) {
  const event = {
    at: nowIso(),
    type,
    ...data
  };
  appendText(jzlPath(cwd, 'events.log'), `${JSON.stringify(event)}\n`);
}

export function readEvents(cwd, limit = 10) {
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

export function appendJournal(cwd, role, text) {
  const entry = `\n## ${nowIso()}\n${text}\n`;
  appendText(agentPath(cwd, role, 'journal.md'), entry);
  appendEvent(cwd, 'journal.add', { role, text });
}

export function readJournal(cwd, role) {
  return readText(agentPath(cwd, role, 'journal.md'), '');
}

export function readJournalEntries(cwd, role) {
  const text = readJournal(cwd, role);
  const chunks = text.split(/\r?\n(?=## )/).filter((chunk) => chunk.startsWith('## '));
  return chunks.map((chunk) => {
    const [heading, ...bodyLines] = chunk.split(/\r?\n/);
    const body = bodyLines.join('\n').trim();
    const taskMatch = body.match(/^Task:\s*(.+)$/m);
    return {
      at: heading.replace(/^##\s*/, '').trim(),
      taskId: taskMatch ? taskMatch[1].trim() : null,
      body
    };
  });
}

export function readJournalSummary(cwd, role, maxLines = 5) {
  const entries = readJournalEntries(cwd, role).slice(-maxLines);
  if (!entries.length) return 'vazio';
  return entries.map((entry) => `${entry.at}: ${entry.body.replace(/\r?\n/g, ' | ')}`).join('\n');
}

export function readAgentSession(cwd, role) {
  return readJson(agentPath(cwd, role, 'session.json'), {
    name: role,
    contract: 'Contrato nao definido.',
    permissions: [],
    prohibitions: []
  });
}

export function saveAgentSession(cwd, role, session) {
  writeJson(agentPath(cwd, role, 'session.json'), session);
}

export function readAgentContract(cwd, role) {
  return readText(agentPath(cwd, role, 'contract.md'), '');
}

function byCreatedAt(a, b) {
  return String(a.createdAt).localeCompare(String(b.createdAt));
}
