# RFC-0006: Capability System

Status: draft, resolver minimo iniciado  
Target: v0.2

## Problema

Plugins especificos nao devem acoplar o Kernel a tecnologias como Git, Docker, Godot, Unity, NPM, Laravel ou React.

Se o Kernel precisar conhecer nomes de ferramentas, ele deixa de ser generico. Isso cria dependencias rigidas e torna o nucleo mais dificil de manter, testar e evoluir.

## Conceito

O Kernel deve depender de capabilities, nao de plugins especificos.

Capability e uma capacidade operacional declarada por um provider. O Kernel e os agents podem pedir uma capacidade abstrata, e o resolver retorna um provider que implementa essa capability.

Exemplos:

- Git Provider fornece capability: `version-control`
- Docker Provider fornece capability: `container-runtime`
- Godot Provider fornece capability: `game-engine`
- NPM Provider fornece capability: `package-manager`

## Plugin vs Capability

Plugin e o pacote concreto.

Provider e a implementacao operacional da capability.

Capability e o contrato abstrato.

Um plugin pode registrar varios providers. Um provider pode fornecer varias capabilities. Uma capability pode ser fornecida por providers diferentes. Por exemplo, `version-control` pode ser fornecida por `git-provider` hoje e por `perforce-provider` no futuro.

## Agents Pedem Capabilities

Agents devem evitar pedir tecnologias especificas quando o objetivo e abstrato.

Exemplos:

- Preferir: "preciso vincular task ao controle de versao".
- Evitar: "preciso usar Git".

Isso permite que templates e projetos escolham a ferramenta concreta sem mudar o contrato do agent.

## Manifest

Estrutura sugerida:

```json
{
  "name": "git",
  "version": "0.1.0",
  "commands": ["git status", "git link-task", "git current"],
  "events": ["git.link-task"],
  "capabilities": ["version-control", "link-task-commit", "read-git-status"]
}
```

## Impacto Nos Registries

O Providers Registry deve resolver capability para provider disponivel.

O Capabilities Registry deve evoluir para:

- detectar conflito quando varios plugins oferecem a mesma capability;
- permitir templates recomendarem capabilities em vez de nomes fixos;
- permitir policies exigirem capabilities minimas.

O Plugins Registry continua responsavel por plugins descobertos, carregados, registrados e ativos. Providers apontam para plugins.

## Regra

O Kernel nao escolhe Git, Docker, Godot, Unity ou NPM. O Kernel pede capabilities. Providers implementam capabilities. Plugins registram providers.

## Implementacao Inicial

A camada inicial de resolver vive em `src/kernel/capabilities.js`.

Funcoes:

- `hasCapability(name)`
- `requireCapability(name)`
- `getCapabilityProvider(name)`
- `listAvailableCapabilities()`

O resolver usa Providers Registry e Capabilities Registry internamente. `requireCapability(name)` falha com erro claro quando a capability nao existe.

Depois de `loadPlugins()`, a capability `version-control` resolve para o provider `git-provider`.
