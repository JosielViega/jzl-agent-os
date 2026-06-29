import { createAgentMessage } from '../agents.js';
import { requireCurrentRole } from '../state.js';

export function sendMessage({ cwd, to, summary, io }) {
  if (!to) throw new Error('Informe destino: --to <role>');
  if (!summary) throw new Error('Informe resumo: --summary "..."');

  const from = requireCurrentRole(cwd);
  const message = createAgentMessage(cwd, {
    from,
    to,
    type: 'message',
    title: `Mensagem para ${to}`,
    summary
  });

  io.log(`mensagem enviada: ${message.id}`);
  io.log(`de: ${from}`);
  io.log(`para: ${to}`);
}
