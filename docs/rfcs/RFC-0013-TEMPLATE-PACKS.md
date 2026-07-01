# RFC-0013: Template Packs

Status: draft  
Target: v0.2

## Objetivo

Planejar o Template System v0.2 como um sistema de Template Packs instalaveis.

Template Pack e a unidade distribuivel que contem agents, contracts, policies, workflows e recomendacoes de plugins/capabilities para um tipo de trabalho.

## Problema

Na v0.1, `jzl init --type game` cria a estrutura `game` diretamente no codigo.

Isso valida o conceito, mas cria acoplamento:

- templates ficam embutidos no comando init;
- novos tipos exigem mudanca de codigo;
- templates nao podem ser aplicados a Domain;
- recomendacoes de plugins/capabilities nao sao declarativas;
- profiles nao conseguem ajustar templates sem conhecer detalhes internos.

## O Que E Template Pack

Template Pack e um pacote instalavel que descreve uma organizacao operacional reutilizavel.

Ele nao e o runtime.

Ele nao e um profile.

Ele nao e um domain.

Ele nao deve executar automacoes externas por conta propria.

## Estrutura

```txt
templates/
  <name>/
    template.json
    agents/
    contracts/
    policies/
    workflows/
    recommended-plugins.json
    recommended-capabilities.json
```

## template.json

Exemplo:

```json
{
  "name": "game",
  "version": "0.2.0",
  "description": "Coordenacao operacional para desenvolvimento de jogos.",
  "targets": ["workspace", "domain"],
  "agents": ["diretor", "arquiteto", "programador", "revisor", "testador", "documentador"],
  "domains": ["gameplay", "performance", "ui-game", "audio", "save-system", "level-design"]
}
```

## recommended-plugins.json

Exemplo:

```json
{
  "plugins": ["git"]
}
```

## recommended-capabilities.json

Exemplo:

```json
{
  "capabilities": ["version-control"]
}
```

## Template vs Profile vs Domain

### Template

Template define estrutura inicial e organizacao operacional.

Exemplos:

- agents;
- contracts;
- policies;
- workflows;
- plugins recomendados;
- capabilities recomendadas.

### Profile

Profile define preferencias e defaults operacionais.

Exemplos:

- `solo`;
- `team`;
- `strict`;
- `experimental`.

Profile ajusta comportamento. Template instala estrutura.

### Domain

Domain representa uma area funcional dentro de um Workspace.

Exemplos:

- gameplay;
- backend;
- website;
- admin;
- billing.

Um Template Pack pode ser aplicado ao Workspace inteiro ou a um Domain especifico.

## Como O Game Atual Vira Template Pack

O comportamento atual de `jzl init --type game` deve ser convertido em um Template Pack `game`.

Conteudo esperado:

- agents de funcao: diretor, arquiteto, programador, revisor, testador, documentador;
- domains/setores: gameplay, performance, ui-game, audio, save-system, level-design;
- contracts detalhados;
- policies iniciais;
- workflows basicos;
- recommended plugin: `git`;
- recommended capability: `version-control`.

## Compatibilidade Com init --type game

`jzl init --type game` deve continuar funcionando.

Na implementacao futura, ele deve ser equivalente a aplicar o Template Pack `game`.

Compatibilidade esperada:

- manter `.jzl/type.json` enquanto necessario;
- manter `jzl.workspace.json`;
- manter agents e contracts gerados com nomes atuais;
- manter comandos com `--role` enquanto a CLI nao tiver estrategia de migracao para `--agent`.

## Aplicacao Em Workspace Ou Domain

Template Packs podem ser aplicados em dois niveis:

### Workspace

Aplica estrutura global do workspace.

Exemplo:

```txt
Workspace: game-suite
Template Pack: game
```

### Domain

Aplica estrutura em uma area funcional especifica.

Exemplo:

```txt
Workspace: game-suite
Domain: backend
Template Pack: php-mysql
```

## Relacao Com Registries

Template Packs devem ser descobertos pelo Templates Registry.

Template Packs podem declarar recommended plugins e capabilities.

Essas recomendacoes devem ser resolvidas por:

- Plugins Registry;
- Providers Registry;
- Capabilities Registry.

## Criterios Para Implementacao Futura

- Criar Template Pack `game` sem mudar comportamento externo de `jzl init --type game`.
- Mover dados embutidos do init para arquivos declarativos.
- Manter fallback para o init atual durante migracao.
- Registrar template no Templates Registry.
- Validar `template.json`.
- Instalar agents, contracts, policies e workflows a partir do pack.
- Ler `recommended-plugins.json` e `recommended-capabilities.json`.
- Nao executar automacoes externas automaticamente.
- Suportar aplicacao a Workspace.
- Planejar aplicacao a Domain sem obrigar implementacao inicial completa.
- Adicionar testes de compatibilidade para `jzl init --type game`.

## Fora De Escopo

Este RFC nao implementa Template Packs.

Este RFC nao altera `jzl init`.

Este RFC nao adiciona comandos.

