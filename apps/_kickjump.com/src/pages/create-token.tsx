import '~/polyfill';

import {
  type CreateTokenFormProps,
  ConnectWallet,
  CreateTokenForm,
  useStrata,
} from '@kickjump/components';
import { createCollective, createExponentialCurve, NATIVE_MINT } from '@kickjump/tokens';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useCallback } from 'react';

import { Header } from '~/components/header';
import { clamp } from '~/utils';
import { getUrl } from '~/utils/core';

function useCreateTokenPage() {
  const { sdks, provider } = useStrata();

  const onSubmit: CreateTokenFormProps['onSubmit'] = useCallback(
    async (data) => {
      if (!sdks || !provider) {
        return;
      }

      const { bonding } = sdks;
      const curve = await createExponentialCurve({ bonding });

      const { collective, tokenBonding } = await createCollective({
        provider,
        sdks,
        config: {
          // For now make sure all created collectives are not open.
          isOpen: false,
        },
        metadata: {
          name: data.name,
          symbol: data.symbol,
          uri: getUrl('/sample-collective.json'),
        },
        bonding: {
          curve,
          baseMint: NATIVE_MINT,
          buyBaseRoyaltyPercentage: 0,
          buyTargetRoyaltyPercentage: clamp(data.buyRoyalty * 100, 0, 100),
          sellBaseRoyaltyPercentage: 0,
          sellTargetRoyaltyPercentage: clamp((data.sellRoyalty ?? 0) * 100, 0, 100),
        },
      });

      console.log('Created social token', { collective, tokenBonding });
    },
    [provider, sdks],
  );

  return { sdks, onSubmit, provider };
}

const CreateTokenPage: NextPage = () => {
  const { sdks, onSubmit, provider } = useCreateTokenPage();

  return (
    <>
      <NextSeo title='Create Token | KickJump' />
      <Header />
      <ConnectWallet />
      <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
        <h1>Create Token</h1>
        <div>
          {sdks && provider ? (
            <CreateTokenForm onSubmit={onSubmit} />
          ) : (
            <p>Connect your wallet to create a token</p>
          )}
        </div>
      </main>
    </>
  );
};

export default CreateTokenPage;
