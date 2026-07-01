# Design

## Constituicao Primeiro

A Constituicao governa decisoes futuras. RFCs e ADRs devem respeitar seus artigos.

## Kernel Pequeno

O Kernel deve permanecer pequeno. Ele conhece conceitos genericos e regras essenciais. Tudo que depender de tecnologia especifica deve ser empurrado para plugins, templates ou policies.

## Plugins Extensiveis

Plugins ampliam o sistema sem inflar o Kernel. Eles devem declarar metadados, commands, events e capabilities.

## Registries Para Descoberta

Registries devem permitir que componentes encontrem services, plugins, capabilities, templates e profiles sem import direto ou acoplamento a nomes especificos.

## Capabilities Antes De Tecnologias

O sistema deve perguntar por capacidades abstratas antes de escolher ferramentas concretas.

Exemplos:

- `version-control` antes de Git.
- `container-runtime` antes de Docker.
- `game-engine` antes de Godot ou Unity.

## Comandos Sobre Edicao Manual

Agents devem alterar estado com comandos JZL. Edicao manual de `.jzl` deve ser excecao de manutencao, nao fluxo normal.

## Definition Separada De Runtime

Definicoes versionaveis do Workspace devem viver fora do runtime local. `.jzl` deve ser tratado como estado operacional efemero, enquanto `workspace/` deve concentrar contracts, policies, profiles, templates, domains e instalacoes declaradas.

## Eventos Como Fonte De Rastreabilidade

Eventos existem para explicar o que aconteceu, quando aconteceu e qual agent ou sistema iniciou a mudanca.

O Event Bus deve crescer sem esconder o `events.log` atual.

## Documentacao Como Parte Do Produto

JZL coordena agentes por contratos, workflows e decisoes. Documentacao nao e acabamento. E parte do runtime mental do projeto.

RFCs registram propostas. ADRs registram decisoes aceitas. Docs explicam como usar e evoluir o sistema.

## Lifecycle Explicito

Estados de Workspace, Agent, Plugin, Capability e Task devem ser documentados quando influenciarem decisao operacional.

## Domains Para Escala

Workspaces podem conter Domains. Domains ajudam a separar areas funcionais sem criar novos Kernels.
