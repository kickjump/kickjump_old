import { type IconProps } from '@chakra-ui/react';
import { type BaseSignerWalletAdapter } from '@solana/wallet-adapter-base';
import { GlowWalletAdapter } from '@solana/wallet-adapter-glow';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { type ComponentType } from 'react';

import { GlowWalletIcon, PhantomWalletIcon } from '../icons/wallet-icons';
import { type WalletProviderInfo, WalletType } from './types';

export const DEFAULT_WALLET_PROVIDERS: Record<WalletType, WalletProviderInfo> = {
  [WalletType.Glow]: {
    name: 'Glow',
    url: 'https://www.glow.app',
    icon: GlowWalletIcon,
    makeAdapter: () => new GlowWalletAdapter(),

    isInstalled: () => Boolean(window.glow),
    isMobile: true,
  },
  [WalletType.Phantom]: {
    name: 'Phantom',
    url: 'https://www.phantom.app',
    icon: PhantomWalletIcon,
    makeAdapter: () => new PhantomWalletAdapter(),

    isInstalled: () => window.solana?.isPhantom === true,
    isMobile: true,
  },
};

declare global {
  interface Window {
    solana?: {
      isPhantom: boolean;
    };
    glow?: unknown;
  }
}
