# RFC-0012: Provider System

Status: draft, implementacao inicial  
Target: v0.2

## Objetivo

Adicionar uma camada explicita de Provider entre Capability e Plugin.

## Problema

Capability atualmente resolve direto para Plugin.

Isso acopla uma necessidade abstrata a um pacote concreto. O Kernel nao deve depender de plugins especificos, e tambem nao deve precisar saber qual pacote implementa uma capability.

## Solucao

Capability deve resolver para Provider.

Provider e a implementacao operacional de uma capability. Plugin e o pacote que registra providers, comandos e metadados.

Arquitetura:

```txt
Capability -> Provider -> Plugin
```

## Diferencas

### Capability

O que o sistema precisa.

Exemplo: `version-control`.

### Provider

Implementacao operacional daquela capability.

Exemplo: `git-provider`.

### Plugin

Pacote que registra providers, comandos e metadados.

Exemplo: `git plugin`.

## Exemplo Atual

```txt
version-control -> git-provider -> git plugin
```

O Kernel pede `version-control`. O resolver retorna `git-provider`. O provider aponta para o plugin Git.

## Futuro

Outro plugin pode fornecer a mesma capability:

```txt
version-control -> perforce-provider -> perforce plugin
```

Nesse caso, policies, profiles ou configuracao de Workspace/Domain devem decidir qual provider usar.

## Provider Minimo

```js
{
  name,
  plugin,
  capabilities,
  services
}
```

Campos:

- `name`: identificador do provider.
- `plugin`: plugin que registrou o provider.
- `capabilities`: capabilities fornecidas.
- `services`: operacoes oferecidas pelo provider.

## Regra

Kernel consome Provider, nunca Plugin diretamente.

Plugins registram providers. Capabilities resolvem para providers. Providers apontam para plugins.

## Impacto No Registry System

O Registry System passa a incluir Providers Registry.

Responsabilidades do Providers Registry:

- registrar providers;
- consultar provider por nome;
- listar providers;
- resolver provider por capability.

O Capabilities Registry continua listando capabilities declaradas, mas a resolucao operacional preferida passa pelo Providers Registry.

## Implementacao Inicial

Arquivos:

- `src/kernel/registries/providersRegistry.js`
- `src/kernel/providers.js`

Funcoes:

- `registerProvider(provider)`
- `getProvider(name)`
- `listProviders()`
- `resolveProviderByCapability(capabilityName)`

O plugin Git registra `git-provider`, que oferece `version-control`.

O Capability Resolver passa a resolver `version-control` para `git-provider`, mantendo fallback temporario para a resolucao antiga quando necessario.

Os comandos `jzl git status`, `jzl git link-task` e `jzl git current` usam `requireCapability("version-control")` e chamam os services do provider:

- `status()`
- `lastCommit()`
- `currentBranch()`
- `linkTask()`

## Fora De Escopo

Este RFC nao remove comandos Git.

Este RFC nao adiciona comandos.

Este RFC nao altera saida da CLI.
