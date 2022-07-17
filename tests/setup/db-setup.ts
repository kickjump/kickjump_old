import { execa } from 'execa';
import { randomBytes } from 'node:crypto';
import retry from 'p-retry';

const directory = new URL('../../packages/kickjump__edgedb', import.meta.url).pathname;

export default async function globalSetup() {
  const databaseNames: string[] = [];
  process.env.EDGEDB_INSTANCE = await retry(
    async () => {
      const name = `kickjump__testdb_${randomBytes(7).toString('hex')}`;
      databaseNames.push(name);
      await execa('pnpm', ['--dir', directory, 'db:create', name], { stdio: 'inherit' });
      await execa('pnpm', ['--dir', directory, 'migrate:run', '--instance', name], {
        stdio: 'inherit',
      });

      return name;
    },
    { retries: 3 },
  );

  return async () => {
    for (const name of databaseNames) {
      try {
        await execa('pnpm', ['--dir', directory, 'db:remove', name], { stdio: 'inherit' });
      } catch {
        // ignore errors
      }
    }
  };
}
