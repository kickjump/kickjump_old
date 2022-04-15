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
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';

import { Logo } from '../icons';
import { ConnectingAnimation } from './connecting-animation';
import { useStepContainer } from './step-select-wallet';
import { type StepProps, WalletStep } from './types';

export const StepConnectWallet = (props: StepProps) => {
  const { previousStep, setStep, activeStep } = props;
  const { title } = activeStep;
  const { selectedProvider } = useStepContainer();

  const walletProviderInfo = selectedProvider?.info;
  const icon = !selectedProvider?.info ? (
    <></>
  ) : typeof selectedProvider.info.icon === 'string' ? (
    <img src={selectedProvider.info.icon} alt={`Icon for wallet ${selectedProvider.info.name}`} />
  ) : (
    <selectedProvider.info.icon />
  );
  const { connect, connected, wallet } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      await connect();
      setError(null);
    } catch (error_) {
      setError((error_ as Error).message);
    }
  }, [connect]);

  // attempt to activate the wallet on initial load
  useEffect(() => {
    // delay so people can see a message
    const timeout = setTimeout(() => {
      connectWallet();
    }, 1);
    return () => clearTimeout(timeout);
    // only run this on the first display of this modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close modal only when the wallet is connected
  useEffect(() => {
    if (wallet && connected) {
      setStep(WalletStep.Login);
    }
  }, [wallet, connected, setStep]);

  if (!selectedProvider) {
    return null;
  }

  return (
    <>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody overflowY='scroll'>
        <ConnectingWrapper>
          {error ? (
            <ConnectingHeader>
              <Connecting>Error connecting wallet</Connecting>
              <ConnectingInstructions>{error}</ConnectingInstructions>
              <ConnectingInstructions>
                <Link
                  as={Button}
                  color='#696969'
                  fontWeight='bold'
                  href='#'
                  onClick={() => {
                    connectWallet();
                  }}
                >
                  Retry
                </Link>
              </ConnectingInstructions>
            </ConnectingHeader>
          ) : (
            <ConnectingHeader>
              <Connecting>Connecting...</Connecting>
              <ConnectingInstructions>
                Please unlock your {walletProviderInfo?.name} wallet.
              </ConnectingInstructions>
            </ConnectingHeader>
          )}
          <AppIconsWrapper>
            <AppIcons>
              {icon}
              <ConnectingAnimation />
              <Logo size='48px' />
            </AppIcons>
          </AppIconsWrapper>
        </ConnectingWrapper>
      </ModalBody>

      <ModalFooter>
        <Text>
          Having trouble?{' '}
          <Link
            as={Button}
            href='#'
            onClick={() => {
              previousStep();
            }}
          >
            Go back
          </Link>
        </Text>
      </ModalFooter>
    </>
  );
};

const ConnectingHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 68px;
  margin-bottom: 71px;
`;

const Connecting = styled.h2`
  margin: 0;
  font-weight: bold;
  font-size: 24px;
  line-height: 29px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #000000;
`;

const ConnectingInstructions = styled.p`
  margin: 0;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #696969;
`;

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;

  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const AppIcons = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  grid-column-gap: 20px;
  align-items: center;
  width: 192px;

  & > img,
  & > svg {
    width: 48px;
    height: 48px;
  }
`;

const AppIconsWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ConnectingWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100% - 154px);

  background: #f9f9f9;
  border-radius: 32px 32px 8px 8px;

  animation: fadeIn 0.2s forwards;
  animation-timing-function: ease-out;

  @keyframes fadeIn {
    0% {
      bottom: -300px;
    }
    100% {
      bottom: 0;
    }
  }
`;
