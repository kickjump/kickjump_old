import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import type { Commitment } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';
import { ErrorHandlerProvider } from '@strata-foundation/react';
import { type ReactNode, useMemo } from 'react';

import { StrataProvider } from './strata-provider';

interface SolanaProviderProps {
  children: ReactNode;

  /**
   * @default 'confirmed'
   */
  commitment?: Commitment;
}

export const SolanaProvider = (props: SolanaProviderProps) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const { endpoint, wallets } = useConnectWallet();
  const { children } = props;

  return (
    <ErrorHandlerProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <StrataProvider>{children}</StrataProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorHandlerProvider>
  );
};

function useConnectWallet() {
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Devnet), []);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return { endpoint, wallets };
}
