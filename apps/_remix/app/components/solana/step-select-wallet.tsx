import {
  Button,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useWallet } from '@solana/wallet-adapter-react';
import { inPlaceSort } from 'fast-sort';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { objectEntries } from 'ts-extras';
import { createContainer } from 'unstated-next';

import type { ProviderInfo, StepProps, WalletProviderInfo } from './types';
import { WalletStep } from './types';
import { WalletProviderOption } from './wallet-provider-option';
import { DEFAULT_WALLET_PROVIDERS } from './wallet-providers';

const isInBrowser = typeof document !== 'undefined';

const getWalletProviders = (): readonly ProviderInfo[] => {
  const providers: ProviderInfo[] = [];

  for (const [type, info] of objectEntries(DEFAULT_WALLET_PROVIDERS)) {
    if (isInBrowser && isMobile && !info.isMobile) {
      continue;
    }

    const mustInstall = isInBrowser && info.isInstalled?.() === false;
    const provider: ProviderInfo = { type, info, mustInstall };
    console.log(provider);

    providers.push(provider);
  }

  inPlaceSort(providers).by([
    { desc: (provider) => (isInBrowser ? provider.info.isInstalled?.() ?? true : true) },
    { asc: (provider) => provider.info.name },
  ]);

  return providers;
};

export const { Provider: StepSelectWalletProvider, useContainer: useStepContainer } =
  createContainer(function useWalletSelector() {
    const [selectedProvider, setSelectedProvider] = useState<ProviderInfo>();
    const [installProvider, setInstallProvider] = useState<WalletProviderInfo>();
    const wallet = useWallet();

    return useMemo(
      () => ({
        selectedProvider,
        installProvider,
        setInstallProvider,
        setSelectedProvider,
        wallet,
      }),
      [installProvider, selectedProvider, wallet],
    );
  });

export const StepSelectWallet = (props: StepProps) => {
  const { setStep, activeStep } = props;
  const { title, description } = activeStep;
  const [showUninstalled, setShowUninstalled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [providerInfo, setProviderInfo] = useState<readonly ProviderInfo[]>(getWalletProviders());
  const { setInstallProvider, setSelectedProvider, wallet } = useStepContainer();

  const onSelectFactory = useCallback(
    (info: ProviderInfo) => () => {
      // Allow the wallet to disconnect before attempting to reconnect.
      wallet.disconnect().then(() => {
        setSelectedProvider(info);
        setStep(WalletStep.Connect);
      });
    },
    [wallet, setSelectedProvider, setStep],
  );

  const onInstall = useCallback(
    (info: WalletProviderInfo) => {
      setInstallProvider(info);
      setStep(WalletStep.Install);
    },
    [setInstallProvider, setStep],
  );

  useEffect(() => {
    // wait a second for chrome extensions to load.
    const timeout = setTimeout(() => {
      setLoading(false);
      setProviderInfo(getWalletProviders());
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody overflowY='scroll'>
        <Text>{description}</Text>
        <Wallets>
          <Skeleton isLoaded={!loading} borderRadius='20px'>
            {providerInfo
              .filter((provider) =>
                showUninstalled
                  ? true
                  : !provider.mustInstall || provider.info.isInstalled?.() !== false,
              )
              .map((fullInfo) => {
                const { info: provider } = fullInfo;
                return (
                  <WalletProviderOption
                    key={provider.url}
                    info={provider}
                    onSelect={onSelectFactory(fullInfo)}
                    onInstall={onInstall}
                  />
                );
              })}
          </Skeleton>
        </Wallets>
      </ModalBody>

      <ModalFooter>
        <ShowUninstalledWrapper>
          <ShowUninstalled role='button' onClick={() => setShowUninstalled(!showUninstalled)}>
            {showUninstalled ? 'Hide' : 'Show'} uninstalled wallets
          </ShowUninstalled>
        </ShowUninstalledWrapper>
      </ModalFooter>
    </>
  );
};

const Wallets = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: 65px;
`;

const ShowUninstalled = styled.a`
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ShowUninstalledWrapper = styled.div`
  margin: 24px 0;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;
