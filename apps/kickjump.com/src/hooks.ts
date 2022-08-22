import { createMockHandle } from '@kickjump/mocks';
import { handleSession } from '@kickjump/svelte-auth';
import { createTRPCHandle } from '@kickjump/trpc';
import { sequence } from '@sveltejs/kit/hooks';

import { authenticator } from '$server/auth';
import { env } from '$server/env';

const enabled = env.VITE_ENDPOINT_MOCKING_ENABLED === 'true';

export const handle = handleSession(
  { secret: env.SESSION_SECRET, expires: enabled ? 600 : 7 },
  sequence(createMockHandle({ enabled }), authenticator.createAuthHandle(), createTRPCHandle()),
);
