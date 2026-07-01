# Architecture Freeze v0.2

## Objetivo

Este documento congela a arquitetura conceitual da v0.2 antes do inicio da v0.3.

Congelar nao significa impedir evolucao. Significa declarar quais decisoes sao base para a proxima fase e nao devem ser reabertas sem RFC ou ADR.

## Estado Congelado

### 1. Kernel

O Kernel e pequeno, permanente e conhece apenas conceitos universais:

- Agent
- Session
- Task
- Message
- Dependency
- Journal
- Contract
- Event
- Project
- Workspace

Tecnologias especificas nao entram no Kernel.

### 2. Workspace

Workspace e a unidade maxima do JZL.

O Workspace pode conter varios Domains e Projects. Kernel, Runtime, Agents, Plugins, Providers, Capabilities e Hosts pertencem ao Workspace.

### 3. Workspace Definition E Runtime

Workspace Definition e persistente e versionavel.

Workspace Runtime e local, efemero e operacional.

Direcao congelada:

```txt
jzl.workspace.json
workspace/
  contracts/
  policies/
  profiles/
  templates/
  domains/
  installed/
.jzl/
  session/
  inbox/
  outbox/
  journal/
  events.log
  cache/
  runtime/
```

A estrutura atual em `.jzl/agents` permanece por compatibilidade, mas nao e o modelo final.

### 4. Agent

Agent e papel operacional persistente.

Um Agent possui contrato, session, inbox, outbox, journal e tasks. Agent nao controla o Workspace sozinho e nao edita `.jzl` manualmente.

### 5. Host

Host e processo capaz de operar um Workspace atraves do Kernel.

Exemplos:

- JZL CLI
- Codex
- Claude Code
- Cursor
- OpenHands
- IDE plugins
- automacoes proprias

Host e diferente de Agent.

### 6. Events

Toda alteracao relevante deve gerar Event.

O `events.log` atual e uma forma inicial de Event Store. O Event Bus deve permitir publicacao e reacao sem esconder a rastreabilidade.

### 7. Plugins, Providers E Capabilities

Arquitetura congelada:

```txt
Capability -> Provider -> Plugin
```

Capability e o que o sistema precisa. Provider e a implementacao operacional. Plugin e o pacote que registra providers, comandos e metadados.

O Kernel consome Provider atraves de Capability Resolver. Ele nao consome Plugin diretamente.

### 8. Registries

Registries existem para descoberta sem acoplamento:

- Services Registry
- Plugins Registry
- Providers Registry
- Capabilities Registry
- Templates Registry
- Profiles Registry
- Installers Registry
- Distribution Registry futuro

### 9. Templates E Ecosystem

Core deve permanecer pequeno.

Templates, Plugins, Profiles, Policies e Packs fazem parte do Ecosystem e podem viver em repositorios proprios.

Git deve futuramente sair do Core como `jzl-plugin-git`. Game deve futuramente sair do Core como `jzl-template-game`.

### 10. Constitution, RFCs E ADRs

A Constituicao governa decisoes futuras.

As tres leis permanecem:

- Nenhuma funcionalidade nasce sem RFC.
- Nenhuma RFC nasce sem problema real.
- Kernel e sagrado.

Decisoes permanentes devem virar ADR.

## O Que Nao Esta Congelado

- Formato final de `workspace/installed/manifest.json`.
- Implementacao do Runtime Layout.
- Handshake do Host Protocol v1.
- Estrategia final de concorrencia entre Hosts.
- Formato final de Template Packs.
- Forma final de carregar plugins externos.

## Regra Para v0.3

A v0.3 deve implementar sobre esta base. Mudancas conceituais profundas exigem nova RFC e, quando aceitas, ADR.
