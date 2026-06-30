# ADR-0003: Agents Do Not Edit JZL

Status: accepted

## Contexto

O JZL depende de estado consistente em arquivos. Se agents editarem `.jzl` manualmente, podem quebrar invariantes, esquecer eventos, ignorar dependencies ou corromper inbox/outbox.

## Decisao

Agentes, incluindo Codex, nao devem editar arquivos `.jzl` manualmente. Devem usar comandos JZL.

## Consequencias

- Toda mudanca operacional deve passar por comando.
- Eventos e journal continuam auditaveis.
- O Kernel pode proteger invariantes.
- Edicoes manuais ficam restritas a manutencao excepcional e consciente.

## Alternativas Consideradas

- Permitir edicao manual porque arquivos sao legiveis.
- Documentar formato e deixar agents escreverem JSON diretamente.

Essas alternativas foram rejeitadas porque removem as garantias operacionais do sistema.

