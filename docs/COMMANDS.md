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
```

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
