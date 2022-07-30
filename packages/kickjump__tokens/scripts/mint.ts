import type { UploadMetadataInput } from '@metaplex-foundation/js';
import { bundlrStorage, findMetadataPda, keypairIdentity, Metaplex } from '@metaplex-foundation/js';
import {
  createCreateMetadataAccountV2Instruction,
  DataV2,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMint,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import type { Connection, PublicKey } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import { SystemProgram, Transaction } from '@solana/web3.js';
import { loadJsonFile } from 'load-json-file';

import {
  CONNECTION,
  ENDPOINT,
  MINT_CONFIG,
  MY_TOKEN_METADATA,
  ON_CHAIN_METADATA,
  SECRET_JSON,
} from './utils.js';

const SECRET = await loadJsonFile<number[]>(SECRET_JSON);

/**
 * @param wallet Solana Keypair
 * @param tokenMetadata Metaplex Fungible Token Standard object
 * @returns Arweave url for our metadata json file
 */
async function uploadMetadata(
  wallet: Keypair,
  tokenMetadata: UploadMetadataInput,
): Promise<string> {
  // Create metaplex instance on devnet using this wallet
  const metaplex = Metaplex.make(CONNECTION)
    .use(keypairIdentity(wallet))
    .use(
      bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: ENDPOINT,
        timeout: 60_000,
      }),
    );

  // Upload to Arweave
  const { uri } = await metaplex.nfts().uploadMetadata(tokenMetadata).run();
  console.log(`Arweave URL:`, uri);
  return uri;
}

interface CreateNewMintTransaction {
  connection: Connection;
  payer: Keypair;
  mintKeypair: Keypair;
  destinationWallet: PublicKey;
  mintAuthority: PublicKey;
  freezeAuthority: PublicKey;
}

async function createNewMintTransaction(props: CreateNewMintTransaction) {
  const { connection, payer, mintKeypair, destinationWallet, mintAuthority, freezeAuthority } =
    props;
  // Get the minimum lamport balance to create a new account and avoid rent payments
  const requiredBalance = await getMinimumBalanceForRentExemptMint(connection);
  // Metadata account associated with mint
  const metadataPDA = findMetadataPda(mintKeypair.publicKey);
  // Get associated token account of your wallet
  const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, destinationWallet);

  const createNewTokenTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: requiredBalance,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey, // Mint Address
      MINT_CONFIG.numDecimals, // Number of Decimals of New mint
      mintAuthority, // Mint Authority
      freezeAuthority, // Freeze Authority
      TOKEN_PROGRAM_ID,
    ),
    createAssociatedTokenAccountInstruction(
      payer.publicKey, // Payer
      tokenATA, // Associated token account
      payer.publicKey, // token owner
      mintKeypair.publicKey, // Mint
    ),
    createMintToInstruction(
      mintKeypair.publicKey, // Mint
      tokenATA, // Destination Token Account
      mintAuthority, // Authority
      MINT_CONFIG.numberTokens * 10 ** MINT_CONFIG.numDecimals, // number of tokens
    ),
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        mint: mintKeypair.publicKey,
        mintAuthority: mintAuthority,
        payer: payer.publicKey,
        updateAuthority: mintAuthority,
      },
      {
        createMetadataAccountArgsV2: {
          data: ON_CHAIN_METADATA,
          isMutable: true,
        },
      },
    ),
  );

  return createNewTokenTransaction;
}

async function main() {
  console.log(`---STEP 1: Uploading MetaData---`);
  const userWallet = Keypair.fromSecretKey(new Uint8Array(SECRET));
  const metadataUri = await uploadMetadata(userWallet, MY_TOKEN_METADATA);
  ON_CHAIN_METADATA.uri = metadataUri;

  console.log(`---STEP 2: Creating Mint Transaction---`);
  const mintKeypair = Keypair.generate();
  console.log(`New Mint Address:`, mintKeypair.publicKey.toString());
  const [destinationWallet, mintAuthority, freezeAuthority] = [
    userWallet.publicKey,
    userWallet.publicKey,
    userWallet.publicKey,
  ];

  const newMintTransaction: Transaction = await createNewMintTransaction({
    connection: CONNECTION,
    payer: userWallet,
    mintKeypair,
    destinationWallet,
    mintAuthority,
    freezeAuthority,
  });

  console.log(`---STEP 3: Executing Mint Transaction---`);
  const transactionId = await CONNECTION.sendTransaction(newMintTransaction, [
    userWallet,
    mintKeypair,
  ]);
  console.log(`Transaction ID:`, transactionId);
  console.log(
    `Succesfully minted ${MINT_CONFIG.numberTokens} ${
      ON_CHAIN_METADATA.symbol
    } to ${userWallet.publicKey.toString()}.`,
  );
  console.log(`View Transaction: https://explorer.solana.com/tx/${transactionId}?cluster=devnet`);
  console.log(
    `View Token Mint: https://explorer.solana.com/address/${mintKeypair.publicKey.toString()}?cluster=devnet`,
  );
}

await main();
