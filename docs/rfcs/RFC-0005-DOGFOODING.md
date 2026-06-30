# RFC-0005: Dogfooding

Status: draft  
Target: v0.2

## Objetivo

O JZL Agent OS deve ser desenvolvido usando o proprio JZL. Isso torna os problemas reais visiveis cedo e evita que o sistema vire apenas documentacao abstrata.

## Principio

Toda evolucao significativa deve passar por agents, tasks, dependencies, journal, preflight e vinculo Git quando houver commit relevante.

## Futuro Template kernel

A v0.2 deve preparar um template `kernel` para projetos que desenvolvem o proprio JZL ou ferramentas semelhantes.

Esse template deve criar agents orientados ao nucleo do sistema.

## Agents Sugeridos

- `kernel-architect`: define fronteiras do Kernel API e invariantes.
- `plugin-architect`: define contratos de plugins e capabilities.
- `cli-engineer`: implementa comandos e saidas de CLI.
- `storage-engineer`: cuida de arquivos, migracoes e compatibilidade.
- `docs-engineer`: registra RFCs, comandos e workflows.
- `qa-engineer`: cria testes, cenarios e verificacoes.

## Fluxo De Desenvolvimento

1. Inicializar o projeto com template adequado.
2. Rodar `jzl boot --role <agent>`.
3. Consultar `jzl next-step`.
4. Criar ou assumir task com `jzl task take --id <id>`.
5. Registrar progresso com `jzl journal add --text "..."`.
6. Criar dependency quando o assunto sair do contrato.
7. Resolver dependencies antes de concluir.
8. Rodar `jzl preflight`.
9. Concluir task ou enviar handoff.
10. Usar `jzl git link-task` quando houver commit relacionado.

## Regras De Trabalho

- Nao editar `.jzl` manualmente.
- Nao concluir task com dependency pendente.
- Nao pular journal.
- Nao usar prompt como substituto de contrato.
- Nao adicionar comando novo sem RFC ou task explicita.

## Resultado Esperado

Dogfooding deve revelar lacunas no Kernel API, nos templates, nas policies e nas saidas da CLI antes que a v0.2 seja implementada.

