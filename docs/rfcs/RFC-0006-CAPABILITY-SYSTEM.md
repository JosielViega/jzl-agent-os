# RFC-0006: Capability System

Status: draft  
Target: v0.2

## Problema

Plugins especificos nao devem acoplar o Kernel a tecnologias como Git, Docker, Godot, Unity, NPM, Laravel ou React.

Se o Kernel precisar conhecer nomes de ferramentas, ele deixa de ser generico. Isso cria dependencias rigidas e torna o nucleo mais dificil de manter, testar e evoluir.

## Conceito

O Kernel deve depender de capabilities, nao de plugins especificos.

Capability e uma capacidade operacional declarada por um plugin. O Kernel e os agents podem pedir uma capacidade abstrata, e o Plugin Registry resolve qual plugin fornece essa capacidade.

Exemplos:

- Git Plugin fornece capability: `version-control`
- Docker Plugin fornece capability: `container-runtime`
- Godot Plugin fornece capability: `game-engine`
- NPM Plugin fornece capability: `package-manager`

## Plugin vs Capability

Plugin e a implementacao concreta.

Capability e o contrato abstrato.

Um plugin pode fornecer varias capabilities. Uma capability pode ser fornecida por plugins diferentes. Por exemplo, `version-control` pode ser fornecida por Git hoje e por outro sistema no futuro.

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

## Impacto No Plugin Registry

O Plugin Registry deve evoluir para:

- listar plugins por capability;
- resolver capability para plugin disponivel;
- detectar conflito quando varios plugins oferecem a mesma capability;
- permitir templates recomendarem capabilities em vez de nomes fixos;
- permitir policies exigirem capabilities minimas.

## Regra

O Kernel nao escolhe Git, Docker, Godot, Unity ou NPM. O Kernel pede capabilities. Plugins implementam capabilities.

