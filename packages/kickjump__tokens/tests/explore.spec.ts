// import { GokiSDK } from '@gokiprotocol/client';
import { type Wallet, AnchorProvider } from '@project-serum/anchor';
import { type PublicKey, type Transaction, Keypair } from '@solana/web3.js';
import { expect, test } from 'vitest';

test('can create a wallet', async () => {
  const wallet = new TestWallet();

  const provider = new AnchorProvider(CONNECTION, wallet, {});
  // const goki = GokiSDK.load({ provider });
  expect(provider).toBeTruthy();
});

class TestWallet implements Wallet {
  payer = Keypair.generate();

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    transaction.partialSign(this.payer);
    return transaction;
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    return transactions.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
}

import { Connection } from '@solana/web3.js';

export const ENDPOINT = 'https://api.devnet.solana.com'; // Replace with your RPC Endpoint
export const CONNECTION = new Connection(ENDPOINT);
