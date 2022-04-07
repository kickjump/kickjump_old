import { useRouter } from 'next/router';

import { ConnectWithWallet } from '~/components/connect-with-wallet';
import { Layout } from '~/components/layout';
import { SignInWithGithub } from '~/components/sign-in-with-github';

const SignInPage = () => {
  const router = useRouter();
  return (
    <Layout>
      <>
        <h1>Sign In Page</h1>
        <SignInWithGithub />
        <ConnectWithWallet />
        {router.query.error && (
          <p>
            Something went wrong... <span style={{ color: 'red' }}>{router.query.error}</span>
          </p>
        )}
      </>
    </Layout>
  );
};

export default SignInPage;
