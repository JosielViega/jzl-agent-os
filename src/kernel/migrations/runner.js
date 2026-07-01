import fs from 'node:fs';
import path from 'node:path';
import {
  ensureDir,
  jzlPath,
  runtimeCachePath,
  runtimeDataPath,
  runtimeInboxPath,
  runtimeJournalPath,
  runtimeOutboxPath,
  runtimeSessionPath,
  workspaceDefinitionPath
} from '../../fs-store.js';
import { createWorkspaceManifest } from '../workspace.js';
import { listMigrations, registerMigration } from './migrationRegistry.js';

export function detectWorkspaceVersion(cwd) {
  const hasManifest = fs.existsSync(path.join(cwd, 'jzl.workspace.json'));
  const hasNewDefinition = fs.existsSync(workspaceDefinitionPath(cwd));
  const hasNewRuntime = fs.existsSync(runtimeSessionPath(cwd)) && fs.existsSync(runtimeInboxPath(cwd));
  if (hasManifest && hasNewDefinition && hasNewRuntime) return 'rfc-0018';

  const hasLegacy = fs.existsSync(jzlPath(cwd, 'agents')) || fs.existsSync(jzlPath(cwd, 'session.json')) || fs.existsSync(jzlPath(cwd, 'contracts'));
  if (hasLegacy) return 'legacy';

  if (hasManifest) return 'manifest-only';
  return 'unknown';
}

export function validateWorkspace(cwd) {
  const version = detectWorkspaceVersion(cwd);
  return {
    ok: version === 'rfc-0018',
    version,
    definitionPath: workspaceDefinitionPath(cwd),
    runtimePath: jzlPath(cwd)
  };
}

export function runMigration(cwd, id = null) {
  registerDefaultMigrations();
  const before = detectWorkspaceVersion(cwd);
  const migrations = id ? listMigrations().filter((migration) => migration.id === id) : listMigrations();
  const executed = [];
  const movedFiles = [];

  for (const migration of migrations) {
    if (!migration.shouldRun(cwd)) continue;
    const result = migration.run(cwd);
    executed.push(migration.id);
    movedFiles.push(...(result.movedFiles || []));
  }

  return {
    workspaceDetected: before !== 'unknown',
    before,
    target: 'rfc-0018',
    executed,
    movedFiles,
    after: detectWorkspaceVersion(cwd),
    valid: validateWorkspace(cwd).ok
  };
}

function registerDefaultMigrations() {
  if (listMigrations().some((migration) => migration.id === '0001-rfc-0018-layout')) return;
  registerMigration(legacyLayoutMigration);
}

const legacyLayoutMigration = {
  id: '0001-rfc-0018-layout',
  name: 'Legacy Layout -> RFC-0018 Layout',
  shouldRun(cwd) {
    return detectWorkspaceVersion(cwd) !== 'rfc-0018';
  },
  run(cwd) {
    return migrateLegacyLayout(cwd);
  }
};

function migrateLegacyLayout(cwd) {
  const movedFiles = [];
  createWorkspaceManifest(cwd, { template: 'game', profile: 'solo' });
  ensureTargetLayout(cwd);

  moveFile(cwd, jzlPath(cwd, 'session.json'), runtimeSessionPath(cwd, 'session.json'), movedFiles);

  const legacyAgents = jzlPath(cwd, 'agents');
  if (fs.existsSync(legacyAgents)) {
    for (const role of fs.readdirSync(legacyAgents).sort()) {
      const agentDir = path.join(legacyAgents, role);
      if (!fs.statSync(agentDir).isDirectory()) continue;

      moveFile(cwd, path.join(agentDir, 'contract.md'), workspaceDefinitionPath(cwd, 'contracts', `${role}.md`), movedFiles);
      moveFile(cwd, path.join(agentDir, 'session.json'), runtimeSessionPath(cwd, 'agents', `${role}.json`), movedFiles);
      moveFile(cwd, path.join(agentDir, 'journal.md'), runtimeJournalPath(cwd, `${role}.md`), movedFiles);
      moveDirectoryFiles(cwd, path.join(agentDir, 'inbox'), runtimeInboxPath(cwd, role), movedFiles);
      moveDirectoryFiles(cwd, path.join(agentDir, 'outbox'), runtimeOutboxPath(cwd, role), movedFiles);
    }
  }

  moveDirectoryFiles(cwd, jzlPath(cwd, 'contracts'), workspaceDefinitionPath(cwd, 'contracts'), movedFiles);
  moveDirectoryFiles(cwd, jzlPath(cwd, 'policies'), workspaceDefinitionPath(cwd, 'policies'), movedFiles);
  moveDirectoryFiles(cwd, jzlPath(cwd, 'workflows'), workspaceDefinitionPath(cwd, 'templates', 'workflows'), movedFiles);
  moveDirectoryFiles(cwd, jzlPath(cwd, 'installed'), workspaceDefinitionPath(cwd, 'installed'), movedFiles);
  moveDirectoryFiles(cwd, jzlPath(cwd, 'dependencies'), runtimeDataPath(cwd, 'dependencies'), movedFiles);
  moveDirectoryFiles(cwd, jzlPath(cwd, 'handoffs'), runtimeDataPath(cwd, 'handoffs'), movedFiles);
  moveDirectoryFiles(cwd, jzlPath(cwd, 'history'), runtimeDataPath(cwd, 'history'), movedFiles);

  return { movedFiles };
}

export function ensureTargetLayout(cwd) {
  ensureDir(workspaceDefinitionPath(cwd, 'contracts'));
  ensureDir(workspaceDefinitionPath(cwd, 'profiles'));
  ensureDir(workspaceDefinitionPath(cwd, 'templates'));
  ensureDir(workspaceDefinitionPath(cwd, 'policies'));
  ensureDir(workspaceDefinitionPath(cwd, 'domains'));
  ensureDir(workspaceDefinitionPath(cwd, 'installed'));
  ensureDir(runtimeSessionPath(cwd, 'agents'));
  ensureDir(runtimeInboxPath(cwd));
  ensureDir(runtimeOutboxPath(cwd));
  ensureDir(runtimeJournalPath(cwd));
  ensureDir(runtimeCachePath(cwd));
  ensureDir(runtimeDataPath(cwd, 'dependencies'));
  ensureDir(runtimeDataPath(cwd, 'handoffs'));
}

function moveDirectoryFiles(cwd, fromDir, toDir, movedFiles) {
  if (!fs.existsSync(fromDir)) return;
  ensureDir(toDir);
  for (const name of fs.readdirSync(fromDir).sort()) {
    const from = path.join(fromDir, name);
    const to = path.join(toDir, name);
    const stat = fs.statSync(from);
    if (stat.isDirectory()) {
      moveDirectoryFiles(cwd, from, to, movedFiles);
      continue;
    }
    moveFile(cwd, from, to, movedFiles);
  }
}

function moveFile(cwd, from, to, movedFiles) {
  if (!fs.existsSync(from)) return;
  ensureDir(path.dirname(to));
  if (fs.existsSync(to)) return;
  fs.renameSync(from, to);
  movedFiles.push(`${path.relative(cwd, from)} -> ${path.relative(cwd, to)}`);
}
