import type { Connection } from '@solana/web3.js';
import { writable } from 'svelte/store';

interface WorkSpace {
  connection: Connection;
}

export const workSpace = writable<WorkSpace>();
