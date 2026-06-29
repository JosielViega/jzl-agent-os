# Workflow

## Fluxo Principal

1. Usuario inicializa o projeto:

```sh
jzl init --type game
```

2. Codex chat Diretor inicia:

```sh
jzl boot --role diretor
```

3. Diretor cria uma task:

```sh
jzl task create --to programador --title "Implementar movimento" --description "Movimento horizontal com aceleracao."
```

4. Codex chat Programador inicia:

```sh
jzl boot --role programador
```

5. Programador assume a task:

```sh
jzl task take --id <task-id>
```

6. Programador registra progresso:

```sh
jzl journal add --text "Iniciada implementacao do movimento."
```

7. Programador cria dependency se necessario:

```sh
jzl dependency create --to gameplay --reason "Definir regras de aceleracao."
```

8. Setor resolve:

```sh
jzl boot --role gameplay
jzl inbox read --id <dependency-id>
jzl dependency resolve --id <dependency-id> --summary "Aceleracao ate velocidade maxima em 0.4s."
```

9. Programador le resposta e roda preflight:

```sh
jzl boot --role programador
jzl inbox read --id <dependency-response-id>
jzl journal add --text "Aplicada regra de aceleracao."
jzl preflight
```

10. Programador conclui ou envia para revisor:

```sh
jzl send --to revisor --summary "Movimento pronto para revisao."
jzl task complete --summary "Movimento implementado."
```
