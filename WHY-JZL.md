# Why JZL

## Porque O JZL Existe

Agentes de IA conseguem escrever codigo, revisar arquivos, explicar sistemas e executar tarefas locais. Mas, quando varios chats ou agentes trabalham no mesmo projeto, o problema deixa de ser inteligencia e passa a ser coordenacao.

O JZL Agent OS existe para coordenar esse trabalho.

Ele nao tenta substituir Codex, Claude Code, Cursor, OpenHands ou qualquer outro Host. Ele oferece um protocolo local para que esses Hosts operem um Workspace com papeis claros, tarefas explicitas, dependencias rastreaveis e memoria operacional.

## O Problema Real

Sem um sistema operacional de agentes:

- chats perdem contexto;
- roles se misturam;
- escopo muda sem decisao;
- dependencias sao ignoradas;
- tarefas sao concluidas cedo demais;
- handoffs ficam invisiveis;
- revisoes nao sabem o que validar;
- decisoes somem no historico da conversa.

O resultado e um projeto que parece produtivo no curto prazo, mas fica dificil de continuar.

## A Ideia Central

JZL transforma coordenacao em estado local.

Em vez de depender apenas da memoria de um chat, o Workspace possui:

- Agents com contracts.
- Inbox e outbox.
- Tasks com status.
- Dependencies que bloqueiam conclusao.
- Journal para continuidade.
- Events para rastreabilidade.
- Guard para checar limites.
- Preflight antes de concluir.

## O Que O JZL Nao Faz

JZL nao e uma IA.

JZL nao gera codigo.

JZL nao chama API externa.

JZL nao decide pelo usuario.

JZL nao torna um agent automaticamente correto.

Ele torna o trabalho mais explicito, auditavel e coordenado.

## Por Que Arquivos

Arquivos sao simples, portaveis, auditaveis e funcionam localmente.

O JZL comeca com arquivos porque o estado operacional precisa ser facil de inspecionar, versionar quando for definicao e ignorar quando for runtime.

## Por Que Contracts

Prompts sao frageis. Contracts sao limites.

Um Agent precisa saber:

- o que pode fazer;
- o que nao pode fazer;
- quando criar dependency;
- quando criar handoff;
- como saber que terminou.

Contracts reduzem improviso e tornam responsabilidade visivel.

## Por Que Host

O futuro do JZL nao e apenas uma CLI.

A CLI e o primeiro Host, mas outros Hosts podem operar o mesmo Workspace:

- Codex
- Claude Code
- Cursor
- OpenHands
- VSCode plugins
- daemons
- automacoes locais

Separar Host de Agent permite que o processo executor mude sem mudar o papel operacional.

## Por Que Kernel Pequeno

Um Kernel grande vira uma colecao de integracoes.

O JZL escolhe outro caminho:

- Kernel pequeno.
- Plugins para tecnologias.
- Capabilities para linguagem abstrata.
- Providers para implementacao operacional.
- Templates para contexto de projeto.

Isso permite crescer sem perder a forma.

## A Promessa

O JZL Agent OS nao promete que agents vao acertar sempre.

Ele promete que o trabalho deles tera estado, contrato, rastreabilidade e pontos de controle.

Essa e a diferenca entre conversar com uma IA e operar uma equipe de agents.
