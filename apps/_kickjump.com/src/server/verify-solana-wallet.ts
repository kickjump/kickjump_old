import { PublicKey } from '@solana/web3.js';
import { TRPCError } from '@trpc/server';
import base58 from 'bs58';
import nacl from 'tweetnacl';

import type * as s from '~/structs';
import { log, stringToUint8Array } from '~/utils/core';
import { getWalletMessage } from '~/utils/solana';

interface VerifySolanaWallet extends s.VerifySolanaWallet {
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
export function verifySolanaWallet(props: VerifySolanaWallet) {
  const { type, publicKey, signature, nonce } = props;
  const messageBytes = stringToUint8Array(getWalletMessage({ nonce, type }));
  const publicKeyBytes = new PublicKey(publicKey).toBuffer();
  const signatureBytes = base58.decode(signature);
  const verified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

  if (!verified) {
    log.error(`solana public key validation failed`);
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'The provided solana public key could not be verified.',
    });
  }
}
