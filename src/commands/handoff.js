import { createAgentMessage } from '../agents.js';
import { requireCurrentRole } from '../state.js';

export function createHandoff({ cwd, to, summary, io }) {
  if (!to) throw new Error('Informe destino: --to <role>');
  if (!summary) throw new Error('Informe resumo: --summary "..."');
  const from = requireCurrentRole(cwd);
  const handoff = createAgentMessage(cwd, {
    from,
    to,
    type: 'handoff',
    title: `Handoff para ${to}`,
    summary
  });
  io.log(`handoff criado: ${handoff.id}`);
  io.log(`para: ${to}`);
}
