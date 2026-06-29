# Agents

Agents sao atores operacionais persistentes dentro de `.jzl/agents`.

## Agents De Funcao

- `diretor`: define escopo, prioridade e tarefas.
- `arquiteto`: define estrutura e decisoes tecnicas.
- `programador`: implementa codigo dentro do escopo.
- `revisor`: avalia qualidade e aderencia.
- `testador`: valida comportamento e bugs.
- `documentador`: registra decisoes, changelog e instrucoes.

## Agents De Setor Game

- `gameplay`
- `performance`
- `ui-game`
- `audio`
- `save-system`
- `level-design`

Setores tambem recebem inbox, outbox, contract e journal. Eles podem resolver dependencies enviadas por outros agentes.

## Contrato

Cada agent possui:

- objetivo;
- responsabilidades;
- permissoes;
- proibicoes;
- quando criar dependency;
- quando criar handoff;
- checklist de conclusao.
