import { createAgentMessage, listInbox, listInboxAll } from '../agents.js';

export function sendMessage(cwd, input) {
  return createAgentMessage(cwd, input);
}

export function readInbox(cwd, role, options = {}) {
  return options.all ? listInboxAll(cwd, role) : listInbox(cwd, role);
}

