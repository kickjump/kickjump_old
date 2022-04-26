import { GlowWalletAdapter } from '@solana/wallet-adapter-glow';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { inPlaceSort } from 'fast-sort';
import isMobile from 'ismobilejs';
import { objectEntries } from 'ts-extras';

import { browser } from '$app/env';

import { type ProviderInfo, type WalletProviderInfo, WalletType } from './types';

export const DEFAULT_WALLET_PROVIDERS: Record<WalletType, WalletProviderInfo> = {
  [WalletType.Glow]: {
    name: 'Glow',
    url: 'https://www.glow.app',
    icon: 'glow',
    makeAdapter: () => new GlowWalletAdapter(),

    isInstalled: () => Boolean(window.glow),
    isMobile: true,
  },
  [WalletType.Phantom]: {
    name: 'Phantom',
    url: 'https://www.phantom.app',
    icon: 'phantom',
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

export function getWalletProviders(userAgent?: string): readonly ProviderInfo[] {
  const providers: ProviderInfo[] = [];
  userAgent = browser ? window.navigator.userAgent : userAgent;

  for (const [type, info] of objectEntries(DEFAULT_WALLET_PROVIDERS)) {
    if (isMobile(userAgent).any && !info.isMobile) {
      continue;
    }

    const isUninstalled = browser && info.isInstalled?.() === false;
    const provider: ProviderInfo = { type, info, isUninstalled };

    providers.push(provider);
  }

  inPlaceSort(providers).by([
    { desc: (provider) => (browser ? provider.info.isInstalled?.() ?? true : true) },
    { asc: (provider) => provider.info.name },
  ]);

  return providers;
}

/**
 * Clean up the url to display in the wallet selection item.
 */
export function cleanUrl(url: string) {
  try {
    const name = new URL(url).hostname;

    if (name.startsWith('www.')) {
      return name.slice(4);
    }

    return name;
  } catch {
    return url;
  }
}
