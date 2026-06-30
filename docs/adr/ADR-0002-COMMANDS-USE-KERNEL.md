# ADR-0002: Commands Use Kernel

Status: accepted

## Contexto

Na v0.1, comandos CLI manipulavam partes da estrutura `.jzl` diretamente. Isso funcionou para validar o conceito, mas espalha regra de dominio pela interface de comando.

## Decisao

Comandos CLI nao devem manipular diretamente a estrutura `.jzl`. Devem usar Kernel API.

## Consequencias

- CLI fica responsavel por parsear argumentos e formatar saida.
- Kernel fica responsavel por regras, validacoes, persistencia e eventos.
- Migracoes devem ser incrementais para preservar comportamento externo.

## Alternativas Consideradas

- Manter toda logica dentro dos comandos.
- Criar helpers soltos sem fronteira clara.

Essas alternativas foram rejeitadas porque dificultam testes e evolucao para plugins/templates.

