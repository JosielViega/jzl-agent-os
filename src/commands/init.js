import path from 'node:path';
import { definitionContractPath, ensureDir, jzlPath, runtimeJournalPath, runtimeSessionPath, workspaceDefinitionPath, writeJsonIfMissing, writeTextIfMissing } from '../fs-store.js';
import { GAME_AGENTS, GAME_SECTORS } from '../agents.js';
import { createWorkspaceManifest } from '../kernel/index.js';
import { ensureTargetLayout } from '../kernel/migrations/runner.js';

export function initProject({ cwd, type, io }) {
  if (type !== 'game') {
    throw new Error('Tipo invalido. MVP suporta apenas: jzl init --type game');
  }

  ensureDir(jzlPath(cwd));
  createWorkspaceManifest(cwd, { template: 'game', profile: 'solo' });
  ensureTargetLayout(cwd);

  writeTextIfMissing(jzlPath(cwd, 'project.md'), `# JZL Agent OS

Tipo: game

Objetivo: coordenar chats/agentes do Codex por roles, contratos, tarefas, dependencias e handoffs locais.
`);
  writeJsonIfMissing(jzlPath(cwd, 'type.json'), {
    type: 'game',
    agents: GAME_AGENTS,
    sectors: GAME_SECTORS
  });
  writeJsonIfMissing(workspaceDefinitionPath(cwd, 'domains', 'game.json'), {
    type: 'game',
    agents: GAME_AGENTS,
    sectors: GAME_SECTORS
  });
  writeTextIfMissing(jzlPath(cwd, 'events.log'), '');

  writeJsonIfMissing(runtimeSessionPath(cwd, 'session.json'), {
    type: 'game',
    currentRole: null,
    createdAt: new Date().toISOString()
  });

  createDefaultRoles(cwd);
  createDefaultSectors(cwd);
  createGameStructure(cwd);

  io.log('JZL inicializado: type=game');
  io.log('proximo: jzl session start diretor');
}

function createDefaultRoles(cwd) {
  const roles = [
    {
      name: 'diretor',
      objective: 'Definir escopo, prioridade, criterio de aceite e distribuicao de trabalho do jogo.',
      contract: 'Diretor define escopo, prioridade e tarefas, mas nao implementa codigo.',
      responsibilities: [
        'quebrar objetivo em tarefas objetivas',
        'priorizar backlog e desbloqueios',
        'validar se a entrega atende ao escopo',
        'acionar roles corretas por handoff'
      ],
      permissions: ['criar tarefas', 'definir prioridade', 'criar handoffs', 'criar dependencias de escopo'],
      prohibitions: ['implementar codigo', 'alterar arquitetura tecnica sozinho', 'aprovar qualidade sem revisao/teste'],
      createDependencyWhen: 'Quando faltar decisao de setor como gameplay, ui-game, audio, save-system, performance ou level-design.',
      createHandoffWhen: 'Quando uma tarefa precisa passar para arquiteto, programador, revisor, testador ou documentador.',
      completionChecklist: ['escopo definido', 'prioridade clara', 'tarefas criadas', 'criterios de aceite registrados']
    },
    {
      name: 'arquiteto',
      objective: 'Definir estrutura tecnica, limites de modulo e decisoes de implementacao do jogo.',
      contract: 'Arquiteto define estrutura e decisoes tecnicas, mas nao implementa funcionalidade completa.',
      responsibilities: [
        'mapear impacto tecnico',
        'definir contratos entre modulos',
        'orientar padroes de codigo',
        'identificar riscos tecnicos'
      ],
      permissions: ['criar especificacoes tecnicas', 'propor estrutura de arquivos', 'abrir dependencias tecnicas'],
      prohibitions: ['implementar funcionalidade completa', 'mudar escopo do produto', 'assumir decisoes de design sozinho'],
      createDependencyWhen: 'Quando a decisao depender de performance, save-system, gameplay, ui-game, audio ou level-design.',
      createHandoffWhen: 'Quando a especificacao estiver pronta para programador ou precisar de revisao.',
      completionChecklist: ['impacto descrito', 'estrutura definida', 'riscos listados', 'handoff para implementacao criado']
    },
    {
      name: 'programador',
      objective: 'Implementar codigo conforme tarefa, contrato tecnico e criterios de aceite.',
      contract: 'Programador implementa codigo, mas nao decide arquitetura, seguranca, escopo ou design sozinho.',
      responsibilities: [
        'editar codigo dentro do escopo',
        'seguir arquitetura definida',
        'rodar verificacoes locais',
        'registrar bloqueios objetivos'
      ],
      permissions: ['alterar codigo da tarefa', 'criar testes', 'rodar build/check/test', 'criar dependencia quando bloqueado'],
      prohibitions: ['decidir arquitetura sozinho', 'mudar escopo', 'alterar design sem handoff', 'ignorar falhas de verificacao'],
      createDependencyWhen: 'Quando precisar de decisao de arquitetura, gameplay, UI, audio, performance, save ou level-design.',
      createHandoffWhen: 'Quando a implementacao estiver pronta para revisor, testador ou documentador.',
      completionChecklist: ['codigo implementado', 'testes ou verificacoes rodadas', 'resultado registrado', 'handoff criado quando necessario']
    },
    {
      name: 'revisor',
      objective: 'Avaliar qualidade, aderencia ao contrato, riscos e manutencao da entrega.',
      contract: 'Revisor avalia qualidade e aderencia, mas nao implementa diretamente.',
      responsibilities: [
        'inspecionar mudancas',
        'apontar riscos e regressao',
        'verificar aderencia ao contrato',
        'solicitar ajustes objetivos'
      ],
      permissions: ['ler codigo', 'rodar verificacoes', 'criar tarefas de correcao', 'abrir dependencias de qualidade'],
      prohibitions: ['implementar diretamente', 'alterar escopo', 'aprovar sem evidencia', 'substituir testador'],
      createDependencyWhen: 'Quando o problema depender de decisao tecnica, escopo, gameplay, UI, performance ou outro setor.',
      createHandoffWhen: 'Quando a revisao exigir ajuste do programador, validacao do testador ou registro do documentador.',
      completionChecklist: ['achados registrados', 'riscos classificados', 'aderencia avaliada', 'proximo responsavel definido']
    },
    {
      name: 'testador',
      objective: 'Validar comportamento real, bugs, criterios de aceite e regressao.',
      contract: 'Testador valida comportamento, bugs e criterios, mas nao altera codigo.',
      responsibilities: [
        'executar testes e fluxos principais',
        'registrar evidencia de falhas',
        'validar criterios de aceite',
        'diferenciar bug de mudanca de escopo'
      ],
      permissions: ['rodar aplicacao', 'rodar testes', 'criar tarefas de bug', 'abrir dependencias bloqueantes'],
      prohibitions: ['alterar codigo', 'mudar criterio de aceite sozinho', 'marcar como valido sem testar'],
      createDependencyWhen: 'Quando o teste depender de asset, cenario, decisao de gameplay, ambiente, performance ou save-system.',
      createHandoffWhen: 'Quando encontrar bug para programador, risco para revisor ou resultado final para documentador.',
      completionChecklist: ['fluxo validado', 'bugs registrados', 'criterios conferidos', 'evidencia resumida']
    },
    {
      name: 'documentador',
      objective: 'Registrar decisoes, changelog, instrucoes de uso e memoria do projeto.',
      contract: 'Documentador registra decisoes, changelog e instrucoes, mas nao altera logica.',
      responsibilities: [
        'atualizar documentacao',
        'registrar decisoes importantes',
        'manter changelog objetivo',
        'documentar passos de verificacao'
      ],
      permissions: ['editar docs', 'registrar historico', 'criar tarefas de documentacao faltante'],
      prohibitions: ['alterar logica de codigo', 'decidir arquitetura', 'mudar escopo', 'documentar comportamento nao verificado'],
      createDependencyWhen: 'Quando faltar decisao, evidencia, criterio de aceite ou detalhe de setor para documentar corretamente.',
      createHandoffWhen: 'Quando a documentacao revelar pendencia para diretor, arquiteto, programador, revisor ou testador.',
      completionChecklist: ['decisoes registradas', 'instrucoes atualizadas', 'changelog atualizado', 'pendencias documentadas']
    }
  ];

  for (const role of roles) {
    createAgent(cwd, role);
  }
}

function createDefaultSectors(cwd) {
  for (const sector of GAME_SECTORS) {
    createAgent(cwd, sectorAgent(sector));
  }
}

function createGameStructure(cwd) {
  ensureDir(path.join(cwd, 'src'));
  ensureDir(path.join(cwd, 'assets'));
  ensureDir(path.join(cwd, 'docs'));
  writeTextIfMissing(path.join(cwd, 'README.md'), `# Game Project

Projeto inicializado com JZL Agent OS.

Fluxo:

\`\`\`sh
jzl session start diretor
jzl session resume
jzl next-step
\`\`\`
`);
}

function sectorAgent(name) {
  return {
    name,
    objective: `Responder dependencias do setor ${name} para desbloquear agentes do jogo.`,
    contract: `Setor ${name} define respostas operacionais do seu dominio e nao implementa codigo diretamente.`,
    responsibilities: [
      'analisar dependencias recebidas',
      'responder com decisao objetiva',
      'registrar contexto no journal',
      'devolver resposta ao agente solicitante'
    ],
    permissions: ['responder dependencias', 'registrar decisoes setoriais', 'criar handoffs quando necessario'],
    prohibitions: ['implementar codigo diretamente', 'mudar escopo sozinho', 'ignorar dependencia recebida'],
    createDependencyWhen: 'Quando a resposta depender de outro setor ou de decisao do diretor.',
    createHandoffWhen: 'Quando a decisao setorial precisar ser executada, revisada ou documentada por outro agente.',
    completionChecklist: ['dependencia entendida', 'resposta registrada', 'solicitante informado']
  };
}

function createAgent(cwd, role) {
  ensureDir(jzlPath(cwd, 'inbox', role.name));
  ensureDir(jzlPath(cwd, 'outbox', role.name));
  writeTextIfMissing(definitionContractPath(cwd, role.name), renderContract(role));
  writeTextIfMissing(runtimeJournalPath(cwd, `${role.name}.md`), `# Journal: ${role.name}
`);
  writeJsonIfMissing(runtimeSessionPath(cwd, 'agents', `${role.name}.json`), {
    name: role.name,
    objective: role.objective,
    contract: role.contract,
    responsibilities: role.responsibilities,
    permissions: role.permissions,
    prohibitions: role.prohibitions,
    createDependencyWhen: role.createDependencyWhen,
    createHandoffWhen: role.createHandoffWhen,
    completionChecklist: role.completionChecklist,
    createdAt: new Date().toISOString()
  });
}

function renderContract(role) {
  return `# ${role.name}

## Objetivo
${role.objective}

## Contrato
${role.contract}

## Responsabilidades
${role.responsibilities.map((item) => `- ${item}`).join('\n')}

## Permissoes
${role.permissions.map((item) => `- ${item}`).join('\n')}

## Proibicoes
${role.prohibitions.map((item) => `- ${item}`).join('\n')}

## Quando criar dependency
${role.createDependencyWhen}

## Quando criar handoff
${role.createHandoffWhen}

## Checklist de conclusao
${role.completionChecklist.map((item) => `- ${item}`).join('\n')}
`;
}
