# Architecture

JZL Agent OS e um kernel local baseado em arquivos. Ele nao usa banco de dados, servidor, IA interna ou API externa.

## Estrutura `.jzl`

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

## Tres Leis Do Kernel

Lei 1: Nenhuma funcionalidade nasce sem RFC.

Lei 2: Nenhuma RFC nasce sem problema real.

Lei 3: Kernel e sagrado.

## Modelo De Execucao

O usuario e o Codex interagem apenas por comandos `jzl`. Os comandos leem e escrevem arquivos dentro de `.jzl`, mantendo o estado auditavel e portavel.

## Nucleo Sem IA

O JZL nao interpreta linguagem com modelo de IA. Checagens como `guard`, `preflight` e `next-step` sao deterministicas e baseadas no estado local.
