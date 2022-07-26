import { WalletError } from '@solana/wallet-adapter-base';

export class WalletNotSelectedError extends WalletError {
  override name = 'WalletNotSelectedError';
}

export class WalletInvalidNameError extends WalletError {
  override name = 'WalletInvalidNameError';
}

export function isWalletError(error: unknown): error is WalletError {
  return error instanceof WalletError;
}
