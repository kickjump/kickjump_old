// import { ConnectWallet } from '@kickjump/components';
import { type MetaFunction, Outlet } from 'remix';

import { Header } from '~/components/header';

export const meta: MetaFunction = () => {
  return { title: 'Create Token | KickJump' };
};

export default function Index() {
  return (
    <>
      <Header />
      {/* <ConnectWallet /> */}
      <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
        <h1>Create Token</h1>
        <Outlet />
      </main>
    </>
  );
}
