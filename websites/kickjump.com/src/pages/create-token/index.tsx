import { ConnectWallet } from '@kickjump/components';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import { Header } from '~/components/header';

const CreateToken: NextPage = () => {
  return (
    <>
      <NextSeo title='Create Token | KickJump' />
      <Header />
      <ConnectWallet />
      <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
        <h1>Create Token</h1>
      </main>
    </>
  );
};

export default CreateToken;
