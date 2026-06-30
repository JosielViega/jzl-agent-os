# Docs Review: v0.2 Sprint 0

Data: 2026-06-30  
Status: revisao aplicada

## Escopo

Revisao de VISION, README, RFCs, ADRs, arquitetura, naming, design, glossary, roadmap, commands e changelog.

Nao foram adicionados comandos. Nao houve alteracao funcional. Kernel nao foi alterado.

## Inconsistencias Encontradas

- Alguns documentos descreviam o JZL como "CLI local", enquanto a Sprint 0 define JZL como sistema operacional local exposto por CLI.
- README usava `role` como conceito em bullets de preflight/status, sem explicar que `role` e compatibilidade de comando.
- ROADMAP usava `Kernel API` para descrever direcao conceitual, enquanto NAMING recomenda `Kernel Services` quando apropriado.
- RFC-0001, RFC-0002, RFC-0005 e ADR-0002 misturavam `Kernel API` e `Kernel Services` sem diferenciar interface tecnica de servicos conceituais.
- `docs/DESIGN.md` continha titulo com acento em um conjunto documental que vem usando ASCII por consistencia.
- `VISION.md` continha a missao com acentos, em desacordo com o padrao ASCII dominante dos documentos atuais.
- `docs/GLOSSARY.md` nao definia `Role` nem diferenciava `Project` de `Workspace`.
- `docs/COMMANDS.md` listava comandos com `--role`, mas nao explicava que Agent e o termo arquitetural preferido.

## Ajustes Aplicados

- README passou a definir JZL como sistema operacional local exposto por CLI.
- README passou a explicar que comandos ainda usam `--role` por compatibilidade, mas a documentacao nova usa Agent.
- README trocou referencias conceituais de role por agent onde nao eram exemplos de comando.
- ROADMAP passou a usar `Kernel Services` na descricao da v0.2 e `workspace` na fase de Project Awareness.
- RFC-0001 passou a diferenciar Kernel Services da Kernel API tecnica.
- RFC-0002 e RFC-0005 passaram a falar em Kernel Services quando a ideia era conceitual.
- ADR-0002 passou a registrar que comandos usam Kernel Services por meio da Kernel API tecnica.
- COMMANDS ganhou nota de compatibilidade sobre `--role`.
- GLOSSARY ganhou entradas para `Project` e `Role`.
- DESIGN e VISION foram normalizados para ASCII onde destoavam do restante da documentacao.

## Decisoes Mantidas

- `Agent` e o termo arquitetural principal.
- `Role` permanece nos comandos atuais por compatibilidade.
- `Workspace` descreve o ambiente de trabalho.
- `Project` permanece como entidade do Kernel e metadados do workspace.
- `Kernel Services` e o termo preferido para operacoes conceituais do Kernel.
- `Kernel API` permanece valido quando o texto fala da interface tecnica chamada por comandos, plugins ou testes.
- JZL continua sendo local, deterministico e sem IA interna.
- Agents nao devem editar `.jzl` manualmente.
- RFCs documentam propostas; ADRs documentam decisoes aceitas.
- COMMANDS continua alinhado aos nomes reais da CLI, mesmo quando a arquitetura prefere Agent.

## Pendencias Para v0.2

- Definir se os comandos futuros devem manter `--role` ou introduzir aliases com `--agent`.
- Formalizar schema de Project vs Workspace.
- Completar migracao gradual dos comandos para Kernel Services.
- Evoluir Capabilities Registry para resolver capabilities consultando o Plugins Registry quando necessario.
- Definir policy documental para acentos: manter ASCII por enquanto para consistencia dos arquivos atuais.
- Criar ADR quando a nomenclatura `Agent` substituir totalmente `Role` na CLI, se isso acontecer.
