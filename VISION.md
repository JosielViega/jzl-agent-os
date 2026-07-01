# Vision

## O Que E O JZL Agent OS

JZL Agent OS e um sistema operacional local, exposto por uma CLI sem IA interna, para coordenar equipes de agentes de IA dentro de um workspace.

Ele organiza agentes, contratos, tasks, mensagens, dependencias, journal, eventos e checagens operacionais em arquivos locais. O JZL nao tenta pensar pelo agente. Ele cria um protocolo para que agentes trabalhem com mais continuidade, limite e previsibilidade.

## O Que Ele Nao E

JZL nao e uma IA.

JZL nao substitui Codex, ChatGPT ou outro agente.

JZL nao gera codigo sozinho.

JZL nao depende de API externa, banco de dados ou servidor.

JZL nao e um gerenciador de projetos humano completo. Ele e uma camada operacional para agentes.

## Problema Que Resolve

Agentes de IA sao bons em executar tarefas locais, mas podem perder continuidade entre chats, misturar responsabilidades, ignorar bloqueios, concluir trabalho cedo demais ou tomar decisoes fora do contrato.

O JZL resolve isso tornando o estado operacional explicito:

- quem e o agente atual;
- qual contrato limita sua atuacao;
- qual task esta ativa;
- quais mensagens chegaram;
- quais dependencias bloqueiam conclusao;
- quais eventos aconteceram;
- qual contexto foi registrado no journal.

## Quem Usa

O JZL e usado por pessoas que trabalham com agentes de IA em projetos locais.

Usuarios principais:

- desenvolvedores que usam Codex em varias conversas;
- equipes pequenas que querem separar responsabilidades entre agentes;
- criadores de jogos, apps e ferramentas que precisam de continuidade operacional;
- maintainers do proprio JZL Agent OS.

## Como Funciona

O usuario inicializa o workspace com `jzl init`.

Depois disso, cada agente usa comandos JZL para descobrir seu estado:

- `jzl boot --role <agent>`
- `jzl inbox`
- `jzl task current`
- `jzl dependency list`
- `jzl preflight`

O argumento `--role` permanece por compatibilidade com a CLI atual; o conceito arquitetural e Agent.

O estado fica em `.jzl`, mas agents nao devem editar `.jzl` manualmente. Eles devem usar comandos.

Na arquitetura v0.2, quem opera o Workspace e um Host. A CLI atual e o primeiro Host pratico. Codex, Claude Code, Cursor, OpenHands, IDE plugins e automacoes futuras podem operar o mesmo Workspace como Hosts, sempre atraves do Kernel.

## Missao

O objetivo do JZL Agent OS nao e tornar agentes mais inteligentes. E tornar equipes de agentes mais organizadas, previsiveis e colaborativas.

## Visao Para v1.0

Na v1.0, o JZL deve ser um sistema operacional local e confiavel para equipes de agentes.

Direcoes esperadas:

- Kernel pequeno e estavel.
- Runtime claro para agents.
- Workspace como unidade maxima.
- Hosts como processos que operam Workspaces atraves do Kernel.
- Domains para areas funcionais.
- Templates por tipo de projeto.
- Plugins externos por capability.
- Registries para descoberta sem acoplamento.
- Core pequeno separado de um ecossistema extensivel.
- Distribution Registry para instalar componentes do ecossistema.
- Compatibilidade versionada entre Core e componentes externos.
- Event Bus com rastreabilidade forte.
- Policies configuraveis.
- Lifecycle explicito para entidades centrais.
- Documentacao tratada como parte do produto.
- Dogfooding: o JZL desenvolvido usando o proprio JZL.
