import {
  type BaseMessageSignerWalletAdapter,
  type WalletName,
  WalletAdapterNetwork,
  WalletReadyState,
} from '@solana/wallet-adapter-base';
import { CloverWalletAdapter, CloverWalletName } from '@solana/wallet-adapter-clover';
import { Coin98WalletAdapter, Coin98WalletName } from '@solana/wallet-adapter-coin98';
import { GlowWalletAdapter, GlowWalletName } from '@solana/wallet-adapter-glow';
import { HuobiWalletAdapter, HuobiWalletName } from '@solana/wallet-adapter-huobi';
import { PhantomWalletAdapter, PhantomWalletName } from '@solana/wallet-adapter-phantom';
import { SlopeWalletAdapter, SlopeWalletName } from '@solana/wallet-adapter-slope';
import { SolflareWalletAdapter, SolflareWalletName } from '@solana/wallet-adapter-solflare';
import {
  TokenPocketWalletAdapter,
  TokenPocketWalletName,
} from '@solana/wallet-adapter-tokenpocket';
import type { Connection } from '@solana/web3.js';
import { inPlaceSort } from 'fast-sort';
import isMobile from 'ismobilejs';

import { browser } from '$app/env';

import {
  type WalletMetadata as WalletMetadata,
  type WalletWithMetadata,
  MobileSupportLevel,
} from './types.js';

interface WalletProviderProps {
  connection: Connection;
}

interface WalletBuilder {
  build: (props: WalletProviderProps) => BaseMessageSignerWalletAdapter;
  meta: WalletMetadata;
}

const DEFAULT_WALLET_PROVIDERS: Record<WalletName, WalletBuilder> = {
  [CloverWalletName]: { build: () => new CloverWalletAdapter(), meta: { icon: 'clover' } },
  [Coin98WalletName]: { build: () => new Coin98WalletAdapter(), meta: { icon: 'coin98' } },
  [GlowWalletName]: {
    build: () => new GlowWalletAdapter(),
    meta: { icon: 'glow', ios: { type: MobileSupportLevel.InAppBrowser } },
  },
  [HuobiWalletName]: { build: () => new HuobiWalletAdapter(), meta: { icon: 'huobi' } },
  [PhantomWalletName]: {
    build: () => new PhantomWalletAdapter(),
    meta: { icon: 'phantom', ios: { type: MobileSupportLevel.InAppBrowser } },
  },
  [SlopeWalletName]: { build: () => new SlopeWalletAdapter(), meta: { icon: 'slope' } },
  [SolflareWalletName]: {
    build: ({ connection }) => {
      const network = getWalletAdapterNetwork(connection);
      return new SolflareWalletAdapter({ network });
    },
    meta: { icon: 'solflare' },
  },
  [TokenPocketWalletName]: {
    build: () => new TokenPocketWalletAdapter(),
    meta: { icon: 'tokenPocket' },
  },
  // [TorusWalletName]: {
  //   build: ({ connection }) => {
  //     const params = {
  //       apiKey: env.VITE_WEB3_AUTH_CLIENT_ID,
  //       network: getWalletAdapterNetwork(connection),
  //     };

  //     return new TorusWalletAdapter({ params });
  //   },
  //   meta: {
  //     icon: 'torus',
  //     android: { type: MobileSupportLevel.WebBased },
  //     ios: { type: MobileSupportLevel.WebBased },
  //   },
  // },
};

/**
 * Create the wallets from the given connection.
 */
export function createWallets(connection: Connection): BaseMessageSignerWalletAdapter[] {
  const wallets: BaseMessageSignerWalletAdapter[] = [];

  for (const { build } of Object.values(DEFAULT_WALLET_PROVIDERS)) {
    const wallet = build({ connection });
    wallets.push(wallet);
  }

  return wallets;
}

/**
 * Get the adapter network to use based on the provided connection.
 */
function getWalletAdapterNetwork(connection: Connection): WalletAdapterNetwork {
  return connection.rpcEndpoint.includes(WalletAdapterNetwork.Mainnet)
    ? WalletAdapterNetwork.Mainnet
    : connection.rpcEndpoint.includes(WalletAdapterNetwork.Testnet)
    ? WalletAdapterNetwork.Testnet
    : WalletAdapterNetwork.Devnet;
}

function supportsDevice(
  meta: Pick<WalletMetadata, 'android' | 'ios'>,
  userAgent: string | undefined,
): boolean {
  const { android, apple, any } = isMobile(userAgent);

  if (android.device) {
    return ![undefined, MobileSupportLevel.None].includes(meta.android?.type);
  }

  if (apple.device) {
    return ![undefined, MobileSupportLevel.None].includes(meta.ios?.type);
  }

  if (any) {
    return [meta.ios?.type, meta.android?.type].includes(MobileSupportLevel.WebBased);
  }

  // Assume not mobile device which are all supported.
  return true;
}

export function getWalletProviders(
  wallets: Map<WalletName, BaseMessageSignerWalletAdapter>,
  userAgent?: string,
): readonly WalletWithMetadata[] {
  const walletsWithMetadata: WalletWithMetadata[] = [];
  userAgent = browser ? window.navigator.userAgent : userAgent;

  for (const [name, info] of Object.entries(DEFAULT_WALLET_PROVIDERS)) {
    const adapter = wallets.get(name as WalletName);

    if (
      // No wallet found.
      !adapter ||
      // On mobile only display devices that can be loaded in some way.
      !supportsDevice(info.meta, userAgent) ||
      // No unsupported wallets
      (browser && adapter.readyState === WalletReadyState.Unsupported)
    ) {
      continue;
    }

    const { icon } = info.meta;
    const isInstalled = adapter.readyState === WalletReadyState.Installed;
    // const mobileLevel =

    walletsWithMetadata.push({ adapter, icon, isInstalled });
  }

  inPlaceSort(walletsWithMetadata).by([
    {
      desc: (provider) => {
        return browser ? provider.adapter.readyState === WalletReadyState.Installed : true;
      },
    },
    { asc: (provider) => provider.adapter.name },
  ]);

  return walletsWithMetadata;
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
