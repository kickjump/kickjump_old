import { AnchorProvider } from '@project-serum/anchor';
import { NATIVE_MINT } from '@solana/spl-token';
// import { PublicKey } from '@solana/web3.js';
import {
  ExponentialCurveConfig,
  SplTokenBonding,
  TimeCurveConfig,
} from '@strata-foundation/spl-token-bonding';
// import { getAssociatedAccountBalance } from '@strata-foundation/spl-utils';

const provider = AnchorProvider.local();
const bonding = await SplTokenBonding.init(provider);

const curve = await bonding.initializeCurve({
  config: new TimeCurveConfig()
    .addCurve(
      0,
      new ExponentialCurveConfig({
        c: 1,
        b: 0,
        pow: 1,
        frac: 1,
      }),
    )
    .addCurve(
      2 * 24 * 60 * 60, // 2 days in seconds
      new ExponentialCurveConfig({
        c: 1,
        b: 0,
        pow: 2,
        frac: 1,
      }),
    ),
});

const { baseMint: _ } = await bonding.createTokenBonding({
  curve,
  baseMint: NATIVE_MINT,
  // targetMint:
});
