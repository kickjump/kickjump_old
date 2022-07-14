import type { WalletWithMetadata } from '$stores/solana';

export const SELECT_WALLET_ID = 'select-wallet';
export const CONNECT_WALLET_ID = 'connect-wallet';
export const LOGIN_WITH_WALLET_ID = 'login-with-wallet';
export const WALLET_RESULTS_ID = 'results';

declare module './step-context' {
  interface StepContextData {
    /**
     * The chosen provider by the user.
     */
    selectedWallet?: WalletWithMetadata;

    /**
     * True when the providers have already been loaded since the last
     * refresh. Prevents the loading skeleton from being shown on every render
     * of the providers.
     */
    walletsLoadedInBrowser?: boolean;
  }
}

declare module '$utils/url' {
  export interface KnownUrlParams {
    /**
     * The current step id.
     */
    stepId: string | undefined;

    /**
     * The steps def
     */
    steps: string | undefined;
  }
}
