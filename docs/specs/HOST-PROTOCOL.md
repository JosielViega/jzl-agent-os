# Host Protocol

Status: especificacao inicial  
Data: 2026-07-01

Este documento nao e uma RFC. Ele descreve a nomenclatura e o fluxo operacional esperado para comunicacao entre Hosts e o JZL Agent OS.

## Conceitos

### Host

Processo que opera um Workspace atraves do Kernel.

Exemplos: JZL CLI, Codex, Claude Code, Cursor, OpenHands, IDE plugins e agentes proprios.

### Workspace

Unidade maxima do JZL. Contem definicao versionavel, runtime local, agents, plugins, providers, capabilities, events e tasks.

### Kernel

Camada que protege as regras do Workspace e oferece Services para leitura e escrita de estado.

### Agent

Papel operacional com contrato, session, inbox, outbox, journal e tasks.

### Session

Estado operacional que liga um Host a um Agent em um Workspace.

## Responsabilidades

### Host

- descobrir o Workspace;
- declarar compatibilidade;
- chamar Kernel Services;
- iniciar ou retomar sessions;
- apresentar estado ao usuario ou automacao;
- nunca editar runtime ou manifests diretamente.

### Kernel

- validar operacoes;
- ler e escrever runtime;
- publicar events;
- resolver capabilities;
- conectar providers;
- preservar compatibilidade.

### Agent

- seguir contrato;
- receber tasks e mensagens;
- registrar journal;
- criar dependencies ou handoffs quando necessario;
- passar por preflight antes de concluir tasks.

## Nomenclatura

- Use Host para o processo executor.
- Use Agent para o papel operacional.
- Use Workspace para a unidade maxima.
- Use Kernel Services para operacoes oficiais.
- Use Runtime para estado local efemero.
- Use Definition para estado versionavel.

## Fluxo De Comunicacao

```txt
Host
  |
  | discover workspace
  v
Workspace
  |
  | open kernel
  v
Kernel
  |
  | boot agent
  v
Agent Session
  |
  | read inbox / current task / dependencies
  v
Operational State
```

Fluxo de escrita:

```txt
Host intent
  |
  v
Kernel Service
  |
  v
Runtime mutation
  |
  v
Event
```

## Regras

- Host nao edita `.jzl` manualmente.
- Host nao edita `jzl.workspace.json` diretamente.
- Host nao grava runtime sem Kernel Service.
- Host nao depende de caminhos internos como contrato publico.
- Toda alteracao relevante gera Event.
- Sessions de Hosts diferentes devem ser independentes.
- Runtime, events e journals podem ser compartilhados pelo Workspace.

## Compatibilidade Do Host

Campos minimos esperados:

```json
{
  "name": "cli",
  "type": "host",
  "version": "0.1.0",
  "supportedKernelRange": ">=0.2.0"
}
```

O Workspace podera recusar operacoes quando o Host nao declarar compatibilidade suficiente.

## CLI Host

O primeiro Host oficial e `cli`.

Ele e registrado automaticamente durante a inicializacao da CLI, sem alterar a saida dos comandos.

## Versao Do Protocolo

Esta especificacao representa o rascunho do futuro Host Protocol v1.

Versoes futuras devem definir:

- formato de registro de Host;
- handshake;
- tratamento de conflito;
- concorrencia entre Hosts;
- isolamento de sessions;
- operacao remota.
