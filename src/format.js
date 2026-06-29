export function printRole(io, role) {
  io.log(`role: ${role.name}`);
  io.log(`contrato: ${role.contract}`);
  io.log(`permissoes: ${formatList(role.permissions)}`);
  io.log(`proibicoes: ${formatList(role.prohibitions)}`);
}

export function printChecklist(io, role) {
  io.log(`checklist: ${formatList(role.completionChecklist)}`);
}

export function printContractSummary(io, role) {
  io.log(`objetivo: ${role.objective || role.contract}`);
  io.log(`responsabilidades: ${formatList(role.responsibilities)}`);
  io.log(`dependency: ${role.createDependencyWhen || 'nao definido'}`);
  io.log(`handoff: ${role.createHandoffWhen || 'nao definido'}`);
}

export function printTask(io, task) {
  if (!task) {
    io.log('tarefa atual: nenhuma');
    return;
  }
  io.log(`tarefa atual: ${task.title}`);
  io.log(`id: ${task.id}`);
  io.log(`status: ${task.status}`);
  if (task.description) io.log(`descricao: ${task.description}`);
}

export function formatList(items) {
  return items && items.length ? items.join(', ') : 'nenhuma';
}
