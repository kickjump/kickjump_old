import { Grid } from '@chakra-ui/react';
import { type ReactNode } from 'react';

import { Header } from './header';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = (props: AppLayoutProps) => {
  return (
    <Grid className='min-h-full' templateRows='auto 1fr auto'>
      <Header />
      <main>{props.children}</main>
      <footer>Footer</footer>
    </Grid>
  );
};
