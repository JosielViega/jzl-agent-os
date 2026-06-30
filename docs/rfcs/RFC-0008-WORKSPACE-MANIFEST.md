# RFC-0008: Workspace Manifest

Status: draft, implementacao inicial  
Target: v0.2

## Objetivo

Definir oficialmente o conceito de Workspace no JZL Agent OS e propor o arquivo `jzl.workspace.json` como manifesto do Workspace.

## O Que E Um Workspace

Workspace e a unidade maxima do JZL.

Ele representa o ambiente operacional onde o Kernel, Runtime, Agents, Plugins, Templates, Profiles, Policies, Events e Projects coexistem.

Um Workspace pode conter um ou varios projetos. O Workspace nao e apenas uma pasta de codigo; ele e o limite operacional do JZL.

## O Que Nao E

Workspace nao e necessariamente um repositorio Git.

Workspace nao e necessariamente um unico projeto de software.

Workspace nao e apenas `.jzl`.

Workspace nao e uma task, agent, template ou profile.

Workspace nao e uma conta remota, servidor ou banco de dados.

## Workspace vs Project

Workspace e o ambiente operacional maximo.

Project e uma entidade logica dentro do Workspace.

Um Workspace pode conter varios Projects. Um Project pode representar uma aplicacao, pacote, jogo, servico, biblioteca, modulo ou documentacao.

Exemplo:

```txt
workspace/
  jzl.workspace.json
  .jzl/
  game-client/
  game-server/
  docs-site/
```

Nesse exemplo, o Workspace e `workspace/`. Os Projects podem ser `game-client`, `game-server` e `docs-site`.

## Onde Fica

O manifesto do Workspace deve ficar na raiz do Workspace:

```txt
jzl.workspace.json
```

A pasta `.jzl/` continua guardando estado operacional interno:

```txt
.jzl/
  events.log
  agents/
  dependencies/
  handoffs/
  policies/
  workflows/
```

## Como E Identificado

Um Workspace e identificado por `workspaceId`.

`workspaceId` deve ser estavel dentro do ciclo de vida do Workspace. Ele nao deve depender do nome da pasta, porque a pasta pode ser movida ou renomeada.

O Kernel deve preferir `jzl.workspace.json` para identificar o Workspace. Enquanto o manifesto nao existir, a compatibilidade com a estrutura `.jzl` atual pode ser mantida.

## Manifesto

Arquivo:

```txt
jzl.workspace.json
```

Campos minimos:

```json
{
  "workspaceId": "workspace-...",
  "name": "Meu Workspace",
  "kernelVersion": "0.1.0",
  "template": "game",
  "profile": "solo",
  "createdAt": "2026-06-30T00:00:00.000Z",
  "manifestVersion": 1
}
```

## Campos

### workspaceId

Identificador estavel do Workspace.

### name

Nome humano do Workspace.

### kernelVersion

Versao do Kernel esperada ou usada pelo Workspace.

### template

Template inicial ou principal usado pelo Workspace.

### profile

Profile operacional ativo ou default.

### createdAt

Data de criacao do manifesto.

### manifestVersion

Versao do schema do manifesto.

## Como Evolui

O manifesto deve evoluir por `manifestVersion`.

Mudancas futuras podem adicionar:

- lista de projects;
- capabilities requeridas;
- plugins habilitados;
- profiles disponiveis;
- policies ativas;
- paths customizados;
- versao minima do JZL.

Campos novos devem ser opcionais quando possivel. Migracoes devem preservar compatibilidade com workspaces existentes.

## Como Outros Componentes Encontram O Workspace

Componentes devem localizar o Workspace procurando `jzl.workspace.json` a partir do diretorio atual e subindo diretorios pais.

Fluxo sugerido:

1. Procurar `jzl.workspace.json` no diretorio atual.
2. Se nao encontrar, subir para o diretorio pai.
3. Repetir ate a raiz do filesystem.
4. Se nao encontrar manifesto, procurar `.jzl` como fallback de compatibilidade.
5. Se nenhum marcador existir, o Workspace nao esta inicializado.

## Pertencimento

O Workspace e a unidade maxima do JZL.

- O Kernel pertence ao Workspace.
- Plugins pertencem ao Workspace.
- Agents pertencem ao Workspace.
- Runtime pertence ao Workspace.
- Events pertencem ao Workspace.
- Policies pertencem ao Workspace.
- Profiles pertencem ao Workspace.
- Templates sao aplicados ao Workspace ou a Domains dentro do Workspace.
- Projects vivem dentro do Workspace.

## Regras

- Nenhum componente deve assumir que um Workspace contem apenas um Project.
- Nenhum componente deve usar nome da pasta como identidade permanente.
- Plugins nao devem criar seu proprio conceito paralelo de Workspace.
- Kernel Services devem receber ou resolver Workspace antes de operar estado.
- O manifesto nao substitui `.jzl`; ele identifica e descreve o Workspace.

## Fora De Escopo

Este RFC nao define comandos novos.

Este RFC nao muda a estrutura `.jzl` atual.

## Implementacao Inicial

A implementacao inicial cria `jzl.workspace.json` durante `jzl init --type game` sem remover `.jzl/type.json`.

Kernel Service inicial:

- `src/kernel/workspace.js`

Funcoes iniciais:

- `createWorkspaceManifest()`
- `readWorkspaceManifest()`
- `findWorkspaceRoot()`
- `getWorkspaceInfo()`

`jzl status` usa o manifesto quando existir e faz fallback para `.jzl/type.json` quando o manifesto nao existir.
