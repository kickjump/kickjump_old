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

export interface UseStepReturn {
  stepIndex: number;
  activeStep: StepOptions | undefined;
  nextStepIndex: number;
  previousStepIndex: number;
  atStart: boolean;
  atEnd: boolean;
  nextStep: () => void;
  previousStep: () => void;
  /**
   * Set the step to be the given id.
   */
  setStep: (id: string | number) => void;
  /**
   * Set the step to the provided index.
   */
  setStepIndex: (index: number) => void;
}

export interface StepOptions {
  id: string | number;
  title: string;
  description: string;

  /**
   * The component to render.
   */
  Component: ComponentType<StepProps>;
  /**
   * When the step is loaded.
   */
  onEnter?: () => void;
  onFirstEnter?: () => void;

  /**
   * When the step is completed.
   */
  onExit?: () => void;
  onFirstExit?: () => void;

  /**
   * A function to determine whether the step is valid and should be used.
   */
  isValid?: (props: object) => boolean;
}

export interface StepProps extends Omit<UseStepReturn, 'activeStep'> {
  activeStep: StepOptions;
  onClose: () => void;
}

export interface ProviderInfo {
  type: WalletType;
  info: WalletProviderInfo;
  mustInstall: boolean;
}

export const WalletStep = {
  Select: 'select-wallet-provider',
  Install: 'install-wallet-provider',
  Connect: 'connect-wallet-provider',
  Login: 'login-wallet-provider',
} as const;
export type WalletStep = typeof WalletStep[keyof typeof WalletStep];
