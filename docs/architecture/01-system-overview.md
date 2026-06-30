# 01: System Overview

JZL Agent OS e um sistema operacional local, exposto por CLI, para coordenar agents em um workspace.

O sistema tem quatro camadas conceituais:

- Workspace: unidade maxima onde Kernel, Runtime, Agents, Plugins, Domains e Projects coexistem.
- Kernel: regras e operacoes centrais.
- Runtime: execucao local dos comandos e estado atual.
- Extensoes: templates, plugins, capabilities e policies.

O estado operacional fica em `.jzl`. A CLI e a interface humana e dos agents. O Kernel protege as regras. Plugins adicionam capacidades sem acoplar ferramentas ao nucleo.

## Objetivo

Dar aos agents uma forma comum de responder:

- quem sou;
- o que posso fazer;
- o que devo fazer agora;
- o que esta bloqueado;
- para quem devo enviar o trabalho;
- o que ja aconteceu.
