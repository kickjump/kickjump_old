import { ConnectWallet, useWallet } from '@kickjump/components';
import { signIn, useSession } from 'next-auth/react';
import { useCallback } from 'react';

import { useTrpcMutation } from '~/hooks/use-trpc';
import { uint8ArrayToString } from '~/utils/core';
import { getWalletMessage } from '~/utils/solana';

/**
 * Connect a solana wallet to your KickJump account.
 *
 * The account must already exist.
 */
export const ConnectWithWallet = () => {
  const { login, status, connect } = useConnectWithWallet();
  return status === 'login' ? (
    <button onClick={login}>Login With Wallet</button>
  ) : status === 'connect' ? (
    <button onClick={connect}>Connect My Wallet</button>
  ) : (
    <ConnectWallet />
  );
};

type ConnectionStatus = 'login' | 'connect' | 'no-wallet';

/**
 * use the wallet connection
 */
export function useConnectWithWallet() {
  const session = useSession();
  const wallet = useWallet();
  const nonceMutation = useTrpcMutation(['adhoc.nonce']);
  const connectMutation = useTrpcMutation(['adhoc.connectWallet']);

  const status: ConnectionStatus =
    session.status !== 'authenticated' ? 'connect' : wallet?.publicKey ? 'login' : 'no-wallet';

  const connect = useCallback(async () => {
    if (status !== 'connect' || !wallet.signMessage || !wallet.publicKey) {
      return;
    }

    const { nonce } = await nonceMutation.mutateAsync();
    const { publicKey } = wallet;

    await wallet.connect();

    const message = getWalletMessage({ nonce, type: 'connect' });
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await wallet.signMessage(encodedMessage);

    await connectMutation.mutateAsync({
      publicKey: publicKey.toBase58(),
      signature: uint8ArrayToString(signature),
    });
  }, [status, wallet, nonceMutation, connectMutation]);

  const login = useCallback(async () => {
    if (status !== 'login' || !wallet.signMessage || !wallet.publicKey) {
      return;
    }

    const { nonce } = await nonceMutation.mutateAsync();
    const { publicKey } = wallet;

    await wallet.connect();

    const message = getWalletMessage({ nonce, type: 'login' });
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await wallet.signMessage(encodedMessage);

    signIn('solana-wallet', { publicKey, signature, nonce });
  }, [status, nonceMutation, wallet]);

  return { login, connect, status };
}
