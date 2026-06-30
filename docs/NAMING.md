# Naming

## Agent

Usar `Agent` em documentacao futura.

`Role` ainda existe em comandos atuais por compatibilidade, como `jzl boot --role programador`, mas o conceito arquitetural preferido e Agent.

## Workspace

Usar `Workspace` para o ambiente de trabalho onde o JZL esta inicializado.

Evitar misturar `project folder`, `repo`, `diretorio` e `ambiente` quando o sentido arquitetural for o mesmo.

## Kernel Services

Usar `Kernel Services` quando falar das operacoes internas oferecidas pelo Kernel.

Usar `Kernel API` quando falar da interface tecnica chamada por comandos, plugins ou testes.

## Capability

Usar `Capability` para capacidade abstrata.

Evitar acoplar contratos a nomes de ferramentas quando a necessidade for generica.

Exemplo:

- Preferir `version-control`.
- Evitar `git`, exceto quando o assunto for o plugin Git especifico.

## Compatibilidade

Comandos atuais podem manter nomes existentes para nao quebrar usuarios.

Documentacao nova deve explicar a transicao:

- `role` em CLI atual;
- `agent` em arquitetura futura.

## Arquivos

RFCs usam prefixo `RFC-0000-NAME.md`.

ADRs usam prefixo `ADR-0000-NAME.md`.

Documentos de arquitetura usam prefixo numerico para leitura sequencial.

