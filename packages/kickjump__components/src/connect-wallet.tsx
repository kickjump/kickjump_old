import { useWallet } from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

const WalletButton = () => {
  const wallet = useWallet();
  const walletId = wallet.publicKey?.toBase58() ?? '';
  return !wallet.connected ? (
    <WalletMultiButton />
  ) : (
    <p>
      <WalletDisconnectButton /> Wallet: {walletId.slice(0, 5)}...{walletId.slice(-6, -1)}
    </p>
  );
};

export const ConnectWallet = () => {
  return (
    <WalletModalProvider>
      <WalletButton />
    </WalletModalProvider>
  );
};
