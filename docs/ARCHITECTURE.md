# Architecture

JZL Agent OS e um kernel local baseado em arquivos. Ele nao usa banco de dados, servidor, IA interna ou API externa.

## Constituicao

A arquitetura do JZL e governada por `CONSTITUTION.md`.

RFCs propoem mudancas. ADRs registram decisoes aceitas. A Constituicao define os limites superiores: Kernel pequeno, tecnologias externas como plugins, capabilities antes de ferramentas, Workspace como unidade maxima, eventos para rastreabilidade e compatibilidade explicita.

## Workspace Definition E Runtime

A v0.2 separa conceitualmente Workspace Definition e Workspace Runtime.

Workspace Definition e persistente e versionavel. Ela deve migrar para:

```txt
jzl.workspace.json
workspace/
  contracts/
  policies/
  profiles/
  templates/
  domains/
  installed/
```

Workspace Runtime e local e efemero. Ele deve permanecer em `.jzl`:

```txt
.jzl/
  session/
  inbox/
  outbox/
  journal/
  events.log
  cache/
  runtime/
```

A estrutura atual de `.jzl/agents` continua existindo por compatibilidade, mas nao deve ser tratada como modelo final de definicao versionavel.

## Estrutura `.jzl` Atual

```txt
.jzl/
  project.md
  type.json
  events.log
  agents/
    <agent>/
      contract.md
      session.json
      inbox/
      outbox/
      journal.md
  dependencies/
  handoffs/
  policies/
  workflows/
```

## Componentes

- `project.md`: descricao humana do projeto JZL.
- `type.json`: tipo do projeto e agentes/setores conhecidos.
- `events.log`: log append-only em JSON Lines.
- `agents/<agent>/contract.md`: contrato textual do agente.
- `agents/<agent>/session.json`: estado operacional do agente, incluindo `currentTaskId`.
- `agents/<agent>/inbox/`: mensagens e tasks recebidas.
- `agents/<agent>/outbox/`: mensagens enviadas.
- `agents/<agent>/journal.md`: memoria operacional do agente.
- `dependencies/`: dependencias centrais, usadas para bloqueio de conclusao.
- `handoffs/`: reservado para registros agregados de handoff.
- `policies/`: reservado para regras futuras.
- `workflows/`: reservado para fluxos futuros.

## Kernel

O Kernel e a fronteira sagrada do JZL. Ele deve conhecer apenas conceitos genericos:

- Agent
- Task
- Message
- Dependency
- Journal
- Event
- Session
- Project
- Contract

Tecnologias especificas devem viver fora do Kernel, por plugins e capabilities.

## Core E Ecosystem

Core contem Kernel, CLI, Workspace, Registries, Event Bus, Capability Resolver e Distribution Registry.

Ecosystem contem Plugins, Templates, Profiles, Policies e Packs.

O Core deve ser pequeno e estavel. Componentes do ecossistema podem viver em repositorios proprios.

## Workspace

Workspace e a unidade maxima do JZL. Todo estado operacional pertence a um Workspace.

O manifesto futuro `jzl.workspace.json` identifica o Workspace. A pasta `.jzl` guarda estado operacional interno.

Um Workspace pode conter Domains e Projects.

## Hosts

Host e qualquer processo capaz de operar um Workspace atraves do Kernel.

Exemplos de Hosts incluem JZL CLI, Codex, Claude Code, Cursor, OpenHands, agentes proprios e futuros IDE plugins.

Host nao e Agent. O Host executa, conversa com usuario, inicia sessoes, chama Kernel Services, instala componentes e carrega plugins. O Agent representa um papel operacional, possui contrato, recebe tasks, gera handoffs e registra journal.

Hosts devem usar Kernel Services, Capability Resolver e Provider System. Eles nao devem editar `.jzl`, manifests ou runtime diretamente.

Multiplos Hosts podem compartilhar o mesmo Workspace. Runtime, events e journals sao compartilhados; sessions devem ser independentes.

## Registries

Registries permitem descoberta sem acoplamento direto.

Registries planejados:

- Services Registry
- Plugins Registry
- Distribution Registry
- Capabilities Registry
- Templates Registry
- Profiles Registry

A implementacao inicial vive em `src/kernel/registries` e usa memoria local do processo. Ela ainda nao altera comportamento da CLI.

## Lifecycle

Entidades centrais devem ter lifecycle explicito quando isso impactar decisao operacional.

Workspaces, Agents, Plugins, Capabilities e Tasks podem evoluir por estados documentados em RFC.

## Domains

Domain representa uma area funcional dentro de um Workspace, como gameplay, backend, website, admin ou billing.

Project e uma implementacao concreta dentro de um Domain.

## Compatibilidade

Componentes do ecossistema devem declarar compatibilidade com o Core por manifestos versionados.

Campos esperados incluem `jzlCoreRange`, `componentVersion`, `manifestVersion`, `capabilities` e `provides`.

## Tres Leis Do Kernel

Lei 1: Nenhuma funcionalidade nasce sem RFC.

Lei 2: Nenhuma RFC nasce sem problema real.

Lei 3: Kernel e sagrado.

## Modelo De Execucao

O usuario e o Codex interagem apenas por comandos `jzl`. Comandos escrevem runtime em `.jzl`. Definicoes versionaveis devem migrar para `workspace/`.

## Nucleo Sem IA

O JZL nao interpreta linguagem com modelo de IA. Checagens como `guard`, `preflight` e `next-step` sao deterministicas e baseadas no estado local.
