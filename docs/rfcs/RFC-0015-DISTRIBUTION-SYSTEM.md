# RFC-0015: Distribution System

Status: draft  
Target: v0.2

## Objetivo

Definir como componentes do ecossistema serao instalados e descobertos.

## Componentes Distribuiveis

Tipos de componentes:

- `plugin`
- `template`
- `profile`
- `policy`
- `pack`

## Distribution Registry

Distribution Registry e o registro de componentes instalaveis ou instalados.

Responsabilidades:

- descobrir componentes disponiveis;
- registrar componentes instalados;
- validar manifestos;
- expor metadados para registries internos;
- indicar origem do componente;
- permitir instalacao local inicialmente;
- preparar instalacao futura via GitHub ou npm.

## Instalacao Local Por Caminho

Primeira forma planejada:

```txt
jzl install <component-type> <local-path>
```

Exemplo conceitual:

```sh
jzl install plugin ./plugins/git
jzl install template ./templates/game
```

Este RFC nao implementa esses comandos.

## Instalacao Futura

Fontes futuras:

- GitHub;
- npm;
- registries privados;
- packs versionados.

Exemplos futuros possiveis:

```sh
jzl install plugin git
jzl install template game
jzl list installed
```

## Manifesto De Distribuicao

Manifesto sugerido:

```json
{
  "name": "git",
  "type": "plugin",
  "componentVersion": "0.1.0",
  "manifestVersion": 1,
  "jzlCoreRange": ">=0.2.0",
  "provides": ["git-provider"],
  "capabilities": ["version-control"]
}
```

Campos:

- `name`: nome do componente.
- `type`: plugin, template, profile, policy ou pack.
- `componentVersion`: versao do componente.
- `manifestVersion`: versao do schema do manifesto.
- `jzlCoreRange`: faixa de compatibilidade com o Core.
- `provides`: providers, templates, profiles ou policies oferecidos.
- `capabilities`: capabilities oferecidas ou requeridas.

## Relacao Com Registries

Distribution Registry nao substitui os registries internos.

Ele descobre e instala componentes. Depois da instalacao:

- Plugins Registry registra plugins.
- Providers Registry registra providers.
- Capabilities Registry registra capabilities.
- Templates Registry registra templates.
- Profiles Registry registra profiles.

## Fora De Escopo

Este RFC nao adiciona comandos.

Este RFC nao implementa instalacao.

Este RFC nao define fonte remota oficial.

