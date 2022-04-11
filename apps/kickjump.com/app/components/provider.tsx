import { ChakraProvider } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { AuthenticityTokenProvider } from 'remix-utils';

import { useRootLoader } from '~/hooks/use-root-loader';
import { UserContext } from '~/hooks/use-user';

export interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = (props: AppProviderProps) => {
  const { children } = props;
  const { csrf, user } = useRootLoader();

  return (
    <ChakraProvider>
      <AuthenticityTokenProvider token={csrf}>
        <UserContext.Provider value={user}>{children}</UserContext.Provider>
      </AuthenticityTokenProvider>
    </ChakraProvider>
  );
};
