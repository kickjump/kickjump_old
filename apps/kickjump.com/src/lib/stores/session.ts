import { writable } from 'svelte/store';

const { set: setSession, subscribe } = writable<App.Session>();

export const session = { subscribe };
export { setSession };
