import { agentExists, readAgentContract, readAgentSession } from '../agents.js';
import { getRole } from '../state.js';

export function getAgent(cwd, role) {
  return {
    exists: agentExists(cwd, role),
    role: getRole(cwd, role),
    session: readAgentSession(cwd, role),
    contract: readAgentContract(cwd, role)
  };
}

