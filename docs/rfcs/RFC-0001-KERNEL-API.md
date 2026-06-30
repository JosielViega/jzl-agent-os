# RFC-0001: Kernel API

Status: draft  
Target: v0.2

## Objetivo

O Kernel e a camada central do JZL Agent OS. Ele deve concentrar as regras de dominio, leitura e escrita do estado `.jzl`, validacoes de contrato e publicacao de eventos.

Na v0.1, varios comandos CLI conhecem detalhes de armazenamento. Na v0.2, os comandos devem ser adaptadores finos: recebem argumentos, chamam o Kernel API e formatam a saida.

## Entidades Principais

### Project

Representa o projeto JZL inicializado. Guarda tipo, caminhos, configuracoes e metadados.

### Agent

Unidade operacional persistente. Possui contrato, sessao, inbox, outbox e journal.

### Session

Estado ativo de um agent ou da CLI local. Define role atual e task atual.

### Task

Trabalho atribuivel a um agent. Estados esperados: `pending`, `current`, `completed`.

### Message

Item de inbox/outbox. Pode representar comunicacao simples, task, dependency, resposta ou handoff.

### Dependency

Bloqueio vinculado a uma task. Deve impedir conclusao enquanto estiver pendente.

### Journal

Registro cronologico de decisoes, progresso e contexto operacional.

### Contract

Documento que define objetivo, responsabilidades, permissoes, proibicoes e checklist de um agent.

### Event

Registro append-only de algo que aconteceu no sistema.

## Funcoes Esperadas

```js
createTask(input)
takeTask(input)
completeTask(input)
sendMessage(input)
readInbox(input)
createDependency(input)
resolveDependency(input)
addJournalEntry(input)
publishEvent(input)
readEvents(input)
registerPlugin(input)
loadTemplate(input)
```

## Responsabilidades Do Kernel

- Validar se projeto JZL existe.
- Resolver paths internos de `.jzl`.
- Validar agents, tasks, dependencies e mensagens.
- Aplicar regras de bloqueio.
- Atualizar estado em arquivos.
- Publicar eventos.
- Manter compatibilidade de dados quando possivel.
- Expor erros claros para a CLI.

## Responsabilidades Da CLI

- Parsear argumentos.
- Chamar funcoes do Kernel API.
- Mostrar saida curta e objetiva.
- Nao manipular `.jzl` diretamente.

## Regra

Comandos CLI nao devem manipular `.jzl` diretamente. Todo comando funcional deve usar o Kernel API.

