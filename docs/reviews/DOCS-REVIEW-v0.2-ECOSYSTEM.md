# Docs Review: v0.2 Ecosystem

Data: 2026-07-01  
Status: concluida

## Escopo

Sprint 2 documental para definir o Ecosystem Model do JZL Agent OS.

Nao houve implementacao funcional. Nao foram adicionados comandos. Kernel nao foi alterado.

## RFCs Criadas

- `docs/rfcs/RFC-0014-ECOSYSTEM-MODEL.md`
- `docs/rfcs/RFC-0015-DISTRIBUTION-SYSTEM.md`
- `docs/rfcs/RFC-0016-COMPATIBILITY-VERSIONING.md`

## Decisoes Arquiteturais

- Core e separado de Ecosystem.
- Core contem Kernel, CLI, Workspace, Registries, Event Bus, Capability Resolver e Distribution Registry.
- Ecosystem contem Plugins, Templates, Profiles, Policies e Packs.
- Componentes do ecossistema podem viver em repositorios proprios.
- Git deve futuramente sair do Core como `jzl-plugin-git`.
- Game deve futuramente sair do Core como `jzl-template-game`.
- Core deve permanecer pequeno e estavel.
- Distribution Registry sera responsavel por instalacao e descoberta de componentes.
- Componentes devem declarar compatibilidade por manifestos versionados.

## Documentos Atualizados

- `README.md`
- `VISION.md`
- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/GLOSSARY.md`
- `CHANGELOG.md`

## Proximos Passos

1. Distribution Registry.
2. Externalizar Git plugin.
3. Externalizar Game template.
4. Separar Workspace Definition de Workspace Runtime.

## Pendencias

- Definir manifestos finais de distribuicao.
- Definir formato local de instalacao.
- Definir validacao de `jzlCoreRange`.
- Definir como componentes externos serao carregados sem quebrar workspaces atuais.
- Definir estrategia de `.gitignore` para runtime local em `.jzl`.
