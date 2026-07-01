import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { run } from '../src/cli.js';
import { getCapabilityProvider, hasCapability, listAvailableCapabilities, requireCapability } from '../src/kernel/capabilities.js';
import { publish, readLog, subscribe } from '../src/kernel/eventBus.js';
import {
  clearCapabilities,
  clearPlugins as clearKernelPlugins,
  clearProfiles,
  clearProviders,
  clearInstallers,
  clearServices,
  clearTemplates,
  getInstaller,
  getProvider,
  getPlugin as getKernelPlugin,
  getProfile,
  getService,
  getTemplate,
  listCapabilities,
  listPlugins as listKernelPlugins,
  listProfiles,
  listProviders,
  listInstallers,
  listServices,
  listTemplates,
  registerInstaller,
  registerProvider,
  registerPlugin as registerKernelPlugin,
  registerProfile,
  registerService,
  registerTemplate,
  resolveCapability,
  resolveInstaller,
  resolveProviderByCapability
} from '../src/kernel/registries/index.js';
import { filesystemInstaller } from '../src/installers/filesystem.js';
import { loadInstallers } from '../src/installers/index.js';
import { findWorkspaceRoot, readWorkspaceManifest } from '../src/kernel/workspace.js';
import { loadPlugins, getPlugin, listPlugins } from '../src/plugins/index.js';
import { clearPlugins } from '../src/plugins/registry.js';
import gitPlugin from '../src/plugins/git/index.js';

test('init creates JZL and game project structure', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });

  assert.equal(fs.existsSync(path.join(cwd, 'jzl.workspace.json')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'project.md')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'type.json')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'events.log')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'session.json')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'roles', 'diretor.json')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'contracts', 'programador.md')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'sectors', 'gameplay.json')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'agents', 'programador', 'contract.md')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'agents', 'gameplay', 'contract.md')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'agents', 'gameplay', 'inbox')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'agents', 'performance', 'outbox')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'agents', 'programador', 'inbox')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'agents', 'programador', 'outbox')), true);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'agents', 'programador', 'journal.md')), true);
  assert.equal(fs.existsSync(path.join(cwd, 'src')), true);
  assert.equal(fs.existsSync(path.join(cwd, 'assets')), true);
  assert.equal(fs.existsSync(path.join(cwd, 'docs')), true);
  assert.equal(fs.existsSync(path.join(cwd, 'README.md')), true);
  assert.match(output.text(), /JZL inicializado/);
});

test('init creates workspace manifest with minimum fields', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  const manifest = readWorkspaceManifest(cwd);

  assert.match(manifest.workspaceId, /^workspace-[0-9a-f-]{36}$/);
  assert.equal(manifest.name, path.basename(cwd));
  assert.equal(manifest.kernelVersion, '0.1.0');
  assert.equal(manifest.template, 'game');
  assert.equal(manifest.profile, 'solo');
  assert.match(manifest.createdAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(manifest.manifestVersion, 1);
});

test('findWorkspaceRoot finds root by workspace manifest', async () => {
  const cwd = makeTempDir();
  const output = capture();
  const nested = path.join(cwd, 'src', 'nested');

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  fs.mkdirSync(nested, { recursive: true });

  assert.equal(findWorkspaceRoot(nested), cwd);
});

test('session start and resume show current role state', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  output.clear();
  await run(['session', 'start', 'diretor'], { cwd, io: output.io });
  await run(['session', 'resume'], { cwd, io: output.io });

  assert.match(output.text(), /role ativa: diretor/);
  assert.match(output.text(), /contrato: Diretor define escopo/);
  assert.match(output.text(), /checklist: escopo definido/);
  assert.match(output.text(), /inbox: 0/);
});

test('task flow creates, lists, completes, and moves to history', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Criar fase 1', '--description', 'Primeira fase jogavel.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  output.clear();
  await run(['inbox'], { cwd, io: output.io });
  await run(['task', 'current'], { cwd, io: output.io });
  const taskId = firstInboxId(cwd, 'programador');
  await run(['task', 'take', '--id', taskId], { cwd, io: output.io });
  await run(['task', 'current'], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Implementacao registrada.'], { cwd, io: output.io });
  await run(['task', 'complete', '--summary', 'Fase 1 pronta.'], { cwd, io: output.io });

  const text = output.text();
  assert.match(text, /inbox: 1/);
  assert.match(text, /\[task:pending\]/);
  assert.match(text, /tarefa atual: nenhuma/);
  assert.match(text, /tarefa assumida:/);
  assert.match(text, /tarefa atual: Criar fase 1/);
  assert.match(text, /tarefa concluida:/);
  const agentSession = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'agents', 'programador', 'session.json'), 'utf8'));
  assert.equal(agentSession.currentTaskId, undefined);
  assert.match(fs.readFileSync(path.join(cwd, '.jzl', 'agents', 'programador', 'journal.md'), 'utf8'), /Fase 1 pronta/);
  assert.match(fs.readFileSync(path.join(cwd, '.jzl', 'events.log'), 'utf8'), /task.complete/);
  assert.match(fs.readFileSync(path.join(cwd, '.jzl', 'events.log'), 'utf8'), /task.take/);
});

test('dependency, handoff, whoami, and next-step use current role context', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Preparar HUD', '--description', 'Base para HUD.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });
  await run(['dependency', 'create', '--to', 'design', '--reason', 'Definir HUD.'], { cwd, io: output.io });
  await run(['handoff', 'create', '--to', 'testador', '--summary', 'Build pronto para teste.'], { cwd, io: output.io });
  output.clear();
  await run(['whoami'], { cwd, io: output.io });
  await run(['next-step'], { cwd, io: output.io });

  assert.match(output.text(), /permissoes: alterar codigo da tarefa/);
  assert.match(output.text(), /proibicoes: decidir arquitetura sozinho/);
  assert.match(output.text(), /dependencias abertas: design/);
  assert.match(output.text(), /aguardar\/resolver dependencia antes de concluir/);
  assert.match(output.text(), /jzl dependency list/);
  assert.equal(fs.readdirSync(path.join(cwd, '.jzl', 'agents', 'programador', 'outbox')).length, 1);
  assert.equal(fs.readdirSync(path.join(cwd, '.jzl', 'agents', 'testador', 'inbox')).length, 1);
});

test('boot starts role session and prints operational briefing', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Implementar movimento', '--description', 'Adicionar movimento do jogador.'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Implementar pulo', '--description', 'Adicionar pulo do jogador.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });
  await run(['dependency', 'create', '--to', 'gameplay', '--reason', 'Confirmar velocidade base.'], { cwd, io: output.io });
  output.clear();
  await run(['boot', '--role', 'programador'], { cwd, io: output.io });

  const text = output.text();
  assert.match(text, /JZL BOOT/);
  assert.match(text, /role: programador/);
  assert.match(text, /modo: agente operacional/);
  assert.match(text, /Programador implementa codigo/);
  assert.match(text, /Permissoes:/);
  assert.match(text, /- alterar codigo da tarefa/);
  assert.match(text, /Proibido:/);
  assert.match(text, /- decidir arquitetura sozinho/);
  assert.match(text, /tarefa atual: Implementar movimento/);
  assert.match(text, /Inbox:/);
  assert.match(text, /Implementar pulo \[pending\]/);
  assert.match(text, /Mensagens unread:/);
  assert.match(text, /Mensagens read pendentes:/);
  assert.match(text, /Outbox pendente:/);
  assert.match(text, /Journal:/);
  assert.match(text, /Dependencias abertas:/);
  assert.match(text, /Dependencias da tarefa atual:/);
  assert.match(text, /gameplay \(Confirmar velocidade base\.\)/);
  assert.match(text, /rode jzl task current/);
  assert.match(text, /rode jzl inbox/);
  assert.match(text, /jzl task take --id <id>/);
  assert.match(text, /jzl dependency create --to <sector> --reason/);
  assert.match(text, /jzl handoff create --to revisor --summary/);

  const session = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'session.json'), 'utf8'));
  assert.equal(session.currentRole, 'programador');
});

test('send creates agent outbox and inbox messages', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['send', '--to', 'revisor', '--summary', 'Revisar movimento do jogador.'], { cwd, io: output.io });

  assert.equal(fs.readdirSync(path.join(cwd, '.jzl', 'agents', 'programador', 'outbox')).length, 1);
  assert.equal(fs.readdirSync(path.join(cwd, '.jzl', 'agents', 'revisor', 'inbox')).length, 1);
  assert.match(fs.readFileSync(path.join(cwd, '.jzl', 'events.log'), 'utf8'), /"type":"message"/);
});

test('inbox lists received agent messages', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['send', '--to', 'revisor', '--summary', 'Checar qualidade.'], { cwd, io: output.io });
  await run(['session', 'start', 'revisor'], { cwd, io: output.io });
  output.clear();
  await run(['inbox'], { cwd, io: output.io });

  assert.match(output.text(), /inbox: 1/);
  assert.match(output.text(), /Checar qualidade/);
  assert.match(output.text(), /\[message:unread\]/);
});

test('inbox read marks message as read and archive hides it by default', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['send', '--to', 'revisor', '--summary', 'Ler e arquivar.'], { cwd, io: output.io });
  await run(['session', 'start', 'revisor'], { cwd, io: output.io });
  const messageId = firstInboxId(cwd, 'revisor');

  output.clear();
  await run(['inbox', 'read', '--id', messageId], { cwd, io: output.io });
  await run(['inbox'], { cwd, io: output.io });
  assert.match(output.text(), /status: read/);
  assert.match(output.text(), /\[message:read\]/);

  output.clear();
  await run(['inbox', 'archive', '--id', messageId], { cwd, io: output.io });
  await run(['inbox'], { cwd, io: output.io });
  await run(['inbox', '--all'], { cwd, io: output.io });
  assert.match(output.text(), /mensagem arquivada:/);
  assert.match(output.text(), /inbox: vazia/);
  assert.match(output.text(), /\[message:archived\]/);
});

test('journal add appends entry and history shows events', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'documentador'], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Decisao registrada.'], { cwd, io: output.io });
  output.clear();
  await run(['history'], { cwd, io: output.io });

  assert.match(fs.readFileSync(path.join(cwd, '.jzl', 'agents', 'documentador', 'journal.md'), 'utf8'), /Decisao registrada/);
  assert.match(output.text(), /history:/);
  assert.match(output.text(), /journal.add/);
});

test('task create sends task to target agent inbox and records event', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Criar HUD', '--description', 'Mostrar vida e energia.'], { cwd, io: output.io });

  const inboxFiles = fs.readdirSync(path.join(cwd, '.jzl', 'agents', 'programador', 'inbox'));
  assert.equal(inboxFiles.length, 1);
  const task = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'agents', 'programador', 'inbox', inboxFiles[0]), 'utf8'));
  assert.equal(task.type, 'task');
  assert.equal(task.title, 'Criar HUD');
  assert.equal(task.status, 'pending');
  assert.match(fs.readFileSync(path.join(cwd, '.jzl', 'events.log'), 'utf8'), /task.create/);
});

test('task take only takes task from current agent inbox', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Criar inventario', '--description', 'Inventario simples.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  const taskId = firstInboxId(cwd, 'programador');
  output.clear();
  await run(['task', 'take', '--id', taskId], { cwd, io: output.io });
  await run(['task', 'current'], { cwd, io: output.io });

  const task = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'agents', 'programador', 'inbox', `${taskId}.json`), 'utf8'));
  const session = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'agents', 'programador', 'session.json'), 'utf8'));
  assert.equal(task.status, 'current');
  assert.equal(session.currentTaskId, taskId);
  assert.match(output.text(), /tarefa assumida:/);
  assert.match(output.text(), /tarefa atual: Criar inventario/);
});

test('inbox default hides current task but all and task current show it', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Criar camera', '--description', 'Camera seguindo jogador.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });

  output.clear();
  await run(['inbox'], { cwd, io: output.io });
  assert.match(output.text(), /inbox: vazia/);
  assert.doesNotMatch(output.text(), /Criar camera/);

  output.clear();
  await run(['task', 'current'], { cwd, io: output.io });
  assert.match(output.text(), /tarefa atual: Criar camera/);

  output.clear();
  await run(['inbox', '--all'], { cwd, io: output.io });
  assert.match(output.text(), /Criar camera/);
  assert.match(output.text(), /\[task:current\]/);
});

test('dependency create links to current task and blocks completion until resolved', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Otimizar loop', '--description', 'Reduzir custo do update.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  const taskId = firstInboxId(cwd, 'programador');
  await run(['task', 'take', '--id', taskId], { cwd, io: output.io });
  await run(['dependency', 'create', '--to', 'performance', '--reason', 'Definir limite de FPS.'], { cwd, io: output.io });

  const dependencyId = firstDependencyId(cwd);
  const dependency = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'dependencies', `${dependencyId}.json`), 'utf8'));
  assert.equal(dependency.status, 'pending');
  assert.equal(dependency.taskId, taskId);

  await assert.rejects(
    () => run(['task', 'complete', '--summary', 'Loop otimizado.'], { cwd, io: output.io }),
    /dependencies pending/
  );

  output.clear();
  await run(['dependency', 'list'], { cwd, io: output.io });
  await run(['dependency', 'resolve', '--id', dependencyId, '--summary', 'FPS definido em 60.'], { cwd, io: output.io });
  const responseId = firstInboxIdByPrefix(cwd, 'programador', 'dependency-response-');
  await run(['inbox', 'read', '--id', responseId], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Dependencia resolvida e loop pronto.'], { cwd, io: output.io });
  await run(['task', 'complete', '--summary', 'Loop otimizado.'], { cwd, io: output.io });

  const resolved = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'dependencies', `${dependencyId}.json`), 'utf8'));
  assert.equal(resolved.status, 'resolved');
  assert.match(output.text(), /dependencies: 1/);
  assert.match(output.text(), /dependencia resolvida:/);
  assert.match(output.text(), /tarefa concluida:/);
  assert.match(fs.readFileSync(path.join(cwd, '.jzl', 'events.log'), 'utf8'), /dependency.resolve/);
});

test('sector agent receives dependency and resolve replies to requester', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Ajustar aceleracao', '--description', 'Movimento com aceleracao.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  const taskId = firstInboxId(cwd, 'programador');
  await run(['task', 'take', '--id', taskId], { cwd, io: output.io });
  await run(['dependency', 'create', '--to', 'gameplay', '--reason', 'Definir regras de aceleracao'], { cwd, io: output.io });

  const dependencyId = firstDependencyId(cwd);
  assert.equal(fs.existsSync(path.join(cwd, '.jzl', 'agents', 'gameplay', 'inbox', `${dependencyId}.json`)), true);

  output.clear();
  await run(['boot', '--role', 'gameplay'], { cwd, io: output.io });
  await run(['inbox'], { cwd, io: output.io });
  assert.match(output.text(), /role: gameplay/);
  assert.match(output.text(), /Definir regras de aceleracao/);

  output.clear();
  await run(['dependency', 'resolve', '--id', dependencyId, '--summary', 'Aceleracao cresce ate velocidade maxima.'], { cwd, io: output.io });
  assert.match(output.text(), /dependencia resolvida:/);

  const resolved = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'dependencies', `${dependencyId}.json`), 'utf8'));
  assert.equal(resolved.status, 'resolved');
  assert.equal(resolved.resolvedBy, 'gameplay');
  const requesterInbox = fs.readdirSync(path.join(cwd, '.jzl', 'agents', 'programador', 'inbox'));
  const responseFile = requesterInbox.find((name) => name.startsWith('dependency-response-'));
  assert.ok(responseFile);
  const response = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'agents', 'programador', 'inbox', responseFile), 'utf8'));
  assert.equal(response.type, 'dependency-response');
  assert.equal(response.status, 'unread');
  assert.equal(response.relatedDependencyId, dependencyId);
});

test('next-step recommends boot when no session is active', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  output.clear();
  await run(['next-step'], { cwd, io: output.io });

  assert.match(output.text(), /next-step:\niniciar contexto do agente/);
  assert.match(output.text(), /command:\njzl boot --role <role>/);
});

test('next-step recommends reading first unread message', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['send', '--to', 'revisor', '--summary', 'Mensagem para leitura.'], { cwd, io: output.io });
  await run(['session', 'start', 'revisor'], { cwd, io: output.io });
  const messageId = firstInboxId(cwd, 'revisor');
  output.clear();
  await run(['next-step'], { cwd, io: output.io });

  assert.match(output.text(), /ler primeira mensagem unread/);
  assert.match(output.text(), new RegExp(`jzl inbox read --id ${messageId}`));
});

test('next-step recommends taking pending task when no current task exists', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Criar menu', '--description', 'Menu inicial.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  const taskId = firstInboxId(cwd, 'programador');
  output.clear();
  await run(['next-step'], { cwd, io: output.io });

  assert.match(output.text(), /assumir primeira task pending/);
  assert.match(output.text(), new RegExp(`jzl task take --id ${taskId}`));
});

test('next-step recommends resolving dependency before completing current task', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Ajustar fisica', '--description', 'Fisica do player.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });
  await run(['dependency', 'create', '--to', 'performance', '--reason', 'Validar custo.'], { cwd, io: output.io });
  output.clear();
  await run(['next-step'], { cwd, io: output.io });

  assert.match(output.text(), /aguardar\/resolver dependencia antes de concluir/);
  assert.match(output.text(), /jzl dependency list/);
});

test('next-step recommends working on current task when unblocked', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Criar pausa', '--description', 'Pausa do jogo.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });
  output.clear();
  await run(['next-step'], { cwd, io: output.io });

  assert.match(output.text(), /trabalhar na tarefa atual/);
  assert.match(output.text(), /jzl send --to revisor/);
});

test('next-step recommends waiting or asking director when idle', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  output.clear();
  await run(['next-step'], { cwd, io: output.io });

  assert.match(output.text(), /aguardar nova tarefa ou pedir task ao diretor/);
  assert.match(output.text(), /jzl send --to diretor/);
});

test('guard blocks programmer architecture changes', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  output.clear();
  await run(['guard', '--action', 'Alterar arquitetura do sistema de fases'], { cwd, io: output.io });

  assert.match(output.text(), /status: blocked/);
  assert.match(output.text(), /recommended: criar dependency ou handoff/);
});

test('guard allows programmer implementing task code', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  output.clear();
  await run(['guard', '--action', 'Implementar codigo da task atual'], { cwd, io: output.io });

  assert.match(output.text(), /status: allowed/);
});

test('guard reviews programmer UI design action', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  output.clear();
  await run(['guard', '--action', 'Alterar design UI do HUD'], { cwd, io: output.io });

  assert.match(output.text(), /status: review/);
  assert.match(output.text(), /ui-game/);
});

test('guard blocks director implementing code', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'diretor'], { cwd, io: output.io });
  output.clear();
  await run(['guard', '--action', 'Implementar codigo da fase inicial'], { cwd, io: output.io });

  assert.match(output.text(), /status: blocked/);
});

test('preflight blocks current task with pending dependency', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Finalizar movimento', '--description', 'Movimento final.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Trabalho registrado.'], { cwd, io: output.io });
  await run(['dependency', 'create', '--to', 'gameplay', '--reason', 'Confirmar curva.'], { cwd, io: output.io });
  output.clear();
  await run(['preflight'], { cwd, io: output.io });

  assert.match(output.text(), /status: blocked/);
  assert.match(output.text(), /dependencies pending/);
});

test('preflight reviews current task without journal entry', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Criar portal', '--description', 'Portal simples.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });
  output.clear();
  await run(['preflight'], { cwd, io: output.io });

  assert.match(output.text(), /status: review/);
  assert.match(output.text(), /journal sem entrada da task atual/);
});

test('preflight passes when task is documented and unblocked', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Criar ponte', '--description', 'Ponte funcional.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Implementacao da ponte registrada.'], { cwd, io: output.io });
  output.clear();
  await run(['preflight'], { cwd, io: output.io });

  assert.match(output.text(), /status: passed/);
  assert.match(output.text(), /pode concluir a task/);
});

test('journal show displays current role journal and filters current task', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['task', 'create', '--to', 'programador', '--title', 'Criar mapa', '--description', 'Mapa inicial.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Entrada geral.'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Entrada da task atual.'], { cwd, io: output.io });

  output.clear();
  await run(['journal', 'show'], { cwd, io: output.io });
  assert.match(output.text(), /Entrada geral/);
  assert.match(output.text(), /Entrada da task atual/);

  output.clear();
  await run(['journal', 'show', '--task', 'current'], { cwd, io: output.io });
  assert.doesNotMatch(output.text(), /Entrada geral/);
  assert.match(output.text(), /Entrada da task atual/);
});

test('journal show can read another role journal', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'documentador'], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Nota do documentador.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  output.clear();
  await run(['journal', 'show', '--role', 'documentador'], { cwd, io: output.io });

  assert.match(output.text(), /journal: documentador/);
  assert.match(output.text(), /Nota do documentador/);
});

test('boot shows only last three journal entries', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Entrada 1.'], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Entrada 2.'], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Entrada 3.'], { cwd, io: output.io });
  await run(['journal', 'add', '--text', 'Entrada 4.'], { cwd, io: output.io });
  output.clear();
  await run(['boot', '--role', 'programador'], { cwd, io: output.io });

  assert.doesNotMatch(output.text(), /Entrada 1/);
  assert.match(output.text(), /Entrada 2/);
  assert.match(output.text(), /Entrada 3/);
  assert.match(output.text(), /Entrada 4/);
});

test('git status shows branch, dirty state, and last commit', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  initGitRepo(cwd);
  output.clear();
  await run(['git', 'status'], { cwd, io: output.io });

  assert.match(output.text(), /branch:/);
  assert.match(output.text(), /modified: nao/);
  assert.match(output.text(), /working tree: clean/);
  assert.match(output.text(), /last commit: [a-f0-9]{40} initial commit/);

  fs.writeFileSync(path.join(cwd, 'dirty.txt'), 'dirty', 'utf8');
  output.clear();
  await run(['git', 'status'], { cwd, io: output.io });
  assert.match(output.text(), /modified: sim/);
  assert.match(output.text(), /working tree: dirty/);
});

test('git link-task saves last commit on current task and git current shows it', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  initGitRepo(cwd);
  await run(['task', 'create', '--to', 'programador', '--title', 'Vincular commit', '--description', 'Associar task ao commit.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  const taskId = firstInboxId(cwd, 'programador');
  await run(['task', 'take', '--id', taskId], { cwd, io: output.io });
  output.clear();
  await run(['git', 'link-task'], { cwd, io: output.io });
  await run(['git', 'current'], { cwd, io: output.io });

  const task = JSON.parse(fs.readFileSync(path.join(cwd, '.jzl', 'agents', 'programador', 'inbox', `${taskId}.json`), 'utf8'));
  assert.match(task.gitCommit, /^[a-f0-9]{40}$/);
  assert.match(output.text(), /task:/);
  assert.match(output.text(), /commit: [a-f0-9]{40}/);
  assert.match(fs.readFileSync(path.join(cwd, '.jzl', 'events.log'), 'utf8'), /git.link-task/);
  assert.match(fs.readFileSync(path.join(cwd, '.jzl', 'agents', 'programador', 'journal.md'), 'utf8'), /Git commit vinculado/);
});

test('git commands fail clearly outside git repository', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  await assert.rejects(
    () => run(['git', 'status'], { cwd, io: output.io }),
    /Repositorio Git nao encontrado/
  );
});

test('status shows no session and non initialized git', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  output.clear();
  await run(['status'], { cwd, io: output.io });

  assert.match(output.text(), new RegExp(`workspace: ${path.basename(cwd)}`));
  assert.match(output.text(), /tipo: game/);
  assert.match(output.text(), /sessao: nenhuma/);
  assert.match(output.text(), /task atual: nenhuma/);
  assert.match(output.text(), /mensagens unread: 0/);
  assert.match(output.text(), /dependencies pending da task: 0/);
  assert.match(output.text(), /ultimo evento: nenhum/);
  assert.match(output.text(), /git: nao inicializado/);
});

test('status falls back to legacy type when workspace manifest is missing', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  fs.unlinkSync(path.join(cwd, 'jzl.workspace.json'));
  output.clear();
  await run(['status'], { cwd, io: output.io });

  assert.doesNotMatch(output.text(), /workspace:/);
  assert.match(output.text(), /tipo: game/);
  assert.match(output.text(), /sessao: nenhuma/);
});

test('status shows operational summary with task, unread, dependency, event, and git', async () => {
  const cwd = makeTempDir();
  const output = capture();

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  initGitRepo(cwd);
  await run(['task', 'create', '--to', 'programador', '--title', 'Status task', '--description', 'Ver status.'], { cwd, io: output.io });
  await run(['session', 'start', 'programador'], { cwd, io: output.io });
  await run(['task', 'take', '--id', firstInboxId(cwd, 'programador')], { cwd, io: output.io });
  await run(['dependency', 'create', '--to', 'gameplay', '--reason', 'Confirmar regra.'], { cwd, io: output.io });
  await run(['send', '--to', 'programador', '--summary', 'Mensagem unread.'], { cwd, io: output.io });

  output.clear();
  await run(['status'], { cwd, io: output.io });

  assert.match(output.text(), new RegExp(`workspace: ${path.basename(cwd)}`));
  assert.match(output.text(), /tipo: game/);
  assert.match(output.text(), /sessao: programador/);
  assert.match(output.text(), /task atual: task-.*Status task/);
  assert.match(output.text(), /mensagens unread: 1/);
  assert.match(output.text(), /dependencies pending da task: 1/);
  assert.match(output.text(), /ultimo evento: message/);
  assert.match(output.text(), /git: main dirty [a-f0-9]{40} initial commit/);
});

test('event bus publishes to events log and notifies subscribers', async () => {
  const cwd = makeTempDir();
  const output = capture();
  const type = `event.bus.test.${Date.now()}`;
  let seen = null;

  await run(['init', '--type', 'game'], { cwd, io: output.io });
  const unsubscribe = subscribe(type, (event) => {
    seen = event;
  });
  const event = publish(type, { cwd, role: 'programador' });
  unsubscribe();

  const [logged] = readLog(cwd, 1);
  assert.equal(event.type, type);
  assert.equal(seen.type, type);
  assert.equal(seen.role, 'programador');
  assert.equal(logged.type, type);
  assert.equal(logged.role, 'programador');
});

test('plugin registry loads git plugin metadata', () => {
  clearPlugins();
  clearKernelPlugins();
  clearCapabilities();
  clearProviders();
  const plugins = loadPlugins();
  const gitPlugin = getPlugin('git');

  assert.equal(plugins.length, 1);
  assert.equal(gitPlugin.manifest.name, 'git');
  assert.equal(gitPlugin.manifest.version, '0.1.0');
  assert.deepEqual(gitPlugin.manifest.commands, ['git status', 'git link-task', 'git current']);
  assert.equal(listPlugins()[0].manifest.name, 'git');
  assert.equal(getKernelPlugin('git').manifest.name, 'git');
  assert.equal(listKernelPlugins()[0].manifest.name, 'git');
  assert.equal(resolveCapability('version-control').name, 'git');
  assert.equal(resolveProviderByCapability('version-control').name, 'git-provider');
});

test('kernel services registry registers and lists services', () => {
  clearServices();
  const service = { run: () => 'ok' };

  registerService('workspace', service);

  assert.equal(getService('workspace'), service);
  assert.deepEqual(listServices(), [{ name: 'workspace', service }]);
});

test('kernel plugins registry registers git plugin and capabilities', () => {
  clearKernelPlugins();
  clearCapabilities();
  clearProviders();

  registerKernelPlugin(gitPlugin);

  assert.equal(getKernelPlugin('git').manifest.name, 'git');
  assert.equal(listKernelPlugins()[0].manifest.name, 'git');
  assert.equal(resolveCapability('version-control').name, 'git');
  assert.equal(resolveProviderByCapability('version-control').name, 'git-provider');
  assert.equal(listCapabilities().some((item) => item.name === 'version-control'), true);
});

test('kernel capabilities registry resolves version-control to git', () => {
  clearKernelPlugins();
  clearCapabilities();
  clearProviders();

  registerKernelPlugin(gitPlugin);
  const provider = resolveCapability('version-control');

  assert.equal(provider.name, 'git');
  assert.equal(provider.plugin.manifest.name, 'git');
});

test('kernel providers registry registers and resolves providers', () => {
  clearProviders();
  const provider = {
    name: 'git-provider',
    plugin: gitPlugin,
    capabilities: ['version-control'],
    services: {}
  };

  registerProvider(provider);

  assert.equal(getProvider('git-provider').name, 'git-provider');
  assert.equal(listProviders()[0].name, 'git-provider');
  assert.equal(resolveProviderByCapability('version-control').name, 'git-provider');
  assert.equal(resolveProviderByCapability('version-control').plugin.manifest.name, 'git');
  assert.equal(resolveProviderByCapability('version-control').capabilities.includes('version-control'), true);
});

test('capability resolver resolves version-control after loading plugins', () => {
  clearPlugins();
  clearKernelPlugins();
  clearCapabilities();
  clearProviders();

  loadPlugins();

  assert.equal(hasCapability('version-control'), true);
  assert.equal(getCapabilityProvider('version-control').name, 'git-provider');
  assert.equal(getCapabilityProvider('version-control').plugin.manifest.name, 'git');
  assert.equal(typeof getCapabilityProvider('version-control').services.status, 'function');
  assert.equal(typeof getCapabilityProvider('version-control').services.lastCommit, 'function');
  assert.equal(typeof getCapabilityProvider('version-control').services.currentBranch, 'function');
  assert.equal(typeof getCapabilityProvider('version-control').services.linkTask, 'function');
  assert.equal(requireCapability('version-control').name, 'git-provider');
  assert.equal(listAvailableCapabilities().some((item) => item.name === 'version-control'), true);
});

test('capability resolver fails clearly when capability is missing', () => {
  clearKernelPlugins();
  clearCapabilities();
  clearProviders();

  assert.equal(hasCapability('missing-capability'), false);
  assert.equal(getCapabilityProvider('missing-capability'), null);
  assert.throws(
    () => requireCapability('missing-capability'),
    /Capability nao disponivel: missing-capability/
  );
});

test('kernel templates registry registers and lists templates', () => {
  clearTemplates();
  const template = { name: 'game', agents: ['programador'] };

  registerTemplate('game', template);

  assert.equal(getTemplate('game'), template);
  assert.deepEqual(listTemplates(), [{ name: 'game', template }]);
});

test('kernel profiles registry registers and lists profiles', () => {
  clearProfiles();
  const profile = { name: 'solo', policies: [] };

  registerProfile('solo', profile);

  assert.equal(getProfile('solo'), profile);
  assert.deepEqual(listProfiles(), [{ name: 'solo', profile }]);
});

test('kernel installers registry registers, lists, and resolves filesystem installer', () => {
  clearInstallers();
  const source = makeTempDir();

  registerInstaller(filesystemInstaller);

  assert.equal(getInstaller('filesystem').name, 'filesystem');
  assert.equal(listInstallers()[0].name, 'filesystem');
  assert.equal(resolveInstaller(source).name, 'filesystem');
});

test('loadInstallers registers filesystem installer', () => {
  clearInstallers();

  loadInstallers();

  assert.equal(getInstaller('filesystem').name, 'filesystem');
});

test('filesystem installer reads manifest.json metadata', () => {
  const componentDir = makeTempDir();
  fs.writeFileSync(path.join(componentDir, 'manifest.json'), JSON.stringify({
    name: 'jzl-plugin-git',
    type: 'plugin',
    componentVersion: '0.1.0'
  }), 'utf8');

  const metadata = filesystemInstaller.read(componentDir);

  assert.equal(metadata.name, 'jzl-plugin-git');
  assert.equal(metadata.type, 'plugin');
  assert.equal(metadata.manifest.componentVersion, '0.1.0');
  assert.equal(metadata.manifestPath, path.join(componentDir, 'manifest.json'));
});

test('filesystem installer reads jzl.plugin.json metadata', () => {
  const componentDir = makeTempDir();
  fs.writeFileSync(path.join(componentDir, 'jzl.plugin.json'), JSON.stringify({
    name: 'jzl-plugin-git',
    componentVersion: '0.1.0'
  }), 'utf8');

  const metadata = filesystemInstaller.read(componentDir);

  assert.equal(metadata.name, 'jzl-plugin-git');
  assert.equal(metadata.type, 'plugin');
  assert.equal(metadata.manifest.componentVersion, '0.1.0');
  assert.equal(metadata.manifestPath, path.join(componentDir, 'jzl.plugin.json'));
});

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'jzl-agent-os-'));
}

function initGitRepo(cwd) {
  runGit(cwd, ['init', '-b', 'main']);
  fs.writeFileSync(path.join(cwd, 'tracked.txt'), 'initial', 'utf8');
  runGit(cwd, ['add', '.']);
  runGit(cwd, ['-c', 'user.name=JZL Test', '-c', 'user.email=jzl@example.test', 'commit', '-m', 'initial commit']);
}

function runGit(cwd, args) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function firstInboxId(cwd, role) {
  const inboxDir = path.join(cwd, '.jzl', 'agents', role, 'inbox');
  const [file] = fs.readdirSync(inboxDir).filter((name) => name.endsWith('.json')).sort();
  return path.basename(file, '.json');
}

function firstDependencyId(cwd) {
  const dependencyDir = path.join(cwd, '.jzl', 'dependencies');
  const [file] = fs.readdirSync(dependencyDir).filter((name) => name.endsWith('.json')).sort();
  return path.basename(file, '.json');
}

function firstInboxIdByPrefix(cwd, role, prefix) {
  const inboxDir = path.join(cwd, '.jzl', 'agents', role, 'inbox');
  const [file] = fs.readdirSync(inboxDir).filter((name) => name.startsWith(prefix)).sort();
  return path.basename(file, '.json');
}

function capture() {
  const lines = [];
  return {
    io: {
      log(message = '') {
        lines.push(String(message));
      },
      error(message = '') {
        lines.push(String(message));
      }
    },
    text() {
      return lines.join('\n');
    },
    clear() {
      lines.length = 0;
    }
  };
}
