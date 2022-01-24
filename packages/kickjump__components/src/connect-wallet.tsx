import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
  AccountProvider,
  ErrorHandlerProvider,
  StrataSdksProvider,
  ThemeProvider,
  useBondingPricing,
  useStrataSdks,
  useTokenBonding,
  useTokenMetadata,
  useTokenRef,
} from '@strata-foundation/react';
import { Data } from '@strata-foundation/spl-utils';
import React, { type FC, useMemo } from 'react';

export const ConnectWallet: FC = ({ children }) => {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const { endpoint, wallets } = useConnectWallet();

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

// export const ConnectWallet = ({ children }) => (
//   <ThemeProvider>
//     <ErrorHandlerProvider>
//       <Wallet>
//         <StrataSdksProvider>
//           <AccountProvider commitment='confirmed'>{children}</AccountProvider>
//         </StrataSdksProvider>
//       </Wallet>
//     </ErrorHandlerProvider>
//   </ThemeProvider>
// );

function useConnectWallet() {
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Devnet), []);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return { endpoint, wallets };
}
