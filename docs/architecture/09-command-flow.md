# 09: Command Flow

Fluxo ideal de um comando:

1. CLI recebe argumentos.
2. CLI valida entrada basica.
3. CLI chama Kernel Services.
4. Kernel valida regras e altera estado.
5. Kernel publica eventos.
6. CLI formata saida curta.

## Regra

Comandos nao devem manipular `.jzl` diretamente quando existir Kernel Service equivalente.

Essa migracao deve ser incremental para manter compatibilidade de saida.

