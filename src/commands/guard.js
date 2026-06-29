import { getRole, requireCurrentRole } from '../state.js';

const ROLE_RULES = {
  programador: {
    blocked: ['arquitetura', 'seguranca', 'segurança', 'escopo'],
    review: ['design', 'ui', 'interface', 'visual', 'paleta', 'layout'],
    allowed: ['implementar', 'codigo', 'código', 'teste', 'build', 'corrigir bug', 'refatorar dentro da task']
  },
  diretor: {
    blocked: ['implementar', 'codigo', 'código', 'programar', 'alterar arquivo', 'editar codigo'],
    allowed: ['definir escopo', 'priorizar', 'criar tarefa', 'handoff', 'dependency']
  },
  arquiteto: {
    blocked: ['implementar funcionalidade completa', 'mudar escopo', 'design sozinho'],
    allowed: ['arquitetura', 'estrutura', 'decisao tecnica', 'decisão técnica', 'contrato tecnico']
  },
  revisor: {
    blocked: ['implementar', 'alterar codigo', 'editar codigo'],
    allowed: ['revisar', 'avaliar', 'inspecionar', 'apontar risco']
  },
  testador: {
    blocked: ['alterar codigo', 'editar codigo', 'implementar'],
    allowed: ['testar', 'validar', 'reproduzir bug', 'rodar teste']
  },
  documentador: {
    blocked: ['alterar logica', 'alterar lógica', 'implementar', 'editar codigo'],
    allowed: ['documentar', 'changelog', 'registrar decisao', 'instrucoes']
  }
};

export function guardAction({ cwd, action, io }) {
  if (!action) throw new Error('Informe acao: --action "..."');
  const roleName = requireCurrentRole(cwd);
  const role = getRole(cwd, roleName);
  const normalized = normalize(action);
  const rule = ROLE_RULES[roleName] || {};

  const prohibition = firstMatch(normalized, [...(rule.blocked || []), ...(role.prohibitions || [])]);
  if (prohibition) {
    return printResult(io, {
      status: 'blocked',
      reason: 'acao parece fora do contrato',
      matched: prohibition,
      recommended: 'criar dependency ou handoff'
    });
  }

  const review = firstMatch(normalized, rule.review || []);
  if (review) {
    return printResult(io, {
      status: 'review',
      reason: 'acao depende de decisao fora do contrato direto',
      matched: review,
      recommended: review.includes('ui') || review.includes('design')
        ? 'criar dependency para ui-game'
        : 'pedir decisao ao diretor/arquiteto ou criar dependency'
    });
  }

  const permission = firstMatch(normalized, [...(rule.allowed || []), ...(role.permissions || []), ...(role.responsibilities || [])]);
  if (permission) {
    return printResult(io, {
      status: 'allowed',
      reason: 'acao parece coberta por permissao do contrato',
      matched: permission,
      recommended: 'prosseguir'
    });
  }

  return printResult(io, {
    status: 'review',
    reason: 'acao nao bate claramente com permissoes ou proibicoes',
    matched: 'nenhum',
    recommended: 'pedir decisao ao diretor/arquiteto ou criar dependency'
  });
}

function printResult(io, result) {
  io.log(`status: ${result.status}`);
  io.log(`reason: ${result.reason}`);
  if (result.matched) io.log(`matched: ${result.matched}`);
  if (result.recommended) io.log(`recommended: ${result.recommended}`);
}

function firstMatch(action, patterns) {
  return patterns.find((pattern) => action.includes(normalize(pattern))) || null;
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
