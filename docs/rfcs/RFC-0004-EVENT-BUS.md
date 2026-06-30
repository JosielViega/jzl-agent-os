# RFC-0004: Event Bus

Status: draft, Event Bus minimo iniciado  
Target: v0.2

## Objetivo

O Event Bus organiza a publicacao e consumo de eventos dentro do JZL Agent OS. Ele permite que comandos e plugins reajam a mudancas sem acoplamento direto.

## Conceito

Cada acao relevante publica um evento. Subscribers internos ou plugins podem reagir a esses eventos para registrar journal, atualizar indices, validar policies ou executar integracoes locais.

## Eventos Iniciais

- `task.created`
- `task.taken`
- `task.completed`
- `dependency.created`
- `dependency.resolved`
- `message.sent`
- `journal.added`
- `git.taskLinked`

## events.log Atual

Na v0.1, `events.log` e um arquivo append-only simples. Ele serve como historico recente e auditoria basica.

Limites atuais:

- sem indice;
- sem schema versionado;
- sem subscribers;
- sem replay estruturado;
- sem separacao entre publicacao e persistencia.

## Event Store Futuro

O Event Store futuro deve continuar baseado em arquivos, mas com schema explicito e leitura mais estruturada.

Possibilidades:

- eventos em JSON Lines;
- schema versionado;
- filtros por tipo, agent, task e dependency;
- replay por plugin;
- snapshots de estado derivados.

## Subscribers

Subscribers sao funcoes registradas para reagir a eventos. Exemplos:

- ao publicar `task.completed`, sugerir handoff para revisor;
- ao publicar `dependency.resolved`, enviar mensagem ao solicitante;
- ao publicar `git.taskLinked`, adicionar entrada no journal;
- ao publicar `journal.added`, atualizar indice de continuidade.

## Regra

Comandos publicam eventos; subscribers e plugins reagem. Comandos nao devem chamar diretamente integracoes externas quando um evento puder representar melhor a mudanca operacional.

## Implementacao Minima

A primeira versao do Event Bus vive em `src/kernel/eventBus.js`.

Funcoes iniciais:

- `publish(type, payload)`: grava o evento no `events.log` e notifica subscribers em memoria.
- `subscribe(type, handler)`: registra um handler em memoria e retorna uma funcao de unsubscribe.
- `emit(type, payload)`: notifica subscribers sem gravar no log.
- `readLog(cwd, limit)`: le eventos recentes do `events.log`.

O `events.log` continua sendo gravado no mesmo formato JSON Lines usado na v0.1. Subscribers ainda sao apenas em memoria e nao sobrevivem entre execucoes da CLI.

`publishEvent()` passa a usar `eventBus.publish()`, e leituras do historico passam a usar `eventBus.readLog()` por baixo.
