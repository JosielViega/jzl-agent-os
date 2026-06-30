# 02: Kernel

O Kernel e a parte mais protegida do JZL Agent OS.

Ele deve conhecer apenas conceitos genericos:

- Agent
- Task
- Message
- Dependency
- Journal
- Event
- Session
- Project
- Contract

## Responsabilidade

O Kernel valida invariantes, centraliza acesso ao estado e publica eventos.

Comandos e plugins devem usar Kernel Services em vez de manipular `.jzl` diretamente.

## Limite

O Kernel nao deve conhecer Git, Docker, Godot, Unity, NPM, Laravel, React ou qualquer tecnologia especifica.

Ferramentas concretas pertencem a plugins. Necessidades abstratas pertencem a capabilities.

