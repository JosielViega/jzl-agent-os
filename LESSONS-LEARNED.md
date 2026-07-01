# Lessons Learned v0.2

## Contexto

A fase v0.2 do JZL Agent OS foi menos sobre adicionar comandos e mais sobre entender o que o sistema realmente e.

A v0.1 provou que uma CLI local consegue coordenar agents com tasks, inbox, dependencies, journal, guard e preflight. A v0.2 mostrou que isso nao basta. Para crescer sem virar um conjunto acidental de scripts, o JZL precisa de identidade arquitetural.

## Aprendizados

### 1. Contratos Sao Mais Importantes Que Prompts

Prompts orientam uma conversa. Contratos definem limites operacionais.

O JZL existe porque agents precisam de papel, permissao, proibicao, checklist e criterio de handoff. Sem contrato, o agent tende a improvisar escopo.

### 2. Estado Explicito Vence Memoria Implicita

Chats esquecem. Arquivos permanecem.

Tasks, dependencies, events e journals precisam existir fora da memoria do Host. O estado operacional deve ser consultavel por qualquer Host que entre no Workspace.

### 3. `.jzl` E Runtime, Nao Definicao

O incidente de runtime commitado no proprio repositorio mostrou que `.jzl` nao deve ser tratado como definicao versionavel do projeto.

Workspace Definition deve migrar para `workspace/`. Workspace Runtime deve ficar em `.jzl` e ser ignorado por Git quando for efemero.

### 4. Agent Nao E Host

Agent e papel operacional. Host e processo executor.

Essa diferenca ficou essencial para permitir que CLI, Codex, Claude Code, Cursor, OpenHands, IDE plugins e automacoes futuras operem o mesmo Workspace sem confundir processo com responsabilidade.

### 5. Kernel Deve Continuar Pequeno

O Kernel nao deve conhecer Git, Docker, Godot, Unity, Laravel ou qualquer ferramenta especifica.

Tecnologias entram por Plugins. O Kernel consome Capabilities e Providers.

### 6. Capabilities Sao A Linguagem Do Core

O Core nao deve pedir Git. Deve pedir `version-control`.

Essa inversao permite que o sistema cresca sem acoplar o Kernel a escolhas de ferramenta.

### 7. RFCs Evitam Crescimento Acidental

A v0.2 criou a disciplina de registrar problema, decisao e impacto antes de implementar.

Essa disciplina protege o projeto de adicionar comandos antes de entender a arquitetura.

### 8. Documentacao E Produto

No JZL, documentacao nao e acabamento. Ela e parte do sistema operacional.

RFCs, ADRs, Constitution, Vision, Architecture, Glossary, Specs e Reviews formam a memoria institucional do projeto.

### 9. Compatibilidade Precisa Ser Explicita

Comandos atuais ainda usam `--role`, mas a arquitetura usa Agent.

Essa tensao e aceitavel quando documentada. Compatibilidade nao deve ser acidental nem invisivel.

### 10. Dogfooding Revela Verdades

Usar o JZL para desenvolver o proprio JZL revelou problemas que uma arquitetura abstrata nao mostraria, como o runtime commitado e a necessidade do Host System.

## Decisao Para v0.3

A v0.3 deve implementar com base na arquitetura congelada, nao reabrir conceitos centrais a cada comando.

O foco deve ser:

- Runtime Layout.
- CLI Host.
- External Plugin Loading.
- Template Packs.
- Host Protocol v1.

## Frase Guia

O JZL nao deve tornar agents mais inteligentes. Deve tornar equipes de agents mais organizadas, previsiveis e colaborativas.
