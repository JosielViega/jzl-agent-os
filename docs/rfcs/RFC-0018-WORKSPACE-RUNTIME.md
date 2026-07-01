# RFC-0018: Workspace Runtime

Status: proposta  
Data: 2026-07-01

## Contexto

Apos rodar `jzl init`, `jzl session start` e `jzl install` dentro do proprio repositorio `jzl-agent-os`, arquivos de runtime foram commitados junto com a definicao do projeto:

- `.jzl/agents/*/session.json`
- `.jzl/agents/*/journal.md`
- `.jzl/events.log`
- `.jzl/session.json`
- `.jzl/installed/*`
- `jzl.workspace.json`

Esse incidente mostrou que a estrutura atual mistura duas coisas diferentes:

- definicao versionavel do Workspace;
- estado efemero de runtime.

## Problema

O JZL precisa separar o que representa a definicao persistente do Workspace daquilo que representa atividade local de agentes.

Sem essa separacao:

- eventos locais podem virar historico versionado por acidente;
- sessoes de agents podem poluir commits;
- journals temporarios podem ser confundidos com documentacao permanente;
- instalacoes carregadas em runtime podem ser confundidas com declaracoes oficiais do Workspace;
- templates, contracts e policies ficam presos a `.jzl`, que deveria ser runtime local.

## Workspace Definition

Workspace Definition e o conjunto persistente e versionavel que descreve o Workspace.

Deve ir para Git quando fizer parte da definicao do projeto:

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

Campos e diretorios esperados:

- `jzl.workspace.json`: manifesto principal do Workspace.
- `workspace/contracts/`: contratos versionaveis.
- `workspace/policies/`: policies declarativas.
- `workspace/profiles/`: profiles operacionais versionaveis.
- `workspace/templates/`: templates locais ou referencias declaradas.
- `workspace/domains/`: definicoes de domains e projects.
- `workspace/installed/manifest.json`: instalacoes declaradas quando decidirmos que fazem parte da definicao.

## Workspace Runtime

Workspace Runtime e o estado local, efemero e operacional produzido pelos comandos JZL.

Nao deve ir para Git por padrao:

```txt
.jzl/session/
.jzl/inbox/
.jzl/outbox/
.jzl/journal/
.jzl/events.log
.jzl/cache/
.jzl/runtime/
.jzl/agents/*/session.json
.jzl/agents/*/journal.md
```

Runtime inclui:

- sessoes ativas;
- mensagens locais de inbox/outbox;
- journals operacionais;
- eventos locais;
- caches;
- estado carregado de plugins;
- estado transitorio de agents.

## Diretorio Recomendado Futuro

```txt
jzl.workspace.json
workspace/
  contracts/
  policies/
  profiles/
  templates/
  domains/
  installed/
.jzl/
  session/
  inbox/
  outbox/
  journal/
  events.log
  cache/
  runtime/
```

## Regras

- Workspace Definition e persistente e versionavel.
- Workspace Runtime e local e efemero.
- Comandos devem escrever runtime em `.jzl`.
- Templates, contracts e policies devem migrar para `workspace/`.
- `.jzl` nao deve ser tratado como definicao do projeto.
- Agents nao editam `.jzl` manualmente.
- Instalacoes precisam ser classificadas em duas camadas:
  - instalacao declarada em `workspace/installed`;
  - estado carregado no runtime.

## Estrategia Git

Recomendacao simples:

```gitignore
.jzl/
```

Alternativa granular, se for necessario versionar algum arquivo legado:

```gitignore
.jzl/events.log
.jzl/session/
.jzl/inbox/
.jzl/outbox/
.jzl/journal/
.jzl/cache/
.jzl/runtime/
.jzl/agents/*/session.json
.jzl/agents/*/journal.md
```

A decisao final de `.gitignore` deve considerar compatibilidade com workspaces existentes.

## Migracao Futura

A migracao deve:

- manter compatibilidade com a estrutura atual;
- nao quebrar workspaces existentes;
- mover definicoes versionaveis para `workspace/`;
- manter runtime operacional em `.jzl`;
- classificar instalacoes entre declaradas e carregadas;
- documentar um plano de rollback.

Comando futuro possivel:

```sh
jzl migrate runtime-layout
```

Esse comando ainda nao deve ser implementado nesta RFC.

## Fora De Escopo

- Alterar comandos atuais.
- Alterar o Kernel nesta etapa.
- Criar o comando `jzl migrate runtime-layout`.
- Remover compatibilidade com `.jzl/agents`.
- Alterar `.gitignore` automaticamente.

## Decisao Proposta

Adotar a separacao conceitual entre Workspace Definition e Workspace Runtime como regra arquitetural da v0.2.

Implementacoes futuras devem tratar `.jzl` como runtime local e `workspace/` como base versionavel de definicao.
