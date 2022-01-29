import bs58 from 'bs58';
import * as s from 'superstruct';
import nacl from 'tweetnacl';

import { log } from '~/utils/core';
import { getWalletMessage } from '~/utils/solana';

export const VerifySolanaPublicKey = s.type({
  publicKey: s.string(),
  signature: s.string(),
});

export type SolanaKeyData = s.Infer<typeof VerifySolanaPublicKey>;

interface ValidateSolanaPublicKeyProps extends SolanaKeyData {
  type: 'connect' | 'login';

  /**
   * The nonce is sent in a separately encrypted header cookie to the public key
   * and signature so that if the request is intercepted it can't be used to
   * validate the public key improperly.
   */
  nonce: string;
}

/**
 * Will throw an error if the public key is not valid.
 */
export function verifySolanaPublicKey(props: ValidateSolanaPublicKeyProps) {
  const { type, publicKey, signature, nonce } = props;
  const messageBytes = new TextEncoder().encode(getWalletMessage({ nonce, type }));
  const publicKeyBytes = bs58.decode(publicKey);
  const signatureBytes = bs58.decode(signature);

  if (!nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)) {
    log.error(`solana public key validation failed`);
    throw new Error('The provided solana public key could not be validated.');
  }
}
