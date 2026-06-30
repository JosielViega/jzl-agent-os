# 04: Event Bus

O Event Bus centraliza publicacao e leitura de eventos.

Eventos explicam o que aconteceu no sistema:

- task criada;
- task assumida;
- dependency criada;
- dependency resolvida;
- mensagem enviada;
- journal atualizado;
- commit vinculado a task.

## Hoje

O `events.log` e o Event Store atual. Ele e simples, local e append-only.

Subscribers em memoria podem reagir a eventos durante uma execucao.

## Futuro

O Event Bus deve permitir subscribers de plugins, filtros por agent/task/dependency e replay de eventos para reconstruir contexto.

