# RFC-0019: Host System

Status: implementacao inicial  
Data: 2026-07-01

## Objetivo

Definir oficialmente o conceito de Host no JZL Agent OS e estabelecer o primeiro protocolo conceitual de comunicacao entre Hosts e o Workspace atraves do Kernel.

## O Que E Um Host

Host e qualquer processo capaz de operar um Workspace atraves do Kernel.

Exemplos:

- JZL CLI
- Codex
- Claude Code
- Cursor
- OpenHands
- agentes proprios
- futuros IDE plugins

Um Host executa comandos, conversa com usuario ou automacao, inicia sessoes, chama Kernel Services, instala componentes e carrega plugins.

## Host Nao E Agent

Host e o processo que opera o Workspace.

Agent e o papel operacional dentro do Workspace.

### Host

- executa;
- conversa com usuario;
- inicia sessoes;
- chama Kernel Services;
- instala componentes;
- carrega plugins.

### Agent

- representa um papel operacional;
- possui contrato;
- recebe tarefas;
- gera handoffs;
- registra journal;
- nunca controla o Workspace sozinho.

Um Host pode operar varios Agents ao longo do tempo. Um Agent pode ser acessado por diferentes Hosts, desde que o estado passe pelo Kernel.

## Como Um Host Inicia Uma Sessao

Fluxo conceitual:

```txt
Host
  |
  v
Workspace
  |
  v
Kernel
  |
  v
Boot Agent
  |
  v
Session
  |
  v
Task
```

O Host descobre o Workspace, chama o Kernel, inicializa ou retoma um Agent, recebe uma Session e entao consulta ou assume uma Task.

Host nunca modifica arquivos diretamente. Toda alteracao passa pelo Kernel.

## Comunicacao Host Para Kernel

Hosts devem usar somente:

- Kernel Services;
- Capability Resolver;
- Provider System.

Hosts nunca devem:

- editar `.jzl` manualmente;
- editar manifests diretamente;
- alterar runtime sem Service;
- assumir que o layout fisico atual e contrato publico.

O contrato publico entre Host e Workspace deve ser o protocolo, nao o caminho de arquivo.

## Multiplos Hosts

Varios Hosts podem compartilhar o mesmo Workspace.

Exemplo:

```txt
Codex
      \
Claude
       > mesmo Workspace
Cursor
      /
```

Regras:

- runtime e compartilhado;
- events sao compartilhados;
- journals sao compartilhados;
- sessions sao independentes;
- alteracoes relevantes publicam Event;
- conflitos devem ser tratados pelo Kernel, nao por edicao manual.

## Compatibilidade

Um Host deve declarar:

- `hostName`
- `hostVersion`
- `supportedKernelRange`

Exemplo futuro:

```json
{
  "hostName": "jzl-cli",
  "hostVersion": "0.2.0",
  "supportedKernelRange": ">=0.2.0 <0.3.0"
}
```

O Workspace pode validar compatibilidade antes de permitir operacoes sensiveis.

## Host Lifecycle

Estados sugeridos:

- `discovered`
- `registered`
- `connected`
- `active`
- `idle`
- `disconnected`

### discovered

O Workspace detectou a existencia ou declaracao do Host.

### registered

O Host declarou nome, versao e compatibilidade.

### connected

O Host abriu comunicacao operacional com o Kernel.

### active

O Host esta executando operacoes no Workspace.

### idle

O Host esta conectado, mas sem operacao ativa.

### disconnected

O Host encerrou comunicacao ou deixou de responder.

## Futuro

Hosts possiveis:

- CLI Host
- VSCode Host
- Cursor Host
- Codex Host
- Claude Host
- Daemon Host
- Remote Host

O Host System prepara o JZL para operar alem da CLI sem transformar o Kernel em integracao especifica de ferramenta.

## Relacao Com Host Protocol

Esta RFC define o conceito e as decisoes arquiteturais.

A especificacao operacional inicial vive em `docs/specs/HOST-PROTOCOL.md`.

## Implementacao Inicial

A Sprint 2 implementou:

- Host Registry no Kernel em `src/kernel/registries/hostsRegistry.js`;
- Host System em `src/hosts/`;
- CLI Host em `src/hosts/cli/`;
- registro automatico e silencioso do CLI Host durante a inicializacao da CLI;
- exports `registerHost`, `getHost` e `listHosts` pelo Kernel.

A implementacao nao altera a saida externa da CLI.

## Fora De Escopo

- Alterar comandos existentes.
- Alterar o Kernel.
- Criar protocolo de rede.
- Criar daemon.
- Criar integracoes com IDEs.
- Adicionar suporte oficial a Hosts externos nesta etapa.

## Decisao Proposta

Adotar Host como entidade arquitetural separada de Agent.

Hosts operam Workspaces atraves do Kernel. Agents continuam sendo papeis operacionais com contrato, task, inbox, outbox e journal.
