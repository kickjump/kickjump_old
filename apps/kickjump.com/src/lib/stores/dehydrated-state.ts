import type { DehydratedState } from '@kickjump/query';
import { writable } from 'svelte/store';

import { DEFAULT_DEHYDRATED_STATE } from '../constants.js';

const writableDehydratedState = writable<DehydratedState>(DEFAULT_DEHYDRATED_STATE);
export const dehydratedState = { subscribe: writableDehydratedState.subscribe };
export const setDehydratedState = writableDehydratedState.set;
