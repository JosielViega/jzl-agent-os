# Constituição do JZL Agent OS

Este documento governa decisoes futuras do JZL Agent OS.

RFCs, ADRs, implementacoes, templates, plugins, profiles e policies devem respeitar esta Constituicao. Quando houver conflito, a Constituicao define o norte arquitetural.

## Artigo I - Kernel

O Kernel e permanente, pequeno e conhece apenas conceitos universais.

Ele deve proteger invariantes do sistema e evitar conhecimento direto de tecnologias externas.

## Artigo II - Plugins

Toda tecnologia externa entra como Plugin, nunca diretamente no Kernel.

Git, Docker, Godot, Unity, NPM, Laravel, React e ferramentas semelhantes pertencem a plugins.

## Artigo III - Capabilities

O Kernel depende de capabilities, nao de plugins especificos.

Plugins fornecem capabilities. O Kernel consome capacidades abstratas.

## Artigo IV - Workspace

Todo estado operacional pertence a um Workspace.

Workspace e a unidade maxima do JZL. Kernel, Plugins, Agents e Runtime pertencem ao Workspace.

## Artigo V - Agents

Agents nunca editam diretamente o estado `.jzl`; usam Kernel Services/comandos.

Agents podem ler estado quando necessario, mas mudancas operacionais devem passar pelas interfaces do JZL.

## Artigo VI - Events

Toda alteracao relevante deve gerar Event.

Eventos sao a trilha de auditoria operacional do JZL.

## Artigo VII - RFC

Nenhuma funcionalidade nasce sem RFC.

RFCs explicam problema, proposta, limites e impacto antes da implementacao.

## Artigo VIII - ADR

Toda decisao permanente deve gerar ADR.

ADRs registram decisoes aceitas, contexto, consequencias e alternativas consideradas.

## Artigo IX - Compatibilidade

Compatibilidade e responsabilidade do Kernel e deve ser tratada explicitamente.

Mudancas estruturais devem considerar migracao, fallback e impacto em workspaces existentes.

## Artigo X - Simplicidade

O Kernel deve permanecer pequeno; complexidade vai para plugins, templates, profiles e policies.

Se uma regra depende de dominio, ferramenta, stack ou preferencia de projeto, ela provavelmente nao pertence ao Kernel.
