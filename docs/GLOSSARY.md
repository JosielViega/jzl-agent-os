# Glossary

## Agent

Unidade operacional persistente que possui contrato, sessao, inbox, outbox e journal.

## Kernel

Nucleo do JZL. Conhece apenas conceitos genericos e protege invariantes do sistema.

## Runtime

Ambiente operacional em que comandos, agents, estado local, eventos e plugins interagem.

## Constitution

Documento superior que governa decisoes futuras do JZL Agent OS.

## Workspace

Unidade maxima do JZL. Representa o ambiente operacional onde Kernel, Runtime, Agents, Plugins, Events, Profiles, Policies e Projects coexistem. O futuro manifesto do Workspace sera `jzl.workspace.json`.

## Project

Entidade logica dentro de um Workspace. Um Workspace pode conter varios Projects.

## Domain

Area funcional dentro de um Workspace, como gameplay, backend, launcher, website, admin ou billing. Um Domain pode conter Projects.

## Role

Nome de argumento mantido nos comandos atuais por compatibilidade. O conceito arquitetural equivalente e Agent.

## Plugin

Extensao que fornece comandos, eventos ou capabilities sem acoplar o Kernel a uma tecnologia especifica.

## Capability

Capacidade abstrata oferecida por um plugin, como `version-control`, `container-runtime` ou `package-manager`.

## Template

Pacote que define agents, contracts, policies, workflows e plugins recomendados para um tipo de projeto.

## Profile

Configuracao operacional que ajusta comportamento, defaults ou preferencias para um contexto.

## Registry

Componente de descoberta que registra services, plugins, capabilities, templates ou profiles sem acoplamento direto entre partes do sistema.

## Contract

Documento que define objetivo, responsabilidades, permissoes, proibicoes e checklist de um agent.

## Policy

Regra configuravel que orienta ou bloqueia acoes.

## Event

Registro de algo que aconteceu no sistema.

## Event Bus

Camada que publica eventos e notifica subscribers.

## Event Store

Armazenamento persistente de eventos. Hoje e representado por `events.log`.

## Inbox

Caixa de entrada de mensagens, tasks, dependencies e handoffs recebidos por um agent.

## Outbox

Caixa de saida de mensagens e handoffs enviados por um agent.

## Journal

Memoria operacional do agent. Registra progresso, decisoes e continuidade.

## Task

Unidade de trabalho atribuida a um agent.

## Dependency

Bloqueio vinculado a uma task quando o agent depende de outro setor, agent ou capability.

## Handoff

Passagem de trabalho para outro agent.

## Preflight

Checagem antes de concluir uma task.

## Guard

Checagem de uma acao pretendida contra o contrato do agent.
