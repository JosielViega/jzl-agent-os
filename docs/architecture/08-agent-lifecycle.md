# 08: Agent Lifecycle

Um agent passa por um ciclo operacional.

## Boot

O agent inicia com `jzl boot --role <agent>`.

O argumento `--role` e mantido por compatibilidade com a CLI atual.

O boot mostra contrato, permissoes, proibicoes, task atual, inbox, outbox, dependencias e comandos esperados.

## Trabalho

O agent le inbox, assume task, registra journal e cria dependency quando encontra assunto fora do contrato.

## Preflight

Antes de concluir, o agent roda `jzl preflight`.

Preflight verifica dependencies, mensagens relacionadas, contrato, checklist e journal.

## Conclusao

O agent conclui a task ou envia handoff para outro agent.
