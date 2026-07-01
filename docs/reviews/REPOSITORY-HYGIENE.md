# Repository Hygiene v0.2

Data: 2026-07-01  
Status: concluida

## Objetivo

Preparar o repositorio para a v0.3 separando arquivos versionaveis de Workspace Definition do estado efemero de Workspace Runtime.

## Estrategia Adotada

Foi criado `.gitignore` oficial com regra granular para runtime JZL.

A estrategia segue `docs/rfcs/RFC-0018-WORKSPACE-RUNTIME.md`:

- Workspace Definition deve ser versionavel.
- Workspace Runtime deve ser local e efemero.
- `.jzl` nao deve ser tratado como definicao do projeto.
- A estrutura legada ainda precisa de compatibilidade, por isso a regra escolhida foi granular em vez de ignorar `.jzl/` inteiro.

## Arquivos Versionaveis

Devem continuar versionados:

- `jzl.workspace.json`
- `workspace/**`
- `docs/**`
- `src/**`
- `test/**`
- `package.json`

## Runtime Ignorado

O `.gitignore` oficial ignora:

- `.jzl/events.log`
- `.jzl/session.json`
- `.jzl/session/`
- `.jzl/inbox/`
- `.jzl/outbox/`
- `.jzl/journal/`
- `.jzl/runtime/`
- `.jzl/cache/`
- `.jzl/installed/`
- `.jzl/agents/*/session.json`
- `.jzl/agents/*/journal.md`

## Arquivos Removidos Do Git

Os seguintes arquivos de runtime foram removidos do indice Git sem serem apagados localmente:

- `.jzl/events.log`
- `.jzl/session.json`
- `.jzl/installed/installed.json`
- `.jzl/installed/plugins/git/manifest.json`
- `.jzl/agents/arquiteto/journal.md`
- `.jzl/agents/arquiteto/session.json`
- `.jzl/agents/audio/journal.md`
- `.jzl/agents/audio/session.json`
- `.jzl/agents/diretor/journal.md`
- `.jzl/agents/diretor/session.json`
- `.jzl/agents/documentador/journal.md`
- `.jzl/agents/documentador/session.json`
- `.jzl/agents/gameplay/journal.md`
- `.jzl/agents/gameplay/session.json`
- `.jzl/agents/level-design/journal.md`
- `.jzl/agents/level-design/session.json`
- `.jzl/agents/performance/journal.md`
- `.jzl/agents/performance/session.json`
- `.jzl/agents/programador/journal.md`
- `.jzl/agents/programador/session.json`
- `.jzl/agents/revisor/journal.md`
- `.jzl/agents/revisor/session.json`
- `.jzl/agents/save-system/journal.md`
- `.jzl/agents/save-system/session.json`
- `.jzl/agents/testador/journal.md`
- `.jzl/agents/testador/session.json`
- `.jzl/agents/ui-game/journal.md`
- `.jzl/agents/ui-game/session.json`

## Relacao Com RFC-0018

Esta higiene aplica a decisao de separar Workspace Definition e Workspace Runtime antes da v0.3.

Ela nao implementa o layout futuro, nao cria comando de migracao e nao altera o Kernel. Apenas impede que runtime local continue sendo versionado por acidente.

## Pendencias

- Definir o layout final `workspace/` para contracts, policies, profiles, templates, domains e installed declarativo.
- Criar plano de migracao para tirar definicoes legadas de `.jzl`.
- Definir quando `.jzl/installed/` vira runtime carregado e quando `workspace/installed/manifest.json` vira definicao versionavel.
