import { ConnectWallet } from '@kickjump/components';
import { type WalletContextState, useWallet } from '@solana/wallet-adapter-react';
import { signIn, useSession } from 'next-auth/react';
import { useCallback } from 'react';

import type { InferMutationOutput } from '~/hooks/use-trpc';
import { useMutation, useQuery } from '~/hooks/use-trpc';
import { stringToUint8Array } from '~/utils/core';
import { type WalletMessageType, getWalletMessage } from '~/utils/solana';

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
  ) : status === 'no-wallet' ? (
    <ConnectWallet />
  ) : null;
};

type ConnectionStatus = 'login' | 'connect' | 'no-wallet' | 'already-connected';

/**
 * use the wallet connection
 */
export function useConnectWithWallet() {
  const session = useSession();
  const wallet = useWallet();
  const nonceMutation = useMutation(['userWallet.nonce']);
  const connectMutation = useMutation(['userWallet.connect']);
  const userWalletQuery = useQuery(['userWallet.getAll', { id: session.data?.id as string }], {
    enabled: !!session.data?.id,
  });

  const status: ConnectionStatus = !wallet.publicKey
    ? 'no-wallet'
    : session.status !== 'authenticated'
    ? 'login'
    : userWalletQuery.data?.some((item) => item.publicKey === wallet.publicKey?.toBase58())
    ? 'already-connected'
    : 'connect';

  const getNonce = useCallback(() => nonceMutation.mutateAsync(), [nonceMutation]);

  const connect = useCallback(async () => {
    const data = await getWalletSignature({ wallet, getNonce, type: 'connect', status });

    if (data) {
      await connectMutation.mutateAsync(data);
    }
  }, [wallet, getNonce, status, connectMutation]);

  const login = useCallback(async () => {
    const data = await getWalletSignature({ wallet, getNonce, type: 'login', status });

    if (data) {
      await signIn('solana', data);
    }
  }, [wallet, getNonce, status]);

  return { login, connect, status };
}

interface GetWalletSignature {
  wallet: WalletContextState;
  getNonce: () => Promise<InferMutationOutput<'userWallet.nonce'>>;
  type: WalletMessageType;
  status: ConnectionStatus;
}

async function getWalletSignature(props: GetWalletSignature) {
  const { wallet, getNonce, type, status } = props;

  if (status !== type || !wallet.signMessage || !wallet.publicKey) {
    return;
  }

  await wallet.connect();

  const { nonce } = await getNonce();
  const { default: base58 } = await import('bs58');
  const encodedMessage = stringToUint8Array(getWalletMessage({ nonce, type }));
  const signature = await wallet.signMessage(encodedMessage);
  return { nonce, publicKey: wallet.publicKey.toBase58(), signature: base58.encode(signature) };
}
