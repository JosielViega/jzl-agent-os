# Roadmap

## Fase 1: Kernel De Agentes

- Agents persistentes.
- Contracts.
- Inbox/outbox.
- Tasks.
- Dependencies.
- Journal.
- Guard.
- Preflight.
- History.
- Next-step.

Status: entregue em `v0.1.0`.

## v0.2: Arquitetura Antes De Codigo

Antes de adicionar novas funcionalidades, a v0.2 deve consolidar a arquitetura por RFCs.

- Kernel API para centralizar regras e acesso a `.jzl`.
- Plugin System para remover integracoes especificas do nucleo.
- Template System para substituir inicializacao fixa por templates declarativos.
- Event Bus para separar publicacao de eventos e reacoes.
- Dogfooding para desenvolver o JZL usando o proprio JZL.

Status: em planejamento via `docs/rfcs/`.

## Fase 2: Project Awareness

- Leitura declarativa da estrutura do projeto.
- Registro de stack, scripts, portas e comandos de verificacao.
- Mapa de areas do codigo.
- Associacao entre tasks e arquivos impactados.

## Fase 3: Knowledge Base

- Base local de decisoes.
- Notas tecnicas por area.
- Registro de bugs recorrentes.
- Consulta por comando sem IA interna.

## Fase 4: Policies

- Politicas por tipo de projeto.
- Regras de bloqueio configuraveis.
- Checklists customizados.
- Permissoes por agente e por setor.

## Fase 5: Templates

- Templates de agentes.
- Templates de contracts.
- Templates de workflows.
- Tipos de projeto alem de `game`.

## Fase 6: Integracao Com Ferramentas Externas

- Integracao opcional com Git.
- Integracao opcional com issue trackers.
- Integracao opcional com CI.
- Importacao/exportacao de estado.
