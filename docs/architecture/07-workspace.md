# 07: Workspace

Workspace e o diretorio onde o JZL foi inicializado.

Ele contem o projeto real e a pasta `.jzl` com o estado operacional.

## Estrutura

```txt
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

Arquivos do projeto fora de `.jzl` pertencem ao trabalho normal da task. Arquivos dentro de `.jzl` pertencem ao runtime operacional.

