# ADR-0001: Kernel Is Sacred

Status: accepted

## Contexto

O JZL Agent OS precisa crescer sem transformar o Kernel em uma colecao de excecoes para tecnologias especificas.

Se o Kernel conhecer Git, Docker, Godot, Unity ou frameworks diretamente, ele perde sua funcao principal: coordenar agentes por conceitos genericos.

## Decisao

O Kernel deve conhecer apenas conceitos genericos:

- Agent
- Task
- Message
- Dependency
- Journal
- Event
- Session
- Project
- Contract

## Consequencias

- Integracoes especificas devem viver em plugins.
- Templates podem recomendar plugins, mas nao devem alterar o nucleo.
- Novas features devem provar que pertencem ao Kernel antes de entrar nele.

## Alternativas Consideradas

- Colocar integracoes diretamente no Kernel para acelerar desenvolvimento.
- Manter comandos especificos acoplados ao armazenamento.

Essas alternativas foram rejeitadas porque aumentam acoplamento e reduzem portabilidade.

