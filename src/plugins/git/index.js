import { spawnSync } from 'node:child_process';
import manifest from './manifest.json' with { type: 'json' };
import { appendEvent, appendJournal, saveInboxItem } from '../../agents.js';

const plugin = {
  manifest
};

plugin.providers = (manifest.providers || []).map((provider) => ({
  ...provider,
  plugin,
  services: {
    status({ cwd }) {
      return readGitStatus(cwd);
    },
    lastCommit({ cwd }) {
      return readLastCommit(cwd);
    },
    currentBranch({ cwd }) {
      return readCurrentBranch(cwd);
    },
    linkTask({ cwd, role, task }) {
      const commit = readLastCommit(cwd);
      if (!commit) throw new Error('Repositorio Git sem commits.');

      task.gitCommit = commit.hash;
      task.gitCommitSubject = commit.subject;
      task.gitLinkedAt = new Date().toISOString();
      saveInboxItem(cwd, role, task);
      appendEvent(cwd, 'git.link-task', { role, taskId: task.id, commit: commit.hash });
      appendJournal(cwd, role, `Task: ${task.id}\nGit commit vinculado: ${commit.hash} ${commit.subject}`);
      return { task, commit };
    }
  }
}));

export default plugin;

function readGitStatus(cwd) {
  ensureGitRepo(cwd);
  const branch = readCurrentBranch(cwd);
  const porcelain = git(cwd, ['status', '--porcelain']);
  const lastCommit = readLastCommit(cwd);
  return {
    branch,
    modified: porcelain.trim().length > 0,
    lastCommit: lastCommit ? `${lastCommit.hash} ${lastCommit.subject}` : null
  };
}

function readCurrentBranch(cwd) {
  ensureGitRepo(cwd);
  return git(cwd, ['branch', '--show-current']).trim() || git(cwd, ['rev-parse', '--short', 'HEAD']).trim();
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
