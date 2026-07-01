# Commands

## Init

```sh
jzl init --type game
```

Cria `jzl.workspace.json`, `workspace/`, `.jzl`, agents, contracts, setores e estrutura base do projeto no layout RFC-0018.

## Migrate

```sh
jzl migrate
```

Migra workspaces legados para o layout RFC-0018, separando Workspace Definition em `workspace/` e Workspace Runtime em `.jzl/`.

## Install

```sh
jzl install --source <path>
jzl install --source <path> --force
jzl installed
```

Instala o registro de um plugin local do ecossistema usando o Filesystem Installer. Esta versao nao copia codigo do plugin para o workspace.

## Sessao E Boot

Os comandos atuais usam `--role` por compatibilidade. Em documentacao de arquitetura, o conceito equivalente e Agent.

```sh
jzl boot --role <role>
jzl session start <role>
jzl session resume
jzl whoami
jzl status
```

`jzl status` mostra um resumo curto do workspace, tipo/template, sessao atual, task atual, mensagens unread, dependencies pending, ultimo evento e Git quando disponivel. Se `jzl.workspace.json` nao existir, usa `.jzl/type.json` como fallback.

## Inbox E Outbox

```sh
jzl inbox
jzl inbox --all
jzl inbox read --id <id>
jzl inbox archive --id <id>
jzl outbox
jzl send --to <role> --summary "..."
```

## Tasks

```sh
jzl task create --to <role> --title "..." --description "..."
jzl task take --id <id>
jzl task current
jzl task complete --summary "..."
```

## Dependencies

```sh
jzl dependency create --to <sector> --reason "..."
jzl dependency list
jzl dependency resolve --id <id> --summary "..."
```

## Journal

```sh
jzl journal add --text "..."
jzl journal show
jzl journal show --task current
jzl journal show --role <role>
```

## Guard, Preflight, History E Next Step

```sh
jzl guard --action "..."
jzl preflight
jzl history
jzl next-step
```

## Git

```sh
jzl git status
jzl git link-task
jzl git current
```

Esses comandos apenas leem Git e registram informacoes no estado JZL. Eles nao criam commits e nao fazem push.

Internamente, os comandos Git usam a capability `version-control`, resolvida para `git-provider`. A interface de CLI permanece a mesma.
