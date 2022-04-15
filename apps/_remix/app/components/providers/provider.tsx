import { ChakraProvider, theme } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { AuthenticityTokenProvider } from 'remix-utils';

import { useRootLoader } from '~/hooks/use-root-loader';
import { UserContext } from '~/hooks/use-user';

import { SolanaProvider } from './solana-provider';

export interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = (props: AppProviderProps) => {
  const { children } = props;
  const { csrf, user } = useRootLoader();

  return (
    <ChakraProvider theme={theme}>
      {/* <WalletKitProvider
        defaultNetwork='devnet'
        app={{ name: 'KickJump', icon: <Logo size='1em' /> }}
      > */}
      <SolanaProvider>
        <AuthenticityTokenProvider token={csrf}>
          <UserContext.Provider value={user}>{children}</UserContext.Provider>
        </AuthenticityTokenProvider>
      </SolanaProvider>
      {/* </WalletKitProvider> */}
    </ChakraProvider>
  );
};
