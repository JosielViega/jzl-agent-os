# RFC-0009: Registry System

Status: draft  
Target: v0.2

## Objetivo

Definir um sistema de registries para reduzir acoplamento entre Kernel, plugins, capabilities, templates e profiles.

## Problema Resolvido

Sem registries claros, componentes precisam conhecer uns aos outros diretamente.

Isso cria acoplamento:

- comandos conhecem plugins especificos;
- Kernel conhece tecnologias externas;
- templates precisam saber detalhes de implementacao;
- profiles nao conseguem selecionar capabilities de forma declarativa;
- plugins nao tem lugar formal para declarar o que oferecem.

Registries resolvem isso criando pontos formais de descoberta.

## Registries Propostos

### Services Registry

Registra Kernel Services disponiveis.

Responsabilidades:

- expor operacoes centrais do Kernel;
- permitir que comandos e plugins encontrem servicos sem acessar arquivos diretamente;
- manter fronteira entre interface tecnica e implementacao.

### Plugins Registry

Registra plugins descobertos, carregados e ativos.

Responsabilidades:

- listar plugins;
- consultar plugin por nome;
- controlar lifecycle de plugin;
- expor metadados do manifest.

### Capabilities Registry

Registra capabilities declaradas e provedores disponiveis.

Responsabilidades:

- mapear capability para plugin;
- resolver conflitos;
- indicar capability nao atendida;
- permitir que agents e templates solicitem capacidades abstratas.

### Templates Registry

Registra templates disponiveis.

Responsabilidades:

- listar templates;
- carregar metadados;
- indicar agents, contracts, policies, workflows e plugins recomendados;
- permitir aplicacao por Workspace ou Domain.

### Profiles Registry

Registra profiles operacionais.

Responsabilidades:

- listar profiles;
- carregar configuracoes;
- definir defaults por Workspace ou Domain;
- selecionar policies, templates e capabilities preferidas.

## O Que O Kernel Pode Registrar

O Kernel pode registrar:

- Kernel Services;
- entidades universais;
- eventos;
- schemas internos;
- registries base;
- capabilities requeridas pelo nucleo, se existirem.

O Kernel nao deve registrar tecnologia externa como dependencia direta.

## O Que Plugins Podem Registrar

Plugins podem registrar:

- comandos;
- subscribers de eventos;
- capabilities fornecidas;
- adapters;
- validators;
- metadados de ferramenta externa.

Plugins nao devem registrar novos conceitos universais no Kernel sem RFC.

## Como Registries Evitam Acoplamento

Registries permitem descoberta por contrato, nao por import direto.

Exemplo:

- Um template pede `version-control`.
- O Capabilities Registry resolve que o plugin Git fornece essa capability.
- O comando ou workflow usa a capability, sem acoplar o Kernel ao Git.

## Regras

- Registries nao devem ser atalhos para inflar o Kernel.
- Registries devem guardar metadados e referencias, nao regras complexas de dominio.
- Resolucao por capability deve ser preferida a nomes fixos de plugins.
- Plugins devem se registrar por manifest.

## Fora De Escopo

Este RFC nao implementa registries.

Este RFC nao altera o plugin registry minimo existente.

Este RFC nao adiciona comandos.
