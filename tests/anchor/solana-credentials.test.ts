import { type Program, AnchorProvider, setProvider, workspace } from '@project-serum/anchor';
import type { SolanaCredentials } from 'solana-credentials';
import { expect, test } from 'vitest';

// Configure the client to use the local cluster.
setProvider(AnchorProvider.env());

const program = workspace.Credentials as Program<SolanaCredentials>;

test('can initialize', async () => {
  const tx = program.methods.initialize();
  expect(tx, 'transaction signature').toBeTruthy();
});
