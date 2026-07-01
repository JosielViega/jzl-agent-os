import manifest from './jzl.plugin.json' with { type: 'json' };

export { manifest };

export function activate() {
  const plugin = { manifest };
  return {
    manifest,
    providers: (manifest.providers || []).map((provider) => ({
      ...provider,
      plugin,
      services: {
        status() {
          return {
            branch: 'main',
            modified: false,
            lastCommit: null
          };
        },
        lastCommit() {
          return null;
        },
        currentBranch() {
          return 'main';
        },
        linkTask({ task }) {
          return { task, commit: null };
        }
      }
    }))
  };
}

export const providers = activate().providers;

