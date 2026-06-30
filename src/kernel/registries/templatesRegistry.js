const templates = new Map();

export function registerTemplate(name, template) {
  if (!name) throw new Error('Template name obrigatorio.');
  templates.set(name, template);
  return template;
}

export function getTemplate(name) {
  return templates.get(name) || null;
}

export function listTemplates() {
  return [...templates.entries()].map(([name, template]) => ({ name, template }));
}

export function clearTemplates() {
  templates.clear();
}

