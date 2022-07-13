import { ClientAuthenticator } from '@kickjump/svelte-auth/client';

import { page } from '$app/stores';

import { BASE_AUTH } from './constants.js';

export const auth = new ClientAuthenticator({ basePath: BASE_AUTH, page });
