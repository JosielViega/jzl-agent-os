# 06: Capabilities

Capability e uma capacidade abstrata oferecida por um plugin.

Exemplos:

- `version-control`
- `container-runtime`
- `game-engine`
- `package-manager`

## Por Que Existe

Capabilities impedem que contracts, templates e agents fiquem presos a ferramentas especificas.

Um agent pode precisar de controle de versao sem dizer Git. O workspace decide qual plugin fornece essa capability.

## Futuro

O Capabilities Registry deve resolver capabilities para plugins disponiveis, consultando o Plugins Registry quando necessario, e permitir que templates declarem capabilities recomendadas.
