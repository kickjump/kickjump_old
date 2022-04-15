import type { Provider as AnchorProvider } from '@project-serum/anchor';
import type { SplTokenBonding } from '@strata-foundation/spl-token-bonding';
import type { SplTokenCollective } from '@strata-foundation/spl-token-collective';
import type { SplTokenMetadata } from '@strata-foundation/spl-utils';

export interface StrataSdks extends StrataBondingProp, StrataCollectiveProp, StrataMetadataProp {}

export interface StrataBondingProp {
  bonding: SplTokenBonding;
}

export interface StrataCollectiveProp {
  collective: SplTokenCollective;
}

export interface StrataMetadataProp {
  metadata: SplTokenMetadata;
}

export interface StrataSdksProp {
  sdks: StrataSdks;
}

export interface AnchorProviderProp {
  provider: AnchorProvider;
}

export type { Provider as AnchorProvider } from '@project-serum/anchor';
