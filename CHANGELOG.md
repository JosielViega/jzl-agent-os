# Changelog

## Unreleased

### Documentacao

- Criada a Constituicao do JZL Agent OS.
- Criado RFC-0000 para explicar a Constituicao.
- Iniciado planejamento da v0.2 por RFCs.
- Criados RFCs para Kernel API, Plugin System, Template System, Event Bus e Dogfooding.
- Criados RFCs para Capability System e Architecture Decision Records.
- Criados ADRs iniciais sobre Kernel, comandos, agents e capabilities.
- Iniciada Sprint 0 da v0.2 com VISION, glossario, naming, design e documentacao de arquitetura.
- Revisada a documentacao da Sprint 0 para alinhar Agent, Workspace, Kernel Services, RFCs e ADRs.
- Criado RFC-0008 para Workspace Manifest e conceito formal de Workspace.
- Criados RFCs para Registry System, Lifecycle Model e Domain Model.
- Implementado Workspace Manifest minimo em `jzl init --type game`, mantendo `.jzl/type.json` por compatibilidade.
- Implementado Registry System minimo em memoria no Kernel, sem alterar comportamento da CLI.
- Conectado Plugin System ao Registry System para registrar plugins e capabilities durante `loadPlugins()`.
- Implementado Capability Resolver minimo sobre o Capabilities Registry.
- Implementado Provider System minimo entre Capability e Plugin.
- Migrados comandos `jzl git` para usar `version-control` via `git-provider`, mantendo saida compativel.
- Criado RFC-0013 para planejar Template Packs v0.2.
- Criados RFCs para Ecosystem Model, Distribution System e Compatibility Versioning.
- Criado RFC-0017 para planejar Installer System.
- Atualizado roadmap com secao v0.2.
- Adicionada nota no README sobre arquitetura via RFCs.

## v0.1.0

Release conceitual inicial do JZL Agent OS.

### Funcionalidades Implementadas

- CLI `jzl` instalavel via `npm link`.
- `jzl init --type game`.
- Agents persistentes com `contract.md`, `session.json`, `inbox`, `outbox` e `journal.md`.
- Agents de funcao: diretor, arquiteto, programador, revisor, testador e documentador.
- Agents/setores game: gameplay, performance, ui-game, audio, save-system e level-design.
- Boot operacional por role.
- Inbox/outbox com status de mensagens.
- Tasks com ciclo `pending -> current -> completed`.
- Dependencies vinculadas a task atual.
- Resolve de dependencies com resposta ao solicitante.
- Handoffs e mensagens entre agents.
- Journal com filtro por task e role.
- History baseado em `events.log`.
- Guard deterministico baseado em contrato.
- Preflight antes de concluir tasks.
- Next-step deterministico baseado em estado.
- Testes automatizados com `node:test`.
- Check de sintaxe com `npm run check`.

### Decisoes De Arquitetura

- O nucleo nao usa IA.
- O nucleo nao usa banco de dados.
- O estado vive em arquivos dentro de `.jzl`.
- Agents devem usar comandos em vez de editar `.jzl` manualmente.
- Contracts definem limites operacionais.
- Dependencies bloqueiam conclusao enquanto pendentes.
- Journal e events.log garantem continuidade e auditoria.
