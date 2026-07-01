# Docs Review: v0.2 Host System

Data: 2026-07-01  
Status: concluida

## Escopo

Revisao documental para introduzir Host como conceito arquitetural separado de Agent.

Nao houve implementacao funcional. Nao foram adicionados comandos. Kernel nao foi alterado.

## Decisoes

- Host e qualquer processo capaz de operar um Workspace atraves do Kernel.
- Agent continua sendo um papel operacional com contrato, tasks, inbox, outbox e journal.
- Hosts devem usar Kernel Services, Capability Resolver e Provider System.
- Hosts nao devem editar `.jzl`, manifests ou runtime diretamente.
- Multiplos Hosts podem compartilhar um Workspace, com sessions independentes e runtime/events/journals compartilhados.
- Hosts devem declarar `hostName`, `hostVersion` e `supportedKernelRange`.
- Host Lifecycle inicial foi definido como `discovered`, `registered`, `connected`, `active`, `idle` e `disconnected`.

## Impactos

- A arquitetura deixa de assumir que a CLI e o unico operador do Workspace.
- O JZL pode evoluir para CLI Host, IDE Hosts, Codex Host, Claude Host, Daemon Host e Remote Host.
- O protocolo reforca que caminhos fisicos nao sao API publica.
- A separacao Host/Agent reduz confusao entre processo executor e papel operacional.

## Documentos Criados

- `docs/rfcs/RFC-0019-HOST-SYSTEM.md`
- `docs/specs/HOST-PROTOCOL.md`

## Documentos Atualizados

- `README.md`
- `VISION.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `CHANGELOG.md`

## Proximos Passos

1. Runtime Layout.
2. CLI Host.
3. External Plugin Loading.
4. Template Packs.
5. Host Protocol v1.
