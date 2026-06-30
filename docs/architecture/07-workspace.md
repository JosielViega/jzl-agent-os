# 07: Workspace

Workspace e a unidade maxima do JZL.

Ele representa o ambiente operacional onde Kernel, Runtime, Agents, Plugins, Events, Profiles, Policies e Projects coexistem.

Um Workspace pode conter varios projetos. Ele nao e apenas `.jzl` e nao e necessariamente um repositorio Git.

## Manifesto Futuro

O manifesto proposto para v0.2 e:

```txt
jzl.workspace.json
```

Campos minimos:

- `workspaceId`
- `name`
- `kernelVersion`
- `template`
- `profile`
- `createdAt`
- `manifestVersion`

O manifesto identifica o Workspace. A pasta `.jzl` continua guardando estado operacional interno.

## Estrutura

```txt
jzl.workspace.json
.jzl/
  project.md
  type.json
  events.log
  agents/
  dependencies/
  handoffs/
  policies/
  workflows/
```

## Regra

Agents nao editam `.jzl` manualmente. Eles usam comandos JZL.

Arquivos de projects dentro do Workspace pertencem ao trabalho normal da task. Arquivos dentro de `.jzl` pertencem ao runtime operacional.

Componentes devem localizar o Workspace procurando `jzl.workspace.json` e, durante a transicao, usar `.jzl` como fallback de compatibilidade.
