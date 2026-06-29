import { listInboxAll, listPendingDependencies, readJournalEntries } from '../agents.js';
import { getCurrentTask, getRole, requireCurrentRole } from '../state.js';

export function runPreflight({ cwd, io, throwOnBlocked = false }) {
  const result = evaluatePreflight(cwd);
  printPreflight(io, result);
  if (throwOnBlocked && result.status !== 'passed') {
    throw new Error(`Preflight falhou: ${result.problems.join('; ')}`);
  }
  return result;
}

export function evaluatePreflight(cwd) {
  const roleName = requireCurrentRole(cwd);
  const role = getRole(cwd, roleName);
  const task = getCurrentTask(cwd, roleName);
  const problems = [];
  const recommendations = [];

  if (!task) {
    problems.push('nenhuma task atual');
    recommendations.push('rode jzl task take --id <id>');
    return { status: 'blocked', problems, recommendations };
  }

  const dependencies = listPendingDependencies(cwd, roleName, task.id);
  if (dependencies.length) {
    problems.push(`dependencies pending: ${dependencies.map((item) => item.id).join(', ')}`);
    recommendations.push('resolva ou aguarde dependencies antes de concluir');
  }

  const unreadRelated = listInboxAll(cwd, roleName)
    .filter((item) => item.status === 'unread')
    .filter((item) => (item.relatedTaskId || item.taskId) === task.id);
  if (unreadRelated.length) {
    problems.push(`mensagens unread relacionadas: ${unreadRelated.map((item) => item.id).join(', ')}`);
    recommendations.push(`rode jzl inbox read --id ${unreadRelated[0].id}`);
  }

  if (!role.contractText && !role.contract) {
    problems.push('contrato da role nao encontrado');
    recommendations.push('rode jzl boot --role <role> ou revise o init');
  }

  if (!role.completionChecklist || !role.completionChecklist.length) {
    problems.push('checklist da role nao encontrado');
    recommendations.push('revise contract/session do agente');
  }

  const journalEntries = readJournalEntries(cwd, roleName).filter((entry) => entry.taskId === task.id);
  if (!journalEntries.length) {
    problems.push('journal sem entrada da task atual');
    recommendations.push('rode jzl journal add --text "..." antes de concluir');
  }

  const blocking = problems.some((problem) => problem.includes('dependencies pending') || problem.includes('mensagens unread') || problem.includes('nenhuma task atual'));
  const status = problems.length ? (blocking ? 'blocked' : 'review') : 'passed';
  return { status, problems, recommendations };
}

function printPreflight(io, result) {
  io.log(`status: ${result.status}`);
  io.log('problemas:');
  if (result.problems.length) {
    for (const problem of result.problems) io.log(`- ${problem}`);
  } else {
    io.log('- nenhum');
  }
  io.log('recomendacoes:');
  if (result.recommendations.length) {
    for (const recommendation of result.recommendations) io.log(`- ${recommendation}`);
  } else {
    io.log('- pode concluir a task');
  }
}
