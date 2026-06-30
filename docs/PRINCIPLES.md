# Principles

## Tres Leis Do Kernel

Lei 1: Nenhuma funcionalidade nasce sem RFC.

Lei 2: Nenhuma RFC nasce sem problema real.

Lei 3: Kernel e sagrado.

## Comandos Sobre Edicao Manual

Agentes devem usar comandos `jzl` para alterar estado. Edicao manual de `.jzl` quebra garantias do kernel.

## Estado Explicito

Toda coordenacao importante deve aparecer em arquivos: task, dependency, mensagem, journal ou evento.

## Agentes Com Contratos

Cada agente tem objetivo, responsabilidades, permissoes e proibicoes.

## Dependencias Obrigatorias

Quando uma acao sai do contrato, o agente deve criar dependency ou handoff.

## Preflight Antes De Concluir

Nenhuma task deveria ser concluida sem verificar dependencies, mensagens relacionadas, contrato, checklist e journal.

## Journal Para Continuidade

O journal existe para que outro chat consiga entender o que aconteceu e continuar o trabalho.

## Sem IA Interna No Nucleo

O JZL deve continuar previsivel, local e deterministico. A IA vive nos agentes que usam o JZL, nao dentro do kernel.

## Capabilities Sobre Ferramentas

O sistema deve depender de capabilities, nao de nomes fixos de ferramentas. Git, Docker, Godot e NPM sao implementacoes; `version-control`, `container-runtime`, `game-engine` e `package-manager` sao capacidades.
