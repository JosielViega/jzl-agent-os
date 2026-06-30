# RFC-0000: Constitution

Status: accepted  
Target: v0.2

## Objetivo

Definir a Constituicao do JZL Agent OS como documento superior para orientar decisoes futuras.

## Por Que A Constituicao Existe

O JZL esta crescendo de uma CLI local para um sistema operacional de agents. Esse crescimento cria risco de acoplamento, comandos demais, Kernel grande demais e decisoes contraditorias.

A Constituicao existe para impedir que a arquitetura perca o centro.

Ela define principios permanentes:

- Kernel pequeno.
- Tecnologias externas como plugins.
- Capabilities antes de ferramentas.
- Workspace como unidade maxima.
- Agents usando comandos e Kernel Services.
- Eventos como rastreabilidade.
- RFCs antes de funcionalidades.
- ADRs para decisoes permanentes.
- Compatibilidade explicita.
- Simplicidade no Kernel.

## Relacao Com RFCs

RFCs propoem mudancas.

Toda RFC futura deve respeitar a Constituicao. Se uma proposta contrariar a Constituicao, a RFC deve declarar explicitamente o conflito e justificar por que a Constituicao deveria mudar.

## Relacao Com ADRs

ADRs registram decisoes aceitas.

Uma ADR nao deve contradizer a Constituicao. Se uma decisao permanente exigir mudanca constitucional, a mudanca deve ser tratada como revisao constitucional antes ou junto da ADR.

## Mudancas Na Constituicao

Mudancas na Constituicao exigem cuidado especial.

Uma mudanca constitucional deve:

- ter RFC propria;
- explicar o problema real;
- listar consequencias;
- listar alternativas;
- avaliar impacto em RFCs e ADRs existentes;
- ser registrada em ADR quando aceita.

## Fora De Escopo

Este RFC nao implementa codigo.

Este RFC nao cria comandos.

Este RFC nao altera o Kernel.
