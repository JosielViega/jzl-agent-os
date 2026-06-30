const profiles = new Map();

export function registerProfile(name, profile) {
  if (!name) throw new Error('Profile name obrigatorio.');
  profiles.set(name, profile);
  return profile;
}

export function getProfile(name) {
  return profiles.get(name) || null;
}

export function listProfiles() {
  return [...profiles.entries()].map(([name, profile]) => ({ name, profile }));
}

export function clearProfiles() {
  profiles.clear();
}

