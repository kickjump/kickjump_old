import { writable } from 'svelte/store';

const writableSession = writable<App.Session>();
export const session = { subscribe: writableSession.subscribe };
export const setSession = writableSession.set;
