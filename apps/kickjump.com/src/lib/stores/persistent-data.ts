import { writable } from 'svelte/store';

import { indexedDBStorage, persist } from './persist/persistent-store.js';

export const showUninstalledWallets = persist(
  writable(false),
  indexedDBStorage(),
  'wallets.showUninstalled',
);
