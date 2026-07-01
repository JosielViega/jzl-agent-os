# RFC-0017: Installer System

Status: draft  
Target: v0.2

## Objetivo

Definir o Installer System como camada responsavel por instalar componentes do ecossistema a partir de diferentes sources.

## Problema

O Distribution System define componentes instalaveis e o Distribution Registry registra componentes disponiveis ou instalados.

Ainda falta uma camada para responder:

- como instalar de um caminho local;
- como instalar futuramente de GitHub;
- como instalar futuramente de npm;
- como instalar futuramente de ZIP/URL;
- como o Core escolhe o mecanismo correto sem conhecer cada tecnologia.

## Installer

Installer e um componente responsavel por transformar uma source em um componente instalavel.

Exemplo:

```txt
filesystem installer
```

Ele sabe ler um caminho local, localizar manifesto, validar estrutura basica e entregar metadados ao Distribution Registry.

## Installer Registry

Installer Registry registra installers disponiveis.

Responsabilidades:

- registrar installers;
- consultar installers;
- descobrir qual installer suporta uma source;
- delegar instalacao para o installer correto;
- evitar que o Core conheca diretamente GitHub, npm, ZIP ou URL.

## Component Source

Component Source e a origem de um componente.

Exemplos:

- caminho local;
- repositorio GitHub;
- pacote npm;
- arquivo ZIP;
- URL remota.

## Filesystem Installer

Primeiro installer oficial:

```txt
filesystem
```

Responsabilidade:

- instalar componente a partir de caminho local;
- localizar manifesto de distribuicao;
- validar tipo basico;
- entregar manifest ao Distribution Registry;
- copiar ou referenciar componente conforme politica futura.

Objetivo futuro:

```sh
jzl install plugin ./jzl-plugin-git
```

## GitHub Installer Futuro

Installer futuro para sources GitHub.

Exemplo conceitual:

```sh
jzl install plugin github:owner/jzl-plugin-git
```

O Core nao deve implementar detalhes GitHub diretamente.

## NPM Installer Futuro

Installer futuro para pacotes npm.

Exemplo conceitual:

```sh
jzl install plugin npm:jzl-plugin-git
```

O Core nao deve implementar detalhes npm diretamente.

## ZIP/URL Installer Futuro

Installer futuro para arquivos ZIP ou URLs remotas.

Exemplo conceitual:

```sh
jzl install pack https://example.com/jzl-pack.zip
```

O Core nao deve implementar download, extracao ou validacao remota diretamente.

## Distribution Registry vs Installer Registry

Distribution Registry registra componentes disponiveis ou instalados.

Installer Registry registra mecanismos capazes de instalar componentes a partir de sources.

Em resumo:

- Installer Registry responde: "quem sabe instalar esta source?"
- Distribution Registry responde: "quais componentes existem ou foram instalados?"

## Fluxo

```txt
source -> installer -> manifest -> registry -> workspace
```

Passos:

1. Usuario informa uma source.
2. Core pergunta ao Installer Registry qual installer suporta a source.
3. Installer processa a source.
4. Installer retorna manifest.
5. Distribution Registry registra o componente.
6. Workspace passa a poder usar o componente.

## Regra

Core nao sabe instalar GitHub, npm ou ZIP diretamente.

Core pergunta ao Installer Registry qual installer suporta a source.

## Primeiro Installer Oficial

O primeiro installer oficial deve ser:

```txt
filesystem
```

Ele habilita a instalacao local de componentes durante o desenvolvimento do ecossistema.

## Objetivo Futuro

Permitir instalar `jzl-plugin-git` de um caminho local.

Exemplo conceitual:

```sh
jzl install plugin ./jzl-plugin-git
```

## Fora De Escopo

Este RFC nao implementa installers.

Este RFC nao adiciona comandos.

Este RFC nao define download remoto.

