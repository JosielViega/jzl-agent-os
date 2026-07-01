import { boot } from './commands/boot.js';
import { createDependency, listDependencyItems, resolveDependency } from './commands/dependency.js';
import { createHandoff } from './commands/handoff.js';
import { guardAction } from './commands/guard.js';
import { linkCurrentTaskToCommit, showCurrentGitLink, showGitStatus } from './commands/git.js';
import { showHistory } from './commands/history.js';
import { initProject } from './commands/init.js';
import { archiveInboxMessage, readInboxMessage, showInbox } from './commands/inbox.js';
import { installComponent, listInstalled } from './commands/install.js';
import { addJournalEntry, showJournal, showJournalSummary } from './commands/journal.js';
import { migrateWorkspace } from './commands/migrate.js';
import { nextStep } from './commands/next-step.js';
import { runPreflight } from './commands/preflight.js';
import { showOutbox } from './commands/outbox.js';
import { sendMessage } from './commands/send.js';
import { resumeSession, startSession, whoami } from './commands/session.js';
import { showStatus } from './commands/status.js';
import { completeTask, createTask, showCurrentTask, takeTask } from './commands/task.js';
import { loadHosts } from './hosts/index.js';
import { parseArgs } from './parse.js';

export async function run(argv, options = {}) {
  loadHosts();
  const cwd = options.cwd || process.cwd();
  const io = options.io || console;
  const parsed = parseArgs(argv);
  const [domain, action, value] = parsed.positionals;

  if (!domain || domain === 'help' || domain === '--help' || domain === '-h') {
    return printHelp(io);
  }

  if (domain === 'init') {
    return initProject({ cwd, type: parsed.flags.type, io });
  }

  if (domain === 'install') {
    return installComponent({ cwd, source: parsed.flags.source, force: Boolean(parsed.flags.force), io });
  }

  if (domain === 'installed') {
    return listInstalled({ cwd, io });
  }

  if (domain === 'migrate') {
    return migrateWorkspace({ cwd, io });
  }

  if (domain === 'boot') {
    return boot({ cwd, role: parsed.flags.role, io });
  }

  if (domain === 'session' && action === 'start') {
    return startSession({ cwd, role: value, io });
  }

  if (domain === 'session' && action === 'resume') {
    return resumeSession({ cwd, io });
  }

  if (domain === 'whoami') {
    return whoami({ cwd, io });
  }

  if (domain === 'status') {
    return showStatus({ cwd, io });
  }

  if (domain === 'inbox' && action === 'read') {
    return readInboxMessage({ cwd, id: parsed.flags.id, io });
  }

  if (domain === 'inbox' && action === 'archive') {
    return archiveInboxMessage({ cwd, id: parsed.flags.id, io });
  }

  if (domain === 'inbox') {
    return showInbox({ cwd, all: Boolean(parsed.flags.all), io });
  }

  if (domain === 'outbox') {
    return showOutbox({ cwd, io });
  }

  if (domain === 'send') {
    return sendMessage({ cwd, to: parsed.flags.to, summary: parsed.flags.summary, io });
  }

  if (domain === 'journal' && action === 'add') {
    return addJournalEntry({ cwd, text: parsed.flags.text, io });
  }

  if (domain === 'journal' && action === 'show') {
    return showJournal({ cwd, role: parsed.flags.role, task: parsed.flags.task, io });
  }

  if (domain === 'journal') {
    return showJournalSummary({ cwd, io });
  }

  if (domain === 'history') {
    return showHistory({ cwd, io });
  }

  if (domain === 'guard') {
    return guardAction({ cwd, action: parsed.flags.action, io });
  }

  if (domain === 'git' && action === 'status') {
    return showGitStatus({ cwd, io });
  }

  if (domain === 'git' && action === 'link-task') {
    return linkCurrentTaskToCommit({ cwd, io });
  }

  if (domain === 'git' && action === 'current') {
    return showCurrentGitLink({ cwd, io });
  }

  if (domain === 'preflight') {
    return runPreflight({ cwd, io });
  }

  if (domain === 'task' && action === 'create') {
    return createTask({
      cwd,
      to: parsed.flags.to,
      title: parsed.flags.title,
      description: parsed.flags.description,
      io
    });
  }

  if (domain === 'task' && action === 'current') {
    return showCurrentTask({ cwd, io });
  }

  if (domain === 'task' && action === 'take') {
    return takeTask({ cwd, id: parsed.flags.id, io });
  }

  if (domain === 'task' && action === 'complete') {
    return completeTask({ cwd, summary: parsed.flags.summary, io });
  }

  if (domain === 'dependency' && action === 'create') {
    return createDependency({ cwd, to: parsed.flags.to, reason: parsed.flags.reason, io });
  }

  if (domain === 'dependency' && action === 'list') {
    return listDependencyItems({ cwd, io });
  }

  if (domain === 'dependency' && action === 'resolve') {
    return resolveDependency({ cwd, id: parsed.flags.id, summary: parsed.flags.summary, io });
  }

  if (domain === 'handoff' && action === 'create') {
    return createHandoff({ cwd, to: parsed.flags.to, summary: parsed.flags.summary, io });
  }

  if (domain === 'next-step') {
    return nextStep({ cwd, io });
  }

  throw new Error(`Comando desconhecido: ${parsed.positionals.join(' ')}`);
}

function printHelp(io) {
  io.log(`jzl init --type game
jzl boot --role <role>
jzl install --source <path>
jzl installed
jzl migrate
jzl session start <role>
jzl session resume
jzl whoami
jzl status
jzl inbox
jzl inbox --all
jzl inbox read --id <id>
jzl inbox archive --id <id>
jzl outbox
jzl send --to <role> --summary "..."
jzl journal add --text "..."
jzl journal show
jzl journal show --task current
jzl journal show --role <role>
jzl history
jzl guard --action "..."
jzl git status
jzl git link-task
jzl git current
jzl preflight
jzl task create --to <role> --title "..." --description "..."
jzl task take --id <id>
jzl task current
jzl task complete --summary "..."
jzl dependency create --to <sector> --reason "..."
jzl dependency list
jzl dependency resolve --id <id> --summary "..."
jzl handoff create --to <role> --summary "..."
jzl next-step`);
}
