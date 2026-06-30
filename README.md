# JZL Agent OS

JZL Agent OS e uma CLI local, sem IA interna, para coordenar agentes de IA dentro de um projeto. Ele funciona como um pequeno sistema operacional de agentes: guarda estado em arquivos, define contratos, organiza inbox/outbox, controla tasks, dependencias, journal e verificacoes antes de conclusao.

JZL nao substitui o Codex. O Codex continua pensando, lendo codigo e implementando. O JZL fornece o protocolo operacional para que varios chats/agentes saibam quem sao, o que podem fazer, qual task esta ativa, quais dependencias bloqueiam o trabalho e qual deve ser o proximo passo.

## Problema

Chats de IA perdem contexto, misturam responsabilidades e frequentemente pulam etapas: implementam antes de validar escopo, concluem sem registrar decisoes, ignoram dependencias ou assumem tarefas fora do contrato.

O JZL resolve isso criando um estado explicito e local:

- cada agente tem contrato;
- mensagens passam por inbox/outbox;
- tasks precisam ser assumidas antes de executadas;
- dependencias bloqueiam conclusao;
- journal registra continuidade;
- guard confere se uma acao cabe no contrato;
- preflight verifica se uma task pode ser concluida.

## Conceitos

### Agents

Um agent e uma unidade operacional persistente. Cada agent vive em `.jzl/agents/<agent>/` e possui:

- `contract.md`
- `session.json`
- `inbox/`
- `outbox/`
- `journal.md`

No tipo `game`, o JZL cria agentes de funcao (`diretor`, `arquiteto`, `programador`, `revisor`, `testador`, `documentador`) e agentes/setores (`gameplay`, `performance`, `ui-game`, `audio`, `save-system`, `level-design`).

### Inbox e Outbox

A inbox contem mensagens recebidas pelo agente. A outbox contem mensagens enviadas.

`jzl inbox` mostra apenas mensagens `unread/read` nao arquivadas e tasks `pending`. Tasks `current` aparecem em `jzl task current`, no `jzl boot`, ou em `jzl inbox --all`.

### Tasks

Tasks seguem o ciclo:

```txt
pending -> current -> completed
```

Uma task criada entra como `pending` na inbox do agente destino. O agente precisa usar `jzl task take --id <id>` para assumir a task e grava-la como `currentTaskId`.

### Dependencies

Dependencies representam bloqueios fora do contrato ou fora do setor do agente atual. Uma dependency fica vinculada a task atual e bloqueia `task complete` enquanto estiver `pending`.

Se o destino existir como agent, a dependency tambem aparece na inbox dele.

### Contracts

Contratos definem objetivo, responsabilidades, permissoes, proibicoes, quando criar dependency, quando criar handoff e checklist de conclusao.

No JZL, contratos sao mais importantes que prompts: eles definem os limites operacionais do agente.

### Journal

O journal registra continuidade. Quando ha task atual, `jzl journal add` vincula a entrada a task. O `preflight` exige pelo menos uma entrada da task atual antes da conclusao.

### Guard

`jzl guard --action "..."` confere se uma acao pretendida parece permitida, bloqueada ou incerta para o contrato atual.

### Preflight

`jzl preflight` roda a checagem final antes de concluir uma task:

- dependencies pending da task atual;
- mensagens unread relacionadas a task;
- contrato da role atual;
- checklist da role;
- journal da task atual.

## Fluxo Com Codex

O usuario inicializa o projeto:

```sh
jzl init --type game
```

Depois disso, cada chat do Codex usa JZL para se orientar:

```sh
jzl boot --role diretor
jzl next-step
```

O Diretor cria tasks, o Programador assume tasks, setores resolvem dependencias, e o Revisor/Testador/Documentador recebem handoffs conforme necessario.

## v0.2

A v0.2 esta em fase de arquitetura via RFCs. O objetivo e planejar Kernel API, Plugin System, Template System, Event Bus, Capability System, ADRs e dogfooding antes de implementar novos comandos funcionais.

Os RFCs vivem em `docs/rfcs/`. Decisoes aceitas vivem em `docs/adr/`.

Tres leis do Kernel:

- Lei 1: Nenhuma funcionalidade nasce sem RFC.
- Lei 2: Nenhuma RFC nasce sem problema real.
- Lei 3: Kernel e sagrado.

## Exemplo Completo: Game

```sh
jzl init --type game

jzl boot --role diretor
jzl task create --to programador --title "Implementar movimento do jogador" --description "Adicionar movimento horizontal com aceleracao."

jzl boot --role programador
jzl inbox
jzl task take --id <task-id>
jzl guard --action "Implementar codigo da task atual"
jzl journal add --text "Iniciada implementacao do movimento horizontal."

jzl dependency create --to gameplay --reason "Definir regras de aceleracao"

jzl boot --role gameplay
jzl inbox read --id <dependency-id>
jzl dependency resolve --id <dependency-id> --summary "Aceleracao cresce ate velocidade maxima em 0.4s."

jzl boot --role programador
jzl inbox read --id <dependency-response-id>
jzl journal add --text "Aplicada regra de aceleracao definida por gameplay."
jzl preflight
jzl send --to revisor --summary "Movimento implementado e pronto para revisao."
jzl task complete --summary "Movimento horizontal implementado com aceleracao."
```

## Comandos

```sh
jzl init --type game
jzl boot --role <role>
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
jzl next-step
```

## Estrutura

```txt
.jzl/
  project.md
  type.json
  events.log
  agents/
    <agent>/
      contract.md
      session.json
      inbox/
      outbox/
      journal.md
  dependencies/
  handoffs/
  policies/
  workflows/
```

## Desenvolvimento

## Git

O JZL possui uma integracao Git basica e somente local:

```sh
jzl git status
jzl git link-task
jzl git current
```

- `jzl git status` mostra branch atual, working tree clean/dirty e ultimo commit.
- `jzl git link-task` exige task atual, le o ultimo commit e salva o hash na task atual.
- `jzl git current` mostra a task atual e o commit vinculado.

O JZL nao cria commits automaticamente e nao faz push.

## Status

`jzl status` mostra uma visao curta do estado operacional:

- tipo do projeto;
- sessao/role atual;
- task atual;
- mensagens unread;
- dependencies pending da task atual;
- ultimo evento;
- resumo Git quando o projeto for um repositorio.

```sh
npm test
npm run check
```

## Release

Versao atual: `v0.1.0`

Esta release congela o kernel inicial de agentes: init, boot, inbox/outbox, tasks, dependencies, journal, guard, preflight, history e next-step.
