import type { UploadMetadataInput } from '@metaplex-foundation/js';
import type { DataV2 } from '@metaplex-foundation/mpl-token-metadata';
import { Connection } from '@solana/web3.js';
import * as path from 'node:path';

function basePath(...filepaths: string[]) {
  const base = new URL('.', import.meta.url).pathname;
  return path.join(base, ...filepaths);
}

export const FOLDER = basePath('tmp');
export const SECRET_JSON = basePath('tmp/secret.json');
export const ENDPOINT = 'https://api.devnet.solana.com'; //Replace with your RPC Endpoint
export const CONNECTION = new Connection(ENDPOINT);

export const MINT_CONFIG = {
  numDecimals: 6,
  numberTokens: 1337,
};

export const MY_TOKEN_METADATA = {
  name: 'Test Token',
  symbol: 'TEST',
  description: 'This is a test token!',
  image: 'https://URL_TO_YOUR_IMAGE.png', //add public URL to image you'd like to use
};

export const ON_CHAIN_METADATA: DataV2 = {
  name: MY_TOKEN_METADATA.name,
  symbol: MY_TOKEN_METADATA.symbol,
  uri: 'TO_UPDATE_LATER',
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};
