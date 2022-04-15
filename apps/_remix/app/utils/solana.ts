import type { WalletContextState } from '@solana/wallet-adapter-react';

import { stringToUint8Array } from './core';

/**
 * Get the wallet message on both the server and client.
 *
 * TODO make this use a i18n string - perhaps lingui.
 */
export function getWalletMessage(props: GetWalletMessageProps) {
  return WalletMessage[props.type](props.hash);
}

interface GetWalletMessageProps {
  hash: string;
  type: WalletMessageType;
}

export const WalletMessage = {
  connect: (hash: string) =>
    `Sign this message to connect this wallet to your KickJump account.\n\nSecurity Hash: ${hash}`,
  login: (hash: string) => `Login with your wallet.\n\nSecurity Hash: ${hash}`,
};

export type WalletMessageType = keyof typeof WalletMessage;

interface GetWalletSignature {
  wallet: WalletContextState;
  hash: string;
  type: WalletMessageType;
}

/**
 * Browser method for signing a wallet into the app.
 */
export async function getWalletSignature(props: GetWalletSignature) {
  if (typeof document === 'undefined') {
    // This code should only run in the browser.
    return;
  }

  const { wallet, hash, type } = props;

  if (!wallet.signMessage || !wallet.publicKey) {
    return;
  }

  // Connect with the wallet in the browser.
  await wallet.connect();

  const { default: base58 } = await import('bs58');
  const encodedMessage = stringToUint8Array(getWalletMessage({ hash, type }));
  const signature = await wallet.signMessage(encodedMessage);

  return {
    publicKey: wallet.publicKey.toBase58(),
    signature: base58.encode(signature),
  };
}
