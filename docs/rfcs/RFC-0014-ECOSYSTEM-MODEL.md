# RFC-0014: Ecosystem Model

Status: draft  
Target: v0.2

## Objetivo

Definir a diferenca entre Core e Ecosystem no JZL Agent OS.

## Problema

O JZL comecou com tudo dentro do mesmo repositorio: Kernel, CLI, Git, template game, contracts e regras iniciais.

Isso foi util para validar o produto, mas nao deve ser o modelo permanente. Se tudo continuar no Core, o Kernel cresce demais e passa a conhecer tecnologias, templates e dominios especificos.

## Core

Core e o nucleo pequeno e estavel do JZL.

Core contem:

- Kernel
- CLI
- Workspace
- Registries
- Event Bus
- Capability Resolver
- Distribution Registry
- Installer Registry

O Core deve ser pequeno, previsivel e compativel.

## Ecosystem

Ecosystem contem componentes extensivos que podem evoluir fora do Core.

Ecosystem contem:

- Plugins
- Templates
- Profiles
- Policies
- Packs

Componentes do ecossistema podem viver em repositorios proprios.

## Regra De Separacao

Core define contratos universais.

Ecosystem implementa dominios, stacks, ferramentas e preferencias.

O Core nao deve crescer para acomodar toda nova tecnologia ou tipo de projeto.

## Git

Git esta hoje dentro do repositorio do Core por conveniencia historica.

Futuro desejado:

```txt
jzl-plugin-git
```

O plugin Git deve sair do Core e virar componente de ecossistema. O Core deve continuar sabendo apenas que existe uma capability `version-control` resolvida para um provider.

## Game

O template `game` esta hoje dentro do init do Core por conveniencia historica.

Futuro desejado:

```txt
jzl-template-game
```

O template game deve sair do Core e virar Template Pack de ecossistema.

## Componentes Em Repositorios Proprios

Componentes do ecossistema podem ser distribuidos como:

- repositorios Git;
- pacotes npm;
- caminhos locais;
- packs versionados.

Instalacao de componentes deve passar por Installer System. O Core pergunta ao Installer Registry qual installer suporta a source, em vez de conhecer GitHub, npm ou ZIP diretamente.

## Criterios

- Core nao deve depender de componente de ecossistema especifico.
- Core pode incluir componentes internos temporarios para compatibilidade.
- Componentes internos temporarios devem ter plano de externalizacao.
- Git e game sao candidatos principais para externalizacao.

## Fora De Escopo

Este RFC nao move Git para fora do Core.

Este RFC nao move game para fora do Core.

Este RFC nao implementa instalacao de componentes.
