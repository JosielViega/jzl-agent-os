# Templates

Esta release nao implementa comandos de template. Este documento registra formatos recomendados para futuras fases.

## Contract

```md
# <agent>

## Objetivo
...

## Contrato
...

## Responsabilidades
- ...

## Permissoes
- ...

## Proibicoes
- ...

## Quando criar dependency
...

## Quando criar handoff
...

## Checklist de conclusao
- ...
```

## Task

```json
{
  "id": "task-...",
  "type": "task",
  "from": "system",
  "to": "programador",
  "title": "...",
  "description": "...",
  "status": "pending",
  "createdAt": "..."
}
```

## Message

```json
{
  "id": "message-...",
  "type": "message",
  "from": "programador",
  "to": "revisor",
  "status": "unread",
  "createdAt": "...",
  "title": "...",
  "summary": "..."
}
```
