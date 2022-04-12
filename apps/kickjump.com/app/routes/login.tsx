import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import type { ActionFunction } from '@remix-run/node';
import { type LoaderFunction, json } from '@remix-run/node';
import { Form, useLoaderData, useLocation } from '@remix-run/react';
// eslint-disable-next-line unicorn/prefer-node-protocol
import crypto from 'crypto';
import { SiGithub } from 'react-icons/si';
import { AuthenticityTokenInput } from 'remix-utils';

import { LoginWithSolana } from '~/components/login-with-solana';
import { authenticator } from '~/utils/auth.server';
import { SOLANA_HASH_KEY } from '~/utils/constants';
import { commitSession, getNextUrlFromSession, getSession } from '~/utils/session.server';

interface LoginLoaderData {
  hash: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  // If the user is already authenticated redirect to /dashboard directly
  await authenticator.isAuthenticated(request, {
    successRedirect: await getNextUrlFromSession(request, '/dashboard'),
  });

  const hash = crypto.randomBytes(32).toString('base64');
  const session = await getSession(request);

  // The nonce is only to be read once.
  session.flash(SOLANA_HASH_KEY, hash);

  // Store the nonce in the session.
  const headers = { 'Set-Cookie': await commitSession(session) };

  return json<LoginLoaderData>({ hash }, { headers });
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
};

export default function LoginPage() {
  const location = useLocation();
  const data = useLoaderData<LoginLoaderData>();

  return (
    <Container maxW='lg' py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing='8'>
        <Stack spacing='6'>
          <Stack spacing={{ base: '2', md: '3' }} textAlign='center'>
            <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
              Log in to your account
            </Heading>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
          boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing='6' as={Form} action={`/auth/github${location.search}`} method='post'>
            <AuthenticityTokenInput />
            <Button
              variant='solid'
              type='submit'
              rightIcon={<SiGithub color='#181717' size='1.3em' />}
            >
              Login with GitHub
            </Button>
          </Stack>
          <Stack spacing='6' as={Form} method='post'>
            <input type='hidden' name='hash' value={data.hash} />
            <LoginWithSolana />
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
