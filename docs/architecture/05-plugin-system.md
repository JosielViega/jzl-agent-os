# 05: Plugin System

Plugins adicionam capacidades sem inflar o Kernel.

Um plugin declara:

- name;
- version;
- commands;
- events;
- capabilities.

## Regra

Plugin pode conhecer ferramenta especifica. Kernel nao.

Exemplo: o plugin Git pode conhecer comandos Git. O Kernel deve conhecer apenas que existe uma capability de `version-control`.

## Estado Atual

A infraestrutura minima de registry existe para carregar plugins internos e consultar metadados.

Os comandos Git ainda nao foram movidos para plugin.

