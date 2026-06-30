# RFC-0003: Template System

Status: draft  
Target: v0.2

## Objetivo

Templates definem como um tipo de projeto nasce dentro do JZL Agent OS. Eles instalam agents, contracts, policies, workflows e recomendacoes de plugins.

Na v0.1, `jzl init --type game` cria uma estrutura fixa embutida no codigo. Na v0.2, essa estrutura deve ser movida para templates declarativos.

## O Que E Um Template

Um template e um pacote local que descreve o estado inicial de um projeto JZL.

Ele nao gera codigo da aplicacao. Ele gera organizacao operacional para agentes.

## Estrutura Proposta

```txt
templates/
  <template-name>/
    template.json
    agents/
    contracts/
    policies/
    workflows/
```

## template.json

```json
{
  "name": "game",
  "version": "0.2.0",
  "agents": ["diretor", "arquiteto", "programador", "revisor", "testador", "documentador"],
  "sectors": ["gameplay", "performance", "ui-game", "audio", "save-system", "level-design"],
  "recommendedPlugins": ["git"]
}
```

## Exemplos

- `game`: desenvolvimento de jogos generico.
- `kernel`: desenvolvimento do proprio JZL Agent OS.
- `godot-2d`: jogos 2D em Godot.
- `php-mysql`: aplicacoes PHP com MySQL.
- `react`: aplicacoes frontend React.

## Responsabilidades

Templates devem instalar:

- agents;
- contracts;
- policies;
- workflows;
- plugins recomendados;
- arquivos iniciais de documentacao operacional.

## Regra

Templates instalam agents, contracts, policies, workflows e plugins recomendados. Templates nao devem implementar logica de comandos e nao devem executar automacoes externas sem confirmacao explicita.

