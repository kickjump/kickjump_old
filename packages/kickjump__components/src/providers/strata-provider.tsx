import type { AnchorProviderProp, StrataSdks, StrataSdksProp } from '@kickjump/tokens';
import { Provider as AnchorProvider } from '@project-serum/anchor';
import { type AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { type Connection, sendAndConfirmRawTransaction } from '@solana/web3.js';
import { SplTokenBonding } from '@strata-foundation/spl-token-bonding';
import { SplTokenCollective } from '@strata-foundation/spl-token-collective';
import { SplTokenMetadata } from '@strata-foundation/spl-utils';
import { createContext, useContext, useMemo, useState } from 'react';
import { useAsync } from 'react-async-hook';

import { type BaseProviderProps } from './types';

const AnchorContext = createContext<AnchorContext>({ awaitingApproval: false });

interface AnchorContext {
  provider?: AnchorProvider;
  awaitingApproval: boolean;
}

interface CreateAnchorProviderProps {
  connection: Connection;
  wallet: AnchorWallet;
  setAwaitingApproval: (status: boolean) => void;
}

/**
 * Create a customised Anchor provider.
 */
function createAnchorProvider(props: CreateAnchorProviderProps) {
  const { connection, wallet, setAwaitingApproval } = props;
  const provider = new AnchorProvider(connection, wallet, {});

  // The default implementation of send does not use the transaction resulting from wallet.signTransaction. So we need to fix it.
  provider.send = async function updatedProviderSend(transaction, signers, options) {
    if (signers === undefined) {
      signers = [];
    }

    if (options === undefined) {
      options = this.opts;
    }

    transaction.feePayer = this.wallet.publicKey;
    const { blockhash } = await this.connection.getRecentBlockhash(options.preflightCommitment);
    transaction.recentBlockhash = blockhash;
    setAwaitingApproval(true);

    try {
      const signed = await this.wallet.signTransaction(transaction);
      setAwaitingApproval(false);

      for (const signer of signers) {
        if (signer) {
          signed.partialSign(signer);
        }
      }

      const rawTransaction = signed.serialize();
      const transactionId = await sendAndConfirmRawTransaction(connection, rawTransaction, options);
      return transactionId;
    } finally {
      setAwaitingApproval(false);
    }
  };

  return provider;
}

function useAnchorContextProvider(): AnchorContext {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [awaitingApproval, setAwaitingApproval] = useState(false);

  return useMemo(() => {
    const context: AnchorContext = { awaitingApproval };

    if (connection && wallet) {
      context.provider = createAnchorProvider({ connection, wallet, setAwaitingApproval });
    }

    return context;
  }, [awaitingApproval, connection, wallet]);
}

const AnchorContextProvider = (props: BaseProviderProps) => {
  const { children } = props;
  const value = useAnchorContextProvider();

  return <AnchorContext.Provider value={value}>{children}</AnchorContext.Provider>;
};

export const StrataContext = createContext<StrataContext>({ loading: true });

export interface StrataContext extends Partial<StrataSdksProp>, Partial<AnchorProviderProp> {
  error?: Error;
  loading: boolean;
}

async function getSdks(
  provider: AnchorProvider | undefined | null,
): Promise<StrataSdks | undefined> {
  if (!provider) {
    return undefined;
  }

  const [bonding, collective, metadata] = await Promise.all([
    SplTokenBonding.init(provider),
    SplTokenCollective.init(provider),
    SplTokenMetadata.init(provider),
  ]);
  // const collective = await SplTokenCollective.init(provider);
  // const bonding = await SplTokenBonding.init(provider);
  // const metadata = await SplTokenMetadata.init(provider);

  return { bonding, collective, metadata };
}

function useStrataSdksProvider() {
  const { provider } = useAnchorProvider();
  const { result: sdks, loading, error } = useAsync(getSdks, [provider]);

  return useMemo(() => ({ sdks, error, loading, provider }), [sdks, loading, error, provider]);
}

const StrataSdksProvider = (props: BaseProviderProps) => {
  const { children } = props;
  const value = useStrataSdksProvider();

  return <StrataContext.Provider value={value}>{children}</StrataContext.Provider>;
};

export const StrataProvider: React.FC = ({ children }) => {
  return (
    <AnchorContextProvider>
      <StrataSdksProvider>{children}</StrataSdksProvider>
    </AnchorContextProvider>
  );
};

/**
 * Get the strata sdks.
 */
export function useStrata(): StrataContext {
  return useContext(StrataContext);
}

/**
 * Get an anchor provider with `signTransaction` wrapped so that it hits the
 * wallet adapter from wallet-adapter-react.
 */
export function useAnchorProvider(): {
  provider?: AnchorProvider;
  awaitingApproval: boolean;
} {
  return useContext(AnchorContext);
}
