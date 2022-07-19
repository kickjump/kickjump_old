import { type BinaryLike, createHash, randomBytes } from 'node:crypto';

import { CSRF_HEADER_KEY } from './client.js';
import { ServerError } from './errors.js';

/**
 * Borrowed from https://github.com/nextauthjs/next-auth/blob/fd755bc29e6dea318429bec819eebcaecbdf7529/packages/next-auth/src/core/lib/csrf-token.ts#L25-L54
 *
 * Ensure CSRF Token cookie is set for any subsequent requests.
 * Used as part of the strategy for mitigation for CSRF tokens.
 *
 * Creates a cookie like 'next-auth.csrf-token' with the value 'token|hash',
 * where 'token' is the CSRF token and 'hash' is a hash made of the token and
 * the secret, and the two values are joined by a pipe '|'. By storing the
 * value and the hash of the value (with the secret used as a salt) we can
 * verify the cookie was set by the server and not by a malicous attacker.
 *
 * For more details, see the following OWASP links:
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
 * https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf
 */
export async function createCsrf(props: CreateCsrfProps): Promise<string> {
  const { locals, secret } = props;
  const request = props.request.clone();
  const cookieValue = locals.session.get(PRIVATE_CSRF_KEY);

  // By default set the verification to false.
  locals.csrfTokenIsVerified = false;

  if (typeof cookieValue === 'string') {
    const [csrfToken, csrfTokenHash] = cookieValue.split('|');
    const expectedCsrfTokenHash = createHash('sha256')
      .update(`${csrfToken}${secret}`)
      .digest('hex');

    if (csrfToken && csrfTokenHash === expectedCsrfTokenHash) {
      // The csrf token can only be verified for get requests.
      if (request.method !== 'POST') {
        return csrfToken;
      }

      const contentType = request.headers.get('content-type');
      let formData: FormData | undefined;
      let json: Record<string, unknown> | undefined;

      if (contentType?.startsWith('application/x-www-form-urlencoded')) {
        formData = await request.clone().formData?.();
      } else if (contentType?.startsWith('application/json')) {
        json = await request.json();
      }

      const currentTokenValue =
        json?.[CSRF_KEY] || formData?.get(CSRF_KEY) || request.headers.get(CSRF_HEADER_KEY);

      // If hash matches then we trust the CSRF token value
      // If this is a POST request and the CSRF Token in the POST request matches
      // the cookie we have already verified is the one we have set, then the token is verified!
      locals.csrfTokenIsVerified = csrfToken === currentTokenValue;

      return csrfToken;
    }
  }

  // New CSRF token
  const csrfToken = randomBytes(32).toString('hex');
  const csrfTokenHash = createHash('sha256').update(`${csrfToken}${secret}`).digest('hex');

  // Add the new token to the session.
  await locals.session.set(CSRF_KEY, csrfToken);
  await locals.session.set(PRIVATE_CSRF_KEY as string, `${csrfToken}|${csrfTokenHash}`);

  return csrfToken;
}

interface VerifyCsrfProps {
  locals: App.Locals;
}

/**
 * Verify if a request and session has a valid CSRF token. Throws a server error if not the case.
 */
export function verifyCsrf(props: VerifyCsrfProps) {
  if (!props.locals.csrfTokenIsVerified) {
    throw new ServerError({
      code: 'UnprocessableEntityWebDav',
      message: 'The CSRF has not been verified.',
    });
  }
}

const CSRF_KEY = 'csrf' as const;
const PRIVATE_CSRF_KEY = '__csrf' as const;

interface CreateCsrfProps {
  secret: BinaryLike;
  locals: App.Locals;
  request: Request;
}

declare global {
  namespace App {
    interface Session {
      /**
       * The CSRF token which is automatically added.
       */
      [CSRF_KEY]: string;
    }

    interface Locals {
      /**
       * True when the csrf token has been verified for the request.
       */
      csrfTokenIsVerified: boolean;
    }
  }
}
