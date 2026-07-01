# RFC-0015: Distribution System

Status: draft, instalacao local minima iniciada  
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

Distribution Registry nao instala sources diretamente. Ele registra componentes e manifestos. A escolha do mecanismo de instalacao pertence ao Installer Registry.

## Installer Registry

Installer Registry registra installers capazes de transformar uma source em manifest/componente.

Fluxo:

```txt
source -> installer -> manifest -> registry -> workspace
```

O primeiro installer planejado e `filesystem`, para instalacao local por caminho.

## Instalacao Local Por Caminho

Primeira forma implementada:

```txt
jzl install --source <local-path>
```

Exemplo:

```sh
jzl install --source ./plugins/jzl-plugin-git
jzl installed
```

Esta etapa registra plugins locais em `.jzl/installed/`, mas ainda nao copia codigo para o workspace.

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

Este RFC nao define fonte remota oficial.

## Implementacao Inicial

Comandos iniciais:

- `jzl install --source <path>`
- `jzl install --source <path> --force`
- `jzl installed`

Comportamento:

- usa Installer Registry para resolver o installer da source;
- usa Filesystem Installer para ler `jzl.plugin.json` ou `manifest.json`;
- valida `type: plugin`;
- registra manifest em `.jzl/installed/plugins/<name>/manifest.json`;
- salva source original no registro;
- atualiza `.jzl/installed/installed.json`;
- bloqueia duplicidade sem `--force`;
- nao copia codigo do plugin.
