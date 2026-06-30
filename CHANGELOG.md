# Changelog

## Unreleased

### Documentacao

- Iniciado planejamento da v0.2 por RFCs.
- Criados RFCs para Kernel API, Plugin System, Template System, Event Bus e Dogfooding.
- Criados RFCs para Capability System e Architecture Decision Records.
- Criados ADRs iniciais sobre Kernel, comandos, agents e capabilities.
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
