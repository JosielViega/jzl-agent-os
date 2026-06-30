import { spawnSync } from 'node:child_process';
import { appendEvent, appendJournal, saveInboxItem } from '../agents.js';
import { getCurrentTask, requireCurrentRole } from '../state.js';

export function showGitStatus({ cwd, io }) {
  const status = readGitStatus(cwd);
  io.log(`branch: ${status.branch}`);
  io.log(`modified: ${status.modified ? 'sim' : 'nao'}`);
  io.log(`working tree: ${status.modified ? 'dirty' : 'clean'}`);
  io.log(`last commit: ${status.lastCommit || 'nenhum'}`);
}

export function linkCurrentTaskToCommit({ cwd, io }) {
  const role = requireCurrentRole(cwd);
  const task = getCurrentTask(cwd, role);
  if (!task) throw new Error('Nenhuma task atual. Rode: jzl task take --id <id>');

  const commit = readLastCommit(cwd);
  if (!commit) throw new Error('Repositorio Git sem commits.');

  task.gitCommit = commit.hash;
  task.gitCommitSubject = commit.subject;
  task.gitLinkedAt = new Date().toISOString();
  saveInboxItem(cwd, role, task);
  appendEvent(cwd, 'git.link-task', { role, taskId: task.id, commit: commit.hash });
  appendJournal(cwd, role, `Task: ${task.id}\nGit commit vinculado: ${commit.hash} ${commit.subject}`);

  io.log(`task: ${task.id}`);
  io.log(`commit: ${commit.hash}`);
}

export function showCurrentGitLink({ cwd, io }) {
  const role = requireCurrentRole(cwd);
  const task = getCurrentTask(cwd, role);
  if (!task) {
    io.log('tarefa atual: nenhuma');
    return;
  }

  io.log(`task: ${task.id}`);
  io.log(`title: ${task.title}`);
  io.log(`commit: ${task.gitCommit || 'nenhum'}`);
  if (task.gitCommitSubject) io.log(`commit subject: ${task.gitCommitSubject}`);
}

export function tryReadGitStatus(cwd) {
  try {
    return readGitStatus(cwd);
  } catch {
    return null;
  }
}

function readGitStatus(cwd) {
  ensureGitRepo(cwd);
  const branch = git(cwd, ['branch', '--show-current']).trim() || git(cwd, ['rev-parse', '--short', 'HEAD']).trim();
  const porcelain = git(cwd, ['status', '--porcelain']);
  const lastCommit = readLastCommit(cwd);
  return {
    branch,
    modified: porcelain.trim().length > 0,
    lastCommit: lastCommit ? `${lastCommit.hash} ${lastCommit.subject}` : null
  };
}

function readLastCommit(cwd) {
  ensureGitRepo(cwd);
  const result = spawnSync('git', ['log', '-1', '--pretty=format:%H%x00%s'], { cwd, encoding: 'utf8' });
  if (result.status !== 0) return null;
  const [hash, subject = ''] = result.stdout.split('\0');
  if (!hash) return null;
  return { hash, subject };
}

function ensureGitRepo(cwd) {
  const result = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd, encoding: 'utf8' });
  if (result.status !== 0 || result.stdout.trim() !== 'true') {
    throw new Error('Repositorio Git nao encontrado.');
  }
}

function git(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || 'Falha ao executar git.').trim());
  }
  return result.stdout;
}
