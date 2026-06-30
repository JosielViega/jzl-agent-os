# RFC-0011: Domain Model

Status: draft  
Target: v0.2

## Objetivo

Definir Domain como area funcional dentro de um Workspace.

Domains ajudam o JZL a coordenar workspaces que possuem mais de um projeto, stack ou area de responsabilidade.

## Conceito

Workspace pode conter Domains.

Domain representa uma area funcional:

- gameplay;
- backend;
- launcher;
- website;
- admin;
- billing;
- documentation;
- infrastructure.

Project e uma implementacao concreta dentro de um Domain.

## Workspace, Domain E Project

Workspace e a unidade maxima.

Domain e uma area funcional do Workspace.

Project e uma implementacao concreta dentro de um Domain.

Exemplo:

```txt
Workspace: jzl-game-suite
  Domain: gameplay
    Project: game-client
  Domain: backend
    Project: game-api
  Domain: website
    Project: marketing-site
```

## Templates Por Domain

Templates podem ser aplicados por Domain, nao apenas por Workspace.

Exemplos:

- Domain `gameplay` usa template `godot-2d`.
- Domain `backend` usa template `php-mysql`.
- Domain `website` usa template `react`.

Isso permite que um Workspace combine areas diferentes sem forcar um unico template global.

## Plugins E Capabilities

Plugins e capabilities podem ser usados por multiplos Domains.

Exemplos:

- `version-control` pode servir todos os Domains.
- `container-runtime` pode servir backend e infrastructure.
- `game-engine` pode servir gameplay.
- `package-manager` pode servir website e launcher.

## Agents E Domains

Agents podem ser globais ou vinculados a Domain.

Exemplos:

- `kernel-architect` pode ser global.
- `gameplay` pode ser Domain agent.
- `backend-engineer` pode atuar apenas no Domain backend.

## Regras

- Workspace pode conter varios Domains.
- Domain nao substitui Agent.
- Domain nao substitui Project.
- Project pertence a um Domain ou ao Workspace quando nao houver Domain definido.
- Templates podem ser aplicados no nivel Workspace ou Domain.
- Capabilities devem poder ser resolvidas por Workspace e filtradas por Domain.

## Fora De Escopo

Este RFC nao implementa Domains.

Este RFC nao altera `jzl init`.

Este RFC nao adiciona comandos.

