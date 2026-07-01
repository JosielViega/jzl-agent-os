import fs from 'node:fs';
import {
  appendText,
  definitionContractPath,
  ensureDir,
  jzlPath,
  listJson,
  makeId,
  nowIso,
  readJsonFirst,
  readTextFirst,
  runtimeDataPath,
  runtimeInboxPath,
  runtimeJournalPath,
  runtimeOutboxPath,
  runtimeSessionPath,
  writeJson
} from './fs-store.js';
import { publish as publishBusEvent, readLog } from './kernel/eventBus.js';

export const ROLE_AGENTS = ['diretor', 'arquiteto', 'programador', 'revisor', 'testador', 'documentador'];
export const GAME_SECTORS = ['gameplay', 'performance', 'ui-game', 'audio', 'save-system', 'level-design'];
export const GAME_AGENTS = [...ROLE_AGENTS, ...GAME_SECTORS];

export function agentPath(cwd, role, ...parts) {
  return jzlPath(cwd, 'agents', role, ...parts);
}

export function agentExists(cwd, role) {
  return fs.existsSync(runtimeInboxPath(cwd, role))
    || fs.existsSync(runtimeSessionPath(cwd, 'agents', `${role}.json`))
    || fs.existsSync(definitionContractPath(cwd, role))
    || fs.existsSync(agentPath(cwd, role));
}

export function ensureAgentDirs(cwd, role) {
  ensureDir(runtimeInboxPath(cwd, role));
  ensureDir(runtimeOutboxPath(cwd, role));
}

export function listInbox(cwd, role) {
  return listAgentJson(cwd, role, 'inbox')
    .filter((item) => !['archived', 'resolved', 'completed'].includes(item.status))
    .filter((item) => item.type !== 'task' || item.status === 'pending')
    .sort(byCreatedAt);
}

export function listInboxAll(cwd, role) {
  return listAgentJson(cwd, role, 'inbox').sort(byCreatedAt);
}

export function listOutbox(cwd, role) {
  return listAgentJson(cwd, role, 'outbox')
    .filter((item) => !['archived', 'resolved', 'completed'].includes(item.status))
    .sort(byCreatedAt);
}

export function listDependencies(cwd, role, taskId = null) {
  const runtimeItems = listJson(runtimeDataPath(cwd, 'dependencies'));
  const items = runtimeItems.length ? runtimeItems : listJson(jzlPath(cwd, 'dependencies'));
  return items
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
  writeJson(runtimeInboxPath(cwd, role, `${item.id}.json`), item);
}

export function readInboxItem(cwd, role, id) {
  return readJsonFirst([
    runtimeInboxPath(cwd, role, `${id}.json`),
    agentPath(cwd, role, 'inbox', `${id}.json`)
  ], null);
}

export function saveOutboxItem(cwd, role, item) {
  writeJson(runtimeOutboxPath(cwd, role, `${item.id}.json`), item);
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
  publishBusEvent(type, { cwd, ...data });
}

export function readEvents(cwd, limit = 10) {
  return readLog(cwd, limit);
}

export function appendJournal(cwd, role, text) {
  const entry = `\n## ${nowIso()}\n${text}\n`;
  appendText(runtimeJournalPath(cwd, `${role}.md`), entry);
  appendEvent(cwd, 'journal.add', { role, text });
}

export function readJournal(cwd, role) {
  return readTextFirst([
    runtimeJournalPath(cwd, `${role}.md`),
    agentPath(cwd, role, 'journal.md')
  ], '');
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
  return readJsonFirst([
    runtimeSessionPath(cwd, 'agents', `${role}.json`),
    agentPath(cwd, role, 'session.json')
  ], {
    name: role,
    contract: 'Contrato nao definido.',
    permissions: [],
    prohibitions: []
  });
}

export function saveAgentSession(cwd, role, session) {
  writeJson(runtimeSessionPath(cwd, 'agents', `${role}.json`), session);
}

export function readAgentContract(cwd, role) {
  return readTextFirst([
    definitionContractPath(cwd, role),
    agentPath(cwd, role, 'contract.md'),
    jzlPath(cwd, 'contracts', `${role}.md`)
  ], '');
}

function byCreatedAt(a, b) {
  return String(a.createdAt).localeCompare(String(b.createdAt));
}

function listAgentJson(cwd, role, box) {
  const runtimeDir = box === 'inbox' ? runtimeInboxPath(cwd, role) : runtimeOutboxPath(cwd, role);
  const runtimeItems = listJson(runtimeDir);
  if (runtimeItems.length) return runtimeItems;
  return listJson(agentPath(cwd, role, box));
}
