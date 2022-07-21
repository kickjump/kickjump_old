import { createStore, del, get, set } from 'idb-keyval';
import type { Writable } from 'svelte/store';

/**
 * A store that keep it's value in time.
 */
export interface PersistentStore<T> extends Writable<T> {
  /**
   * Delete the store value from the persistent storage
   */
  delete: () => void;
}

/**
 * Storage interface
 */
export interface StorageInterface<T> {
  /**
   * Get a value from the storage.
   *
   * If the value doesn't exists in the storage, `null` should be returned.
   * This method MUST be synchronous.
   * @param key The key/name of the value to retrieve
   */
  getValue: (key: string) => T | null;

  /**
   * Save a value in the storage.
   * @param key The key/name of the value to save
   * @param value The value to save
   */
  setValue: (key: string, value: T) => void;

  /**
   * Remove a value from the storage
   * @param key The key/name of the value to remove
   */
  deleteValue: (key: string) => void;
}

export interface SelfUpdateStorageInterface<T> extends StorageInterface<T> {
  /**
   * Add a listener to the storage values changes
   * @param key The key to listen
   * @param listener The listener callback function
   */
  addListener: (key: string, listener: (newValue: T) => void) => void;
  /**
   * Remove a listener from the storage values changes
   * @param key The key that was listened
   * @param listener The listener callback function to remove
   */
  removeListener: (key: string, listener: (newValue: T) => void) => void;
}

/**
 * Make a store persistent
 * @param store The store to enhance
 * @param storage The storage to use
 * @param key The name of the data key
 */
export function persist<T>(
  store: Writable<T>,
  storage: StorageInterface<T>,
  key: string,
): PersistentStore<T> {
  const initialValue = storage.getValue(key);

  if (null !== initialValue) {
    store.set(initialValue);
  }

  if ((storage as SelfUpdateStorageInterface<T>).addListener) {
    (storage as SelfUpdateStorageInterface<T>).addListener(key, (newValue) => {
      store.set(newValue);
    });
  }

  store.subscribe((value) => {
    storage.setValue(key, value);
  });

  return {
    ...store,
    delete() {
      storage.deleteValue(key);
    },
  };
}

/**
 * Storage implementation that use the browser IndexedDB
 */
export function indexedDBStorage<T>(): SelfUpdateStorageInterface<T> {
  if (
    typeof indexedDB !== 'object' ||
    typeof window === 'undefined' ||
    typeof window?.indexedDB !== 'object'
  ) {
    console.warn('Unable to find the IndexedDB. No data will be persisted.');
    return noopSelfUpdateStorage();
  }

  const database = createStore('svelte-persist', 'persist');
  const listeners: Array<{ key: string; listener: (newValue: T) => void }> = [];
  const listenerFunction = (eventKey: string, newValue: T) => {
    if (newValue === undefined) {
      return;
    }

    for (const { listener } of listeners.filter(({ key }) => key === eventKey)) {
      listener(newValue);
    }
  };
  return {
    addListener(key: string, listener: (newValue: any) => void) {
      listeners.push({ key, listener });
    },
    removeListener(key: string, listener: (newValue: any) => void) {
      const index = listeners.indexOf({ key, listener });

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    },
    getValue(key: string): T | null {
      get(key, database).then((value) => listenerFunction(key, value));
      return null;
    },
    setValue(key: string, value: T): void {
      set(key, value, database);
    },
    deleteValue(key: string): void {
      del(key, database);
    },
  };
}

/**
 * Storage implementation that do nothing
 */
export function noopStorage(): StorageInterface<any> {
  return {
    getValue(): null {
      return null;
    },
    deleteValue() {
      // Do nothing
    },
    setValue() {
      // Do nothing
    },
  };
}

function noopSelfUpdateStorage(): SelfUpdateStorageInterface<any> {
  return {
    addListener() {
      // Do nothing
    },
    removeListener() {
      // Do nothing
    },
    getValue(): null {
      return null;
    },
    deleteValue() {
      // Do nothing
    },
    setValue() {
      // Do nothing
    },
  };
}
