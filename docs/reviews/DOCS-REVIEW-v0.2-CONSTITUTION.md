# Docs Review: v0.2 Constitution

Data: 2026-06-30  
Status: revisao aplicada

## Escopo

Revisao de coerencia apos a criacao da Constituicao e das RFCs estruturais da v0.2.

Documentos revisados:

- `CONSTITUTION.md`
- `docs/rfcs/RFC-0000-CONSTITUTION.md`
- `docs/rfcs/RFC-0006-CAPABILITY-SYSTEM.md`
- `docs/rfcs/RFC-0008-WORKSPACE-MANIFEST.md`
- `docs/rfcs/RFC-0009-REGISTRY-SYSTEM.md`
- `docs/rfcs/RFC-0010-LIFECYCLE-MODEL.md`
- `docs/rfcs/RFC-0011-DOMAIN-MODEL.md`
- `README.md`
- `VISION.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/GLOSSARY.md`
- `docs/DESIGN.md`
- `docs/COMMANDS.md`
- `docs/NAMING.md`
- `docs/architecture/`

Nao houve implementacao funcional. Nao foram alterados comandos. Kernel nao foi alterado.

## Inconsistencias Encontradas

- `RFC-0006-CAPABILITY-SYSTEM.md` dizia que o Plugin Registry resolve capabilities, mas `RFC-0009-REGISTRY-SYSTEM.md` criou um Capabilities Registry especifico para essa responsabilidade.
- `docs/architecture/06-capabilities.md` repetia o mesmo acoplamento conceitual ao Plugin Registry.
- `RFC-0008-WORKSPACE-MANIFEST.md` dizia que templates sao aplicados ao Workspace, enquanto `RFC-0011-DOMAIN-MODEL.md` permite templates por Domain.
- `docs/architecture/01-system-overview.md` ainda descrevia Workspace como diretorio onde o projeto vive, definicao estreita demais depois do RFC-0008.
- `docs/architecture/10-future.md` ainda nao citava Workspace Manifest, Registry System, Lifecycle Model e Domain Model.
- `RFC-0009-REGISTRY-SYSTEM.md` tinha uma frase gramaticalmente ruim apos normalizacao ASCII.
- `RFC-0000-CONSTITUTION.md` continha uma palavra com acento em um conjunto documental que vem sendo mantido majoritariamente em ASCII para evitar leitura quebrada em ambientes Windows.

## Ajustes Aplicados

- `RFC-0006-CAPABILITY-SYSTEM.md` passou a dizer que o Capabilities Registry resolve capabilities consultando o Plugins Registry quando necessario.
- `docs/architecture/06-capabilities.md` foi alinhado ao Capabilities Registry.
- `RFC-0008-WORKSPACE-MANIFEST.md` passou a dizer que templates podem ser aplicados ao Workspace ou a Domains dentro do Workspace.
- `docs/architecture/01-system-overview.md` passou a definir Workspace como unidade maxima onde Kernel, Runtime, Agents, Plugins, Domains e Projects coexistem.
- `docs/architecture/10-future.md` passou a listar Workspace Manifest, Registry System, Domain Model e Lifecycle Model.
- `RFC-0009-REGISTRY-SYSTEM.md` foi ajustado para "solicitem capacidades abstratas".
- `RFC-0000-CONSTITUTION.md` foi normalizado para ASCII em "RFCs propoem mudancas".

## Decisoes Mantidas

- A Constituicao governa decisoes futuras.
- RFCs devem respeitar a Constituicao.
- ADRs registram decisoes permanentes.
- Workspace e a unidade maxima do JZL.
- Workspace pode conter Domains.
- Domain e area funcional.
- Project e implementacao concreta dentro de um Domain ou diretamente no Workspace quando nao houver Domain.
- Kernel Services continuam como termo conceitual preferido.
- Kernel API continua valido para a interface tecnica.
- Plugins representam tecnologias externas.
- Capabilities representam capacidades abstratas.
- Registries existem para descoberta sem acoplamento.
- Comandos atuais que usam `--role` continuam marcados como compatibilidade; Agent permanece o termo arquitetural.

## Riscos Arquiteturais

- Resolver capabilities por Domain pode criar ambiguidade quando dois plugins fornecem a mesma capability em Domains diferentes.
- Workspace Manifest pode conflitar com a estrutura `.jzl` atual se a migracao nao definir fallback e precedencia com clareza.
- Lifecycle Model pode virar burocracia se todos os estados forem persistidos antes de haver uma necessidade operacional real.
- Domain Model pode se sobrepor a Agents de setor se a fronteira entre Domain, Agent e Project nao for formalizada.
- Registries podem virar acoplamento indireto se armazenarem regra de dominio em vez de apenas metadados e referencias.
- Compatibilidade com `--role` pode atrasar a transicao terminologica para Agent se nao houver uma estrategia explicita.

## Proxima Etapa Recomendada

Converter as decisoes estruturais ja estabilizadas em ADRs antes de implementar:

- ADR para Workspace como unidade maxima.
- ADR para Capabilities Registry como resolvedor de capabilities.
- ADR para Domain como area funcional distinta de Agent e Project.
- ADR para precedencia de descoberta: `jzl.workspace.json` antes de `.jzl`.

Depois disso, preparar um RFC de migracao para implementar `jzl.workspace.json` sem quebrar workspaces v0.1.

