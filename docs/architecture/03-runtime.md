# 03: Runtime

Runtime e o ambiente operacional do JZL enquanto comandos sao executados.

Ele inclui:

- workspace atual;
- sessao ativa;
- agent atual;
- arquivos `.jzl`;
- comandos CLI;
- Kernel Services;
- plugins carregados;
- eventos publicados.

## Sessao

A sessao define qual agent esta ativo. Comandos como `whoami`, `inbox`, `task current` e `preflight` dependem dessa sessao.

## Saidas

Saidas do runtime devem ser curtas, objetivas e faceis para agentes lerem.

