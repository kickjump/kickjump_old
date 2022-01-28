import type { NextPage } from 'next';

import { Header } from '~/components/header';
import { SignInWithGithub } from '~/components/sign-in-with-github';

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
        <h1>KickJump</h1>
        <p>Welcome to KickJump.</p>
        <SignInWithGithub />
      </main>
    </>
  );
};

export default Home;
