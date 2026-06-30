# ADR-0004: Everything Is A Capability

Status: accepted

## Contexto

O JZL precisa interagir com ferramentas diferentes sem transformar o Kernel em uma lista de integracoes especificas.

Git, Docker, Godot, Unity, NPM e outras ferramentas sao implementacoes concretas. O sistema precisa pensar em capacidades operacionais.

## Decisao

O sistema deve depender de capabilities, nao de nomes fixos de ferramentas.

## Consequencias

- Plugins declaram capabilities.
- Templates podem pedir capabilities.
- Agents podem solicitar uma capability sem escolher tecnologia.
- O Plugin Registry deve evoluir para resolver capabilities.

## Alternativas Consideradas

- Registrar ferramentas diretamente no Kernel.
- Criar comandos fixos para cada tecnologia suportada.

Essas alternativas foram rejeitadas porque criam acoplamento e reduzem extensibilidade.

