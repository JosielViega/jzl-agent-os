# RFC-0010: Lifecycle Model

Status: draft  
Target: v0.2

## Objetivo

Definir ciclos de vida para entidades centrais do JZL Agent OS.

Lifecycle explicito ajuda agents, Kernel Services, plugins e templates a entenderem estado, transicoes e bloqueios.

## Workspace

Estados sugeridos:

- `created`: manifesto ou estrutura inicial criada.
- `initialized`: `.jzl` e estrutura operacional presentes.
- `configured`: template, profile, plugins e policies definidos.
- `running`: workspace em uso ativo.
- `paused`: workspace temporariamente sem execucao.
- `archived`: workspace preservado, mas nao ativo.

## Agent

Estados sugeridos:

- `installed`: agent existe no workspace.
- `booted`: agent foi iniciado por `boot`.
- `active`: agent possui atividade atual.
- `idle`: agent sem task atual ou bloqueio.
- `blocked`: agent impedido por dependency, policy ou contrato.
- `completed`: agent concluiu seu trabalho atual.

## Plugin

Estados sugeridos:

- `discovered`: plugin encontrado.
- `loaded`: plugin importado/carregado.
- `registered`: manifest registrado.
- `active`: plugin disponivel para uso.
- `disabled`: plugin desativado.

## Capability

Estados sugeridos:

- `declared`: capability declarada por plugin, template ou policy.
- `resolved`: provider encontrado.
- `provided`: plugin fornece capability.
- `consumed`: agent, command, template ou workflow usou capability.

## Task

Estados sugeridos:

- `pending`: task criada, ainda nao assumida.
- `current`: task assumida pelo agent.
- `blocked`: task impedida por dependency, policy ou falta de capability.
- `completed`: task concluida.
- `archived`: task preservada apenas para historico.

## Regras

- Estados devem ser explicitos quando impactarem decisao operacional.
- Transicoes relevantes devem publicar Event.
- States nao devem substituir Events; states resumem situacao atual, Events registram historico.
- Lifecycle deve ser evoluido por RFC quando impactar comportamento.

## Fora De Escopo

Este RFC nao altera os estados atuais implementados.

Este RFC nao adiciona comandos.

Este RFC nao implementa migracoes.

