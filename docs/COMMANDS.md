# Commands

## Init

```sh
jzl init --type game
```

Cria `.jzl`, agents, contracts, setores e estrutura base do projeto.

## Sessao E Boot

```sh
jzl boot --role <role>
jzl session start <role>
jzl session resume
jzl whoami
jzl status
```

`jzl status` mostra um resumo curto do tipo do projeto, sessao atual, task atual, mensagens unread, dependencies pending, ultimo evento e Git quando disponivel.

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
