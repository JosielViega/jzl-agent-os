# Git Provider Migration Review

Data: 2026-06-30  
Status: aprovado

## Escopo

Revisao da migracao dos comandos `jzl git` para uso da capability `version-control` resolvida para `git-provider`.

## Verificacoes

### Comandos Git

Arquivo revisado: `src/commands/git.js`

Resultado:

- `jzl git status` chama `requireCapability("version-control")` indiretamente por `versionControlProvider()`.
- `jzl git link-task` chama `git-provider.services.linkTask()`.
- `jzl git current` manteve a leitura da task atual, sem acessar Git diretamente.
- `tryReadGitStatus()` usa `git-provider.services.status()`.
- Nao ha `spawnSync`, comandos Git diretos ou funcoes internas de Git em `src/commands/git.js`.

### Git Provider

Arquivos revisados:

- `src/plugins/git/index.js`
- `src/plugins/git/manifest.json`

Services implementados:

- `status()`
- `lastCommit()`
- `currentBranch()`
- `linkTask()`

Resultado:

- `git-provider` oferece `version-control`.
- `git-provider` aponta para o plugin `git`.
- A logica operacional Git vive no provider.
- `linkTask()` preserva registro em task, journal e events.log.

### Capability Resolver

Testes revisados em `test/cli.test.js`.

Resultado:

- `requireCapability("version-control")` retorna `git-provider`.
- `getCapabilityProvider("version-control")` retorna provider com plugin `git`.
- Capability inexistente continua falhando com erro claro: `Capability nao disponivel: <name>`.

### Documentacao

Arquivos revisados:

- `docs/rfcs/RFC-0012-PROVIDER-SYSTEM.md`
- `docs/COMMANDS.md`

Resultado:

- A arquitetura `Capability -> Provider -> Plugin` esta documentada.
- O exemplo `version-control -> git-provider -> git plugin` esta documentado.
- `docs/COMMANDS.md` explica que os comandos Git usam `version-control` via `git-provider`.

## Compatibilidade Externa

Saidas preservadas:

- `jzl git status` continua mostrando branch, modified, working tree e last commit.
- `jzl git link-task` continua mostrando task e commit.
- `jzl git current` continua mostrando task, title, commit e commit subject quando existir.
- Erro fora de repositorio Git continua: `Repositorio Git nao encontrado.`

Nenhum comando foi removido. Nenhum comando novo foi adicionado.

## Decisoes Mantidas

- Git continua como plugin passivo.
- Comandos `jzl git` continuam existindo.
- Kernel/commands dependem de `version-control`, nao do plugin Git diretamente.
- Provider e a camada operacional consumida pelo Kernel.
- Plugin e o pacote que registra providers e metadados.

## Riscos

- `versionControlProvider()` chama `loadPlugins()` sob demanda; no futuro pode ser substituido por bootstrap central do runtime.
- O fallback antigo do Capability Resolver ainda existe; deve ser removido apenas quando todos os usos estiverem em providers.
- `git-provider` ainda usa services locais simples; policies futuras podem precisar controlar quais services podem ser chamados por agent.

## Conclusao

A migracao esta coerente com o Provider System. Os comandos Git nao acessam mais logica Git diretamente e continuam com saida compativel.

