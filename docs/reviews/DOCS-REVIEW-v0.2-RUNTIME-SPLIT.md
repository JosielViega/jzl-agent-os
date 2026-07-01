# Docs Review: v0.2 Runtime Split

Data: 2026-07-01  
Status: concluida

## Escopo

Revisao documental criada apos identificar que arquivos de runtime do proprio JZL Agent OS foram commitados junto com arquivos de definicao do Workspace.

Nao houve implementacao funcional. Nao foram adicionados comandos. Kernel nao foi alterado.

## Problema Descoberto

Ao usar o JZL dentro do repositorio `jzl-agent-os`, comandos como `jzl init`, `jzl session start` e `jzl install` geraram arquivos operacionais em `.jzl`.

Esses arquivos representam runtime local:

- sessoes;
- journals;
- eventos;
- mensagens;
- registros carregados;
- estado de agents.

Como a arquitetura ainda nao separava explicitamente definicao e runtime, esses arquivos puderam ser tratados como parte versionavel do projeto.

## Decisao

Foi criado `docs/rfcs/RFC-0018-WORKSPACE-RUNTIME.md`.

A decisao proposta e separar:

- Workspace Definition: persistente e versionavel;
- Workspace Runtime: local, efemero e nao versionavel por padrao.

## Ajustes Aplicados

- `docs/ARCHITECTURE.md` passou a documentar Definition e Runtime.
- `docs/GLOSSARY.md` recebeu os termos Workspace Definition e Workspace Runtime.
- `docs/DESIGN.md` recebeu o principio de separar definicao de runtime.
- `docs/ROADMAP.md` passou a citar Workspace Runtime Split na v0.2.
- `README.md` recebeu nota de arquitetura v0.2 sobre `.jzl` como runtime local.
- `CHANGELOG.md` registra a criacao do RFC-0018.
- `docs/reviews/DOCS-REVIEW-v0.2-ECOSYSTEM.md` recebeu o runtime split como proximo passo.

## Riscos

- Workspaces atuais ainda usam `.jzl/agents/<agent>/contract.md` como contrato operacional.
- Ignorar `.jzl/` inteiro hoje pode esconder arquivos que ainda sao necessarios para compatibilidade.
- Instalacoes precisam ser separadas entre declaracao versionavel e estado carregado.
- Migracao mal planejada pode quebrar comandos existentes.

## Proximos Passos

1. Definir `.gitignore` recomendado para repositorios que usam JZL.
2. Criar plano de migracao sem quebrar `.jzl/agents`.
3. Definir formato de `workspace/installed/manifest.json`.
4. Planejar `jzl migrate runtime-layout`.
5. Atualizar templates para gerar Definition em `workspace/` e Runtime em `.jzl/`.
