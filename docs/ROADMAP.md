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

- Constituicao para governar decisoes futuras.
- Kernel Services para centralizar regras e acesso a `.jzl`.
- Plugin System para remover integracoes especificas do nucleo.
- Template System para substituir inicializacao fixa por templates declarativos.
- Template Packs para tornar templates instalaveis e aplicaveis a Workspace ou Domain.
- Event Bus para separar publicacao de eventos e reacoes.
- Dogfooding para desenvolver o JZL usando o proprio JZL.
- Capability System para desacoplar Kernel de ferramentas especificas.
- ADRs para registrar decisoes arquiteturais aceitas.
- Workspace Manifest para definir a unidade maxima do JZL.
- Registry System para descoberta sem acoplamento.
- Lifecycle Model para estados explicitos.
- Domain Model para workspaces com multiplas areas funcionais.
- Workspace Runtime Split para separar definicao versionavel de runtime efemero.
- Host System para separar processos operadores de Agents operacionais.
- Ecosystem Model para separar Core de componentes externos.
- Distribution System para instalar plugins, templates, profiles, policies e packs.
- Installer System para instalar componentes a partir de sources locais e futuramente remotas.
- Compatibility Versioning para proteger Core e componentes.

Proximos passos previstos apos a definicao do Host System e do CLI Host:

1. Runtime Layout.
2. External Plugin Loading.
3. Template Packs.
4. Host Protocol v1.

Status: em planejamento via `docs/rfcs/`.

## Fase 2: Project Awareness

- Leitura declarativa da estrutura do workspace.
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
