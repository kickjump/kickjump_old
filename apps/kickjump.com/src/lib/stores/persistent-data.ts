import { indexedDBStorage, persist } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export const showUninstalledWallets = persist(
  writable(false),
  indexedDBStorage(),
  'wallets.showUninstalled',
);
