# RFC-0002: Plugin System

Status: draft  
Target: v0.2

## Objetivo

Plugins permitem expandir o JZL Agent OS sem acoplar o Kernel a ferramentas especificas. Git, Docker, Godot, Unity, Laravel, React e outros dominios devem viver em plugins ou integracoes externas, nao no nucleo.

## O Que E Um Plugin

Um plugin e um pacote local que registra comandos, subscribers de eventos e capabilities. Ele pode ler informacoes externas e registrar estado no JZL por meio do Kernel API.

Plugins nao devem editar `.jzl` diretamente.

## Estrutura Proposta

```txt
plugins/
  <plugin-name>/
    manifest.json
    index.js
```

## Manifesto

```json
{
  "name": "git",
  "version": "0.1.0",
  "commands": ["git status", "git link-task", "git current"],
  "events": ["task.completed", "git.taskLinked"],
  "capabilities": ["read-git-status", "link-task-commit"]
}
```

Campos:

- `name`: identificador do plugin.
- `version`: versao do plugin.
- `commands`: comandos expostos pela CLI.
- `events`: eventos que o plugin publica ou assina.
- `capabilities`: capacidades declaradas para templates e policies.

## Exemplo: Plugin Git

O plugin Git poderia oferecer:

- `jzl git status`
- `jzl git link-task`
- `jzl git current`

Ele leria o repositorio Git local, mas nao faria commit, push ou alteracao automatica. Ao vincular uma task a um commit, chamaria o Kernel API para atualizar a task, adicionar journal e publicar `git.taskLinked`.

## Limites

- Plugin pode depender de ferramentas locais.
- Plugin deve falhar com erro claro quando ferramenta externa nao existir.
- Plugin nao deve alterar estado fora do seu contrato sem comando explicito.
- Plugin nao deve substituir regras do Kernel.

## Regra

Kernel nao deve conhecer Git, Docker, Godot, Unity, Laravel, React ou qualquer stack especifica. O Kernel conhece entidades JZL; plugins conhecem ferramentas externas.

