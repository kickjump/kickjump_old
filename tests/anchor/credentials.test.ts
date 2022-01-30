import type { Program } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import type { Credentials } from 'solana-credentials';
import { describe, it } from 'vitest';

describe('credentials', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Credentials as Program<Credentials>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log('Your transaction signature', tx);
  });
});
