# RFC-0016: Compatibility And Versioning

Status: draft  
Target: v0.2

## Objetivo

Definir compatibilidade entre Core e componentes do ecossistema.

## Problema

Quando plugins, templates, profiles, policies e packs sairem do Core, cada componente podera evoluir em ritmo proprio.

Sem regras de compatibilidade, um componente pode exigir uma versao de Core, capability ou manifest que o workspace nao suporta.

## Campos Sugeridos

```json
{
  "jzlCoreRange": ">=0.2.0 <0.3.0",
  "componentVersion": "0.1.0",
  "manifestVersion": 1,
  "capabilities": ["version-control"],
  "provides": ["git-provider"]
}
```

### jzlCoreRange

Faixa de versoes do Core suportadas pelo componente.

### componentVersion

Versao semantica do componente.

### manifestVersion

Versao do schema do manifesto.

### capabilities

Capabilities oferecidas ou requeridas.

### provides

Providers, templates, profiles, policies ou packs oferecidos.

## Versionamento Semantico

Componentes devem usar versionamento semantico:

```txt
MAJOR.MINOR.PATCH
```

- MAJOR: breaking changes.
- MINOR: novas funcionalidades compativeis.
- PATCH: correcoes compativeis.

## Breaking Changes

Breaking changes incluem:

- remover capability;
- remover provider;
- mudar schema de manifesto sem compatibilidade;
- exigir versao maior do Core;
- alterar contrato de service;
- mudar comportamento esperado por template ou policy.

## Politica De Compatibilidade

O Core deve validar compatibilidade explicitamente antes de carregar componente.

Politica inicial sugerida:

- rejeitar componente com `jzlCoreRange` incompativel;
- rejeitar `manifestVersion` desconhecida quando nao houver migracao;
- avisar quando capability requerida nao estiver disponivel;
- preservar fallback para componentes internos durante migracoes.

## Requisitos Minimos

Templates e plugins declaram requisitos minimos por manifesto.

Exemplo plugin:

```json
{
  "name": "git",
  "type": "plugin",
  "jzlCoreRange": ">=0.2.0",
  "componentVersion": "0.1.0",
  "manifestVersion": 1,
  "provides": ["git-provider"],
  "capabilities": ["version-control"]
}
```

Exemplo template:

```json
{
  "name": "game",
  "type": "template",
  "jzlCoreRange": ">=0.2.0",
  "componentVersion": "0.1.0",
  "manifestVersion": 1,
  "capabilities": ["version-control"]
}
```

## Fora De Escopo

Este RFC nao implementa validacao de compatibilidade.

Este RFC nao define comando de update.

Este RFC nao define registry remoto.
