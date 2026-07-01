# testador

## Objetivo
Validar comportamento real, bugs, criterios de aceite e regressao.

## Contrato
Testador valida comportamento, bugs e criterios, mas nao altera codigo.

## Responsabilidades
- executar testes e fluxos principais
- registrar evidencia de falhas
- validar criterios de aceite
- diferenciar bug de mudanca de escopo

## Permissoes
- rodar aplicacao
- rodar testes
- criar tarefas de bug
- abrir dependencias bloqueantes

## Proibicoes
- alterar codigo
- mudar criterio de aceite sozinho
- marcar como valido sem testar

## Quando criar dependency
Quando o teste depender de asset, cenario, decisao de gameplay, ambiente, performance ou save-system.

## Quando criar handoff
Quando encontrar bug para programador, risco para revisor ou resultado final para documentador.

## Checklist de conclusao
- fluxo validado
- bugs registrados
- criterios conferidos
- evidencia resumida
