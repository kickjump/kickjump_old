import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as fs from 'node:fs/promises';

import { CONNECTION, FOLDER, SECRET_JSON } from './utils';

// STEP 2 - Generate a New Solana Wallet
const keypair = Keypair.generate();
console.log(`Generated new KeyPair. Wallet PublicKey:`, keypair.publicKey.toString());

//STEP 3 - Write Wallet Secret Key to a .JSON
const secretKey = keypair.secretKey
  .toString() // convert secret key to string
  .split(',') // delimit string by commas and convert to an array of strings
  .map(Number); // convert string values to numbers inside the array

const secret = JSON.stringify(secretKey); //Covert to JSON string

await fs.mkdir(FOLDER);
await fs.writeFile(SECRET_JSON, secret, 'utf8');
console.log('Wrote secret key to secret.json.');

//STEP 4 - Airdrop 1 SOL to new wallet
try {
  const txId = await CONNECTION.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);
  console.log(`Airdrop Transaction Id: ${txId}`);
  console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`);
} catch (error) {
  console.log(error);
}
