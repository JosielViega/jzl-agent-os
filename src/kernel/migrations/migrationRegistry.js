const migrations = new Map();

export function registerMigration(migration) {
  if (!migration || !migration.id) throw new Error('Migration invalida.');
  migrations.set(migration.id, migration);
  return migration;
}

export function listMigrations() {
  return [...migrations.values()].sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

export function getMigration(id) {
  return migrations.get(id) || null;
}

export function clearMigrations() {
  migrations.clear();
}
