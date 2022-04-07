import type { Program } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import type { SolanaCredentials } from 'solana-credentials';
import { expect, test } from 'vitest';

// Configure the client to use the local cluster.
anchor.setProvider(anchor.Provider.env());

const program = anchor.workspace.Credentials as Program<SolanaCredentials>;

test('can initialize', async () => {
  const tx = program.methods.initialize();
  expect(tx, 'transaction signature').toBeTruthy();
});
