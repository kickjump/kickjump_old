import { Heading, Text, VStack } from '@chakra-ui/react';
import { type LinksFunction, type LoaderFunction, type MetaFunction, json } from '@remix-run/node';
import { Outlet, useCatch } from '@remix-run/react';
import { createAuthenticityToken } from 'remix-utils';

import { getUser } from '~/utils/auth.server';

import { Document } from './components/document';
import type { RootLoaderData } from './hooks/use-root-loader';
import unoStylesheetUrl from './uno.css';
import { commitSession, getSession } from './utils/session.server';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: unoStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  charset: 'utf-8',
  title: 'KickJump',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);
  const user = await getUser(request);
  const csrf = createAuthenticityToken(session);
  const headers = { 'Set-Cookie': await commitSession(session) };

  return json<RootLoaderData>({ user, csrf }, { headers });
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Document>
      <VStack h='100vh' justify='center'>
        <Heading>There was an error</Heading>
        <Text>{error.message}</Text>
        <hr />
        <Text>Hey, developer, you should replace this with what you want your users to see.</Text>
      </VStack>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  let message;

  switch (caught.status) {
    case 401:
      message = (
        <Text>Oops! Looks like you tried to visit a page that you do not have access to.</Text>
      );
      break;
    case 404:
      message = <Text>Oops! Looks like you tried to visit a page that does not exist.</Text>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document>
      <VStack h='100vh' justify='center'>
        <Heading>
          {caught.status}: {caught.statusText}
        </Heading>
        {message}
      </VStack>
    </Document>
  );
}
