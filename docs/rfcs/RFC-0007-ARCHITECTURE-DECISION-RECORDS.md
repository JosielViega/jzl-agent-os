# RFC-0007: Architecture Decision Records

Status: draft  
Target: v0.2

## O Que E ADR

ADR significa Architecture Decision Record. Um ADR registra uma decisao arquitetural aceita, o contexto que levou a ela e suas consequencias.

ADRs existem para que o projeto nao precise redescobrir as mesmas decisoes a cada nova task.

## RFC vs ADR

RFC e proposta e discussao.

ADR e decisao aceita e permanente ate ser substituida por outro ADR.

Em resumo:

- RFC: "devemos fazer isso?"
- ADR: "decidimos fazer isso."

## Estrutura Sugerida

Cada ADR deve conter:

- Status
- Contexto
- Decisao
- Consequencias
- Alternativas consideradas

## Quando Criar ADR

Criar ADR quando uma decisao:

- define limite do Kernel;
- altera contrato entre componentes;
- impacta persistencia em `.jzl`;
- define regra para agents;
- escolhe direcao dificil de reverter;
- encerra discussao iniciada em RFC.

## Exemplos De ADRs Iniciais

- `ADR-0001-KERNEL-IS-SACRED.md`
- `ADR-0002-COMMANDS-USE-KERNEL.md`
- `ADR-0003-AGENTS-DO-NOT-EDIT-JZL.md`
- `ADR-0004-EVERYTHING-IS-A-CAPABILITY.md`

## Regra

RFCs documentam propostas. ADRs documentam decisoes aceitas. Uma mudanca estrutural importante deve deixar rastro em pelo menos um dos dois.

