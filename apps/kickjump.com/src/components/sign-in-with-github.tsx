import { signIn } from 'next-auth/react';

export const SignInWithGithub = () => {
  return (
    <button
      onClick={() => {
        signIn('github');
      }}
    >
      Sign in with GitHub
    </button>
  );
};
