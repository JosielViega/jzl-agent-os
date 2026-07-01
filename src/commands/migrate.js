import { runMigration } from '../kernel/index.js';

export function migrateWorkspace({ cwd, io }) {
  const result = runMigration(cwd);

  io.log(`workspace detectado: ${result.workspaceDetected ? 'sim' : 'nao'}`);
  io.log(`layout atual: ${result.before}`);
  io.log(`layout destino: ${result.target}`);
  io.log(`migration executada: ${result.executed.length ? result.executed.join(', ') : 'nenhuma'}`);
  io.log(`arquivos migrados: ${result.movedFiles.length}`);
  for (const file of result.movedFiles) {
    io.log(`- ${file}`);
  }
  io.log(`status final: ${result.after}${result.valid ? ' valido' : ' revisar'}`);
}
