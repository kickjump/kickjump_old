/**
 * `true` when a reserved word is passed in.
 */
export async function isReserved(name: string) {
  const { RESERVED_USERNAMES } = await import('./reserved.js');
  return RESERVED_USERNAMES.has(name);
}

/**
 * `true` when a reserved word is passed in.
 */
export async function isProfanity(name: string) {
  const { PROFANE_WORDS } = await import('./profane.js');
  return PROFANE_WORDS.has(name);
}

export async function isReservedOrProfanity(name: string) {
  return (await isReserved(name)) || (await isProfanity(name));
}
