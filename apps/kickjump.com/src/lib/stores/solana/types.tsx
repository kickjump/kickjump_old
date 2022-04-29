import type { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base';

import type { IconType } from '$components/icon';

export enum MobileSupportLevel {
  /**
   * No app exists or there is no way to use the app to send transaction / sign
   * messages from the mobile browser.
   */
  None = 'none',

  /**
   * The user will need to open the wallet app in order to use the in-app
   * browser for access to solana functionality.
   */
  InAppBrowser = 'in-app-browser',

  /**
   * There is no native app, rather the user can connect to the wallet via an
   * API call.
   *
   * Wallet's like Torus have this functionality.
   */
  WebBased = 'web-based',

  /**
   * Native support would mean the user can interact with the wallet directly
   * from the browser.
   *
   * This currently doesn't exist for any providers.
   */
  Native = 'native',
}

type MobileSupport =
  | { type: MobileSupportLevel.None }
  | { type: MobileSupportLevel.InAppBrowser }
  | { type: MobileSupportLevel.WebBased }
  | { type: MobileSupportLevel.Native };

export interface WalletMetadata {
  icon: IconType;
  android?: MobileSupport;
  ios?: MobileSupport;
}

export interface WalletWithMetadata {
  icon: IconType;
  adapter: BaseMessageSignerWalletAdapter;
  mobileLevel?: MobileSupportLevel;
  isInstalled: boolean;
}
