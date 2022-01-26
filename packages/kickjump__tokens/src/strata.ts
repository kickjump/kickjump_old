/**
 * This is server side strata code and I'm not yet sure how to extract the user wallet.
 *
 * TODO think this through and extract the user wallet.
 */

import type { Provider } from '@project-serum/anchor';
import type { PublicKey } from '@solana/web3.js';
import type { IBuyArgs, IInitializeCurveArgs } from '@strata-foundation/spl-token-bonding';
import { ExponentialCurveConfig, SplTokenBonding } from '@strata-foundation/spl-token-bonding';
import type {
  ICreateCollectiveArgs,
  ICreateSocialTokenArgs,
} from '@strata-foundation/spl-token-collective';
import { SplTokenCollective } from '@strata-foundation/spl-token-collective';
import { getAssociatedAccountBalance, SplTokenMetadata } from '@strata-foundation/spl-utils';

import type { StrataBondingProp } from '.';
import type { AnchorProviderProp, StrataSdks, StrataSdksProp } from './types';

export async function getSdks(provider: Provider): Promise<StrataSdks> {
  const [bonding, collective, metadata] = await Promise.all([
    SplTokenBonding.init(provider),
    SplTokenCollective.init(provider),
    SplTokenMetadata.init(provider),
  ]);

  return { collective, bonding, metadata };
}

interface CreateSocialTokenProps
  extends ICreateSocialTokenArgs,
    StrataSdksProp,
    AnchorProviderProp {}

export async function createSocialToken(props: CreateSocialTokenProps) {
  const { provider, sdks, ...rest } = props;
  const { collective } = sdks;
  return collective.createSocialToken(rest);
}

interface CreateCollectiveProps extends ICreateCollectiveArgs, StrataSdksProp, AnchorProviderProp {}

export async function createCollective(props: CreateCollectiveProps) {
  const { provider, sdks, ...rest } = props;
  const { collective } = sdks;
  return collective.createCollective(rest);
}

interface BuySocialTokenProps extends IBuyArgs, StrataSdksProp, AnchorProviderProp {
  baseMint: PublicKey;
}

export async function buySocialToken(props: BuySocialTokenProps) {
  const { provider, sdks, baseMint, ...rest } = props;
  const { bonding } = sdks;

  await bonding.buy(rest);
  return getAssociatedAccountBalance(provider.connection, provider.wallet.publicKey, baseMint);
}

type ExponentialCurveConfigProps = ConstructorParameters<typeof ExponentialCurveConfig>[0];
interface CreateExponentialCurveProps
  extends StrataBondingProp,
    Pick<IInitializeCurveArgs, 'payer'> {
  curve?: ExponentialCurveConfigProps;
}

export async function createExponentialCurve(props: CreateExponentialCurveProps) {
  const { bonding, payer, curve = DEFAULT_CURVE } = props;

  return bonding.initializeCurve({ payer, config: new ExponentialCurveConfig(curve) });
}

const DEFAULT_CURVE = {
  c: 0.001,
  b: 0,
  pow: 1,
  frac: 2,
};
