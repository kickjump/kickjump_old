import type { Connection } from '@solana/web3.js';
import { writable } from 'svelte/store';

interface Workspace {
  connection: Connection;
}

export const workspace = writable<Workspace>();
