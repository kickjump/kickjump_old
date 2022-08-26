import {
  type BaseMessageSignerWalletAdapter,
  type SendTransactionOptions,
  type WalletError,
  type WalletName,
  WalletNotConnectedError,
  WalletNotReadyError,
  WalletReadyState,
} from '@solana/wallet-adapter-base';
import {
  type PublicKey,
  type Transaction,
  type TransactionSignature,
  clusterApiUrl,
  Connection,
} from '@solana/web3.js';
import { type Emitter, createNanoEvents } from 'nanoevents';
import { type Readable, type Unsubscriber, type Writable, get, writable } from 'svelte/store';

import { browser } from '$app/env';
import { type PersistentStore, indexedDBStorage, persist } from '$stores/persistent-store';

import { isWalletError, WalletInvalidNameError, WalletNotSelectedError } from './solana-errors.js';

export const showUninstalledWallets = persist(
  writable(false),
  indexedDBStorage(),
  'wallets.showUninstalled',
);

interface SendTransactionProps {
  transaction: Transaction;
  options?: SendTransactionOptions;

  /**
   * The connection is optional and will default to the current connection used.
   *
   * You can override this to provide alternative commitment options.
   */
  connection?: Connection;
}

type SendTransaction = (props: SendTransactionProps) => Promise<TransactionSignature>;

export interface SolanaStore {
  /**
   * The connection that is used to communicate with the cluster.
   */
  connection: Connection;

  /**
   * Set to true to automatically connect to the wallet provider when possible.
   */
  autoConnect: boolean;

  /**
   * A map of the wallet providers that are supported. This app only supports
   * message signing wallets since they are needed to verify ownership of a
   * public key.
   */
  wallets: Map<WalletName, BaseMessageSignerWalletAdapter>;

  /**
   * The wallet provider that is currently active.
   */
  wallet: BaseMessageSignerWalletAdapter | undefined;

  /**
   * The base58 public key of the wallet that is currently active.
   */
  publicKey: PublicKey | undefined;

  /**
   * The name of the active wallet provider.
   */
  name: WalletName | undefined;

  /**
   * `true` when the active wallet provider is connected.
   */
  connected: boolean;

  /**
   * `true` if the active wallet provider is currently connecting.
   */
  connecting: boolean;

  /**
   * `true` if the active wallet provider is currently disconnecting.
   */
  disconnecting: boolean;

  /**
   * The state of the active wallet. Ideally this should only be one of:
   *
   * - `WalletReadyState.Installed`
   * - `WalletReadyState.Loadable`
   *
   * Other states can't be used without installation. The app should be set up
   * so that the active wallet can only be a valid ready state.
   */
  ready: WalletReadyState;

  /**
   * Connect to the currently active wallet. This will only connect if there is
   * an active wallet.
   */
  connect: () => Promise<void>;

  /**
   * Disconnect from the currently active wallet. This will only disconnect if
   * there is an active wallet.
   */
  disconnect: () => Promise<void>;

  /**
   * Change the currently active wallet. This is a noop if the wallet is already
   * active.
   */
  selectWallet: (name: WalletName) => Promise<void>;

  /**
   * Send a transaction via the currently active wallet.
   */
  sendTransaction: SendTransaction;
  signAllTransactions: BaseMessageSignerWalletAdapter['signAllTransactions'];
  signMessage: BaseMessageSignerWalletAdapter['signMessage'];
  signTransaction: BaseMessageSignerWalletAdapter['signTransaction'];
}

export type WalletState = Pick<SolanaStore, 'connecting' | 'disconnecting' | 'ready'>;
export interface InitializeProps extends Partial<Pick<SolanaStore, 'autoConnect' | 'connection'>> {
  wallets: BaseMessageSignerWalletAdapter[];
}

export interface SvelteSolanaConstructorProps {
  /**
   * The key used to store the default wallet to connect with.
   *
   * @default 'solana.wallet'
   */
  storageKey?: string;

  /**
   * The connection to use when sending transactions.
   *
   * This can be changed at any time during the runtime.
   *
   * @default `devnet`
   */
  connection?: Connection;
}

export interface SvelteSolanaEvents {
  /**
   * An error originating from the wallet provider.
   */
  walletError: (error: WalletError) => void;
}

const DEFAULT_CONNECTION = new Connection(clusterApiUrl('devnet'), 'processed');

export class SvelteSolana implements Readable<SolanaStore> {
  #emitter: Emitter<SvelteSolanaEvents> = createNanoEvents();
  #store: Writable<SolanaStore>;
  #storage: PersistentStore<WalletName | undefined>;

  get subscribe(): Readable<SolanaStore>['subscribe'] {
    return this.#store.subscribe;
  }

  constructor(props: SvelteSolanaConstructorProps = {}) {
    const { storageKey = 'solana.wallet', connection = DEFAULT_CONNECTION } = props;
    this.#storage = persist(writable(), indexedDBStorage(), storageKey);

    this.#store = writable<SolanaStore>({
      connection,
      autoConnect: false,
      wallets: new Map(),
      wallet: undefined,
      publicKey: undefined,
      name: undefined,
      connected: false,
      connecting: false,
      disconnecting: false,
      ready: WalletReadyState.NotDetected,
      connect: this.#connect,
      disconnect: this.#disconnect,
      selectWallet: this.#selectWallet,
      sendTransaction: this.#sendTransaction,
      signTransaction: this.#signTransaction,
      signAllTransactions: this.#signAllTransactions,
      signMessage: this.#signMessage,
    });

    if (browser) {
      // Ensure the adapter listeners are invalidated before refreshing the page.
      window.addEventListener('beforeunload', () => this.#removeWalletEventListeners());
    }
  }

  initialize = (props: InitializeProps) => {
    const { wallets: list, autoConnect = false, connection = this.#get().connection } = props;
    const wallets = new Map(list.map((wallet) => [wallet.name, wallet]));

    this.#set({ wallets, autoConnect, connection });
  };

  /**
   * Add event listeners like an error listener to the store.
   */
  on = <Event extends keyof SvelteSolanaEvents>(
    event: Event,
    listener: SvelteSolanaEvents[Event],
  ): Unsubscriber => {
    return this.#emitter.on(event, listener);
  };

  removeAllEventListeners = () => {
    this.#removeWalletEventListeners();
    this.#emitter.events = {};
  };

  /**
   * Update the wallet name but leave undefined to reset if wallet not
   * available.
   */
  #updateWalletName = (name?: WalletName) => {
    const { wallets } = this.#get();
    const wallet = name ? wallets.get(name) : undefined;

    if (name && !wallet) {
      this.#throwError(new WalletInvalidNameError(`The wallet "${name}" is not valid.`));
    }

    this.#storage.set(name);
    this.#removeWalletEventListeners();

    this.#set({
      wallet,
      publicKey: wallet?.publicKey ?? undefined,
      name: wallet?.name,
      ready: wallet?.readyState || WalletReadyState.NotDetected,
      connected: wallet?.connected ?? false,
      connecting: wallet?.connecting ?? false,
    });

    if (wallet) {
      this.#addWalletEventListeners(wallet);
    }
  };

  /**
   * Set a value in the store.
   */
  #set(state: Partial<SolanaStore>) {
    this.#store.update((store) => {
      return { ...store, ...state };
    });
  }

  /**
   * Get the current stored value.
   */
  #get = (): SolanaStore => {
    return get(this);
  };

  #connect: SolanaStore['connect'] = async () => {
    const { connected, connecting, disconnecting, wallet, ready } = this.#get();

    if (connected || connecting || disconnecting) {
      return;
    }

    if (!wallet) {
      this.#throwError(new WalletNotSelectedError());
    }

    if (!ready) {
      this.#updateWalletName();
      this.#throwError(new WalletNotReadyError());
    }

    try {
      this.#set({ connecting: true });
      await wallet.connect();
    } catch (error: unknown) {
      this.#updateWalletName();

      if (isWalletError(error)) {
        this.#throwError(error);
      }

      throw error;
    } finally {
      this.#set({ connecting: false });
    }
  };

  #disconnect: SolanaStore['disconnect'] = async () => {
    const { disconnecting, wallet } = this.#get();

    if (disconnecting) {
      return;
    }

    if (!wallet) {
      return this.#updateWalletName();
    }

    try {
      this.#set({ disconnecting: true });
      await wallet.disconnect();
    } finally {
      this.#updateWalletName();
      this.#set({ disconnecting: false });
    }
  };

  #selectWallet: SolanaStore['selectWallet'] = async (newName) => {
    const { name, wallet } = this.#get();

    if (name === newName) {
      return;
    }

    if (wallet) {
      await this.#disconnect();
    }

    this.#updateWalletName(newName);
  };

  #sendTransaction: SolanaStore['sendTransaction'] = async (props) => {
    const { wallet, connected, connection: defaultConnection } = this.#get();
    const { transaction, options, connection = defaultConnection } = props;

    if (!connected) {
      this.#throwError(new WalletNotConnectedError());
    }

    if (!wallet) {
      this.#throwError(new WalletNotSelectedError());
    }

    return wallet.sendTransaction(transaction, connection, options);
  };

  /**
   * Throws the provided error after emitting the event.
   */
  #throwError(error: WalletError): never {
    this.#emitter.emit('walletError', error);
    throw error;
  }

  #signTransaction: SolanaStore['signTransaction'] = async (transaction) => {
    const { wallet, connected } = this.#get();

    if (!connected) {
      this.#throwError(new WalletNotConnectedError());
    }

    if (!wallet) {
      this.#throwError(new WalletNotSelectedError());
    }

    return wallet.signTransaction(transaction);
  };

  #signAllTransactions: SolanaStore['signAllTransactions'] = async (transactions) => {
    const { wallet, connected } = this.#get();

    if (!connected) {
      this.#throwError(new WalletNotConnectedError());
    }

    if (!wallet) {
      this.#throwError(new WalletNotSelectedError());
    }

    return wallet.signAllTransactions(transactions);
  };

  #signMessage: SolanaStore['signMessage'] = async (message) => {
    const { wallet, connected } = this.#get();

    if (!connected) {
      this.#throwError(new WalletNotConnectedError());
    }

    if (!wallet) {
      this.#throwError(new WalletNotSelectedError());
    }

    return wallet.signMessage(message);
  };

  #addWalletEventListeners(wallet: BaseMessageSignerWalletAdapter) {
    wallet.on('error', this.#onError);
    wallet.on('connect', this.#onConnect);
    wallet.on('disconnect', this.#onDisconnect);
    wallet.on('readyStateChange', this.#onReadyStateChange);
  }

  #removeWalletEventListeners() {
    const { wallet } = this.#get();

    if (!wallet) {
      return;
    }

    wallet.off('error', this.#onError);
    wallet.off('connect', this.#onConnect);
    wallet.off('disconnect', this.#onDisconnect);
    wallet.off('readyStateChange', this.#onReadyStateChange);
  }

  #onError = (error: WalletError) => {
    this.#emitter.emit('walletError', error);
  };

  #onConnect = () => {
    const { wallet } = this.#get();

    if (!wallet) {
      return;
    }

    this.#set({ publicKey: wallet.publicKey ?? undefined, connected: wallet.connected });
  };

  #onDisconnect = () => {
    this.#updateWalletName();
  };

  #onReadyStateChange = () => {
    const { wallet } = this.#get();

    if (!wallet) {
      return;
    }

    this.#set({ ready: wallet.readyState });
  };
}

/**
 * This is the solana store which is automatically created. You can create your
 * own instead.
 */
export const solana = new SvelteSolana();
