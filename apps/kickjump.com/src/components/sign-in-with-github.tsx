import { signIn, signOut, useSession } from 'next-auth/react';

export const SignInWithGithub = () => {
  const session = useSession();

  return (
    <button
      onClick={() => {
        if (session.status === 'authenticated') {
          signOut();
        } else {
          signIn('github');
        }
      }}
    >
      {session.status === 'loading' ? (
        'Loading...'
      ) : session.status === 'unauthenticated' ? (
        <>Sign in with GitHub</>
      ) : (
        'Sign out'
      )}
    </button>
  );
};
