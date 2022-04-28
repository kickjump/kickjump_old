import type { BaseSignerWalletAdapter } from '@solana/wallet-adapter-base';

import type { IconType } from '$components/icon';

export interface WalletProviderInfo {
  readonly name: string;
  readonly url: string;
  icon: IconType;
  makeAdapter: WalletAdapterBuilder;
  isInstalled?: () => boolean;
  isMobile?: boolean;
}

export type WalletAdapterBuilder = (
  providerUrl: string,
  endpoint: string,
) => BaseSignerWalletAdapter;

export const WalletType = {
  Glow: 'Glow',
  Phantom: 'Phantom',
} as const;
export type WalletType = typeof WalletType[keyof typeof WalletType];

export interface ProviderInfo {
  type: WalletType;
  info: WalletProviderInfo;
  isUninstalled: boolean;
}
