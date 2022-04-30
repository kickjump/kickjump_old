import type { Readable } from 'svelte/store';

export function asReadable<Type, Store extends Readable<Type>>(store: Store): Readable<Type> {
  return { subscribe: store.subscribe };
}
