import { Button, Modal, ModalContent, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { GlowWalletAdapter } from '@solana/wallet-adapter-glow';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SetRequired } from 'type-fest';

// import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import { SolanaIcon } from '~/components/icons';
import { getWalletSignature } from '~/utils/solana';

import { StepConnectWallet } from './solana/step-connect';
import { StepSelectWallet, StepSelectWalletProvider } from './solana/step-select-wallet';
import type { StepOptions, StepProps, UseStepReturn } from './solana/types';
import { WalletStep } from './solana/types';

interface LoginWithSolanaProps {
  hash: string;
}

export const LoginWithSolana = (props: LoginWithSolanaProps) => {
  const { hash } = props;
  // Whether the request for signature can be automated. This is the case when
  // the user is not connected when interacting with this form.
  const [automate, setAutomate] = useState(false);
  const buttonProps = useMemo(() => {}, []);
  const wallet = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const steps = useMemo(
    (): StepOptions[] => [
      {
        title: 'Select Wallet',
        description: 'Choose your wallet provider',
        id: WalletStep.Select,
        Component: StepSelectWallet,
      },
      {
        title: 'Connecting',
        description: 'Connecting to your chosen wallet provider',
        id: WalletStep.Connect,
        Component: StepConnectWallet,
      },
    ],
    [],
  );

  return (
    <>
      <input type='hidden' name='hash' value={hash} />
      {/* <input type='hidden' name='publicKey' value={publicKey} />
      <input type='hidden' name='signature' value={signature} /> */}
      <Button
        bgColor={'#393939'}
        color='white'
        _hover={{ bgColor: '#5e5e5e' }}
        // type='submit'
        // name='_action'
        // value='login-with-solana'
        onClick={onOpen}
        rightIcon={<SolanaIcon fontSize='1.3em' />}
      >
        Login With Solana
      </Button>
      <StepSelectWalletProvider>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent className='h-96'>
            <Steps onClose={onClose} steps={steps} />
          </ModalContent>
        </Modal>
      </StepSelectWalletProvider>
      {/* <ConnectWalletButton /> */}
    </>
  );
};

interface StepsProps {
  onClose: () => void;
  steps: StepOptions[];
}
const Steps = (props: StepsProps) => {
  const { activeStep, ...rest } = useSteps(props);

  if (!activeStep) {
    return null;
  }

  return <activeStep.Component {...rest} activeStep={activeStep} onClose={props.onClose} />;
};

const defaultIsValid = () => true;

function useSteps({ steps, onClose }: StepsProps): UseStepReturn {
  const accessedSteps = useRef(new Set<string | number>());
  const [stepIndex, setStepIndex] = useState(() => {
    return steps.findIndex((step) => step.isValid?.({}) ?? true);
  });

  const stack = useRef<{ stack: Array<string | number>; index: number }>({ stack: [], index: -1 });
  const nextStepIndex = useMemo(() => {
    if (steps.length - 1 <= stepIndex) {
      return steps.length - 1;
    }

    for (let ii = stepIndex + 1; ii < steps.length; ii++) {
      const step = steps[ii];

      if (step && (step.isValid?.({}) ?? true)) {
        return ii;
      }
    }

    return stepIndex;
  }, [stepIndex, steps]);

  const previousStepIndex = useMemo(() => {
    if (stepIndex <= 0) {
      return 0;
    }

    for (let ii = stepIndex - 1; ii >= 0; ii--) {
      const step = steps[ii];

      if (step && (step.isValid?.({}) ?? true)) {
        return ii;
      }
    }

    return stepIndex;
  }, [stepIndex, steps]);

  const activeStep = steps[stepIndex];
  const atEnd = nextStepIndex === stepIndex;
  const atStart = nextStepIndex === stepIndex;

  const nextStep = useCallback(() => {
    if (activeStep) {
      if (!accessedSteps.current.has(activeStep.id)) {
        activeStep.onFirstExit?.();
      }

      activeStep.onExit?.();
    }

    if (atEnd) {
      onClose();
      return;
    }

    setStepIndex(nextStepIndex);
  }, [activeStep, atEnd, nextStepIndex, onClose]);

  const previousStep = useCallback(() => {
    if (atStart) {
      onClose();
      return;
    }

    setStepIndex(previousStepIndex);
  }, [atStart, onClose, previousStepIndex]);

  const setStep = useCallback(
    (id: string | number) => {
      const newIndex = steps.findIndex((step) => step.id === id);

      if (newIndex === stepIndex || newIndex === -1) {
        return;
      }

      setStepIndex(newIndex);
    },
    [stepIndex, steps],
  );

  const back = useCallback(() => {}, []);

  useEffect(() => {
    if (activeStep) {
      accessedSteps.current.add(activeStep.id);
    } else {
      onClose();
    }
  }, [activeStep, onClose]);

  useEffect(() => {
    if (!activeStep) {
      return;
    }

    if (!accessedSteps.current.has(activeStep.id)) {
      activeStep?.onFirstEnter?.();
    }

    activeStep?.onEnter?.();
  }, [activeStep]);

  return useMemo(
    () => ({
      setStep,
      setStepIndex,
      stepIndex,
      activeStep,
      nextStepIndex,
      previousStepIndex,
      atStart,
      atEnd,
      nextStep,
      previousStep,
    }),
    [
      setStep,
      stepIndex,
      activeStep,
      nextStepIndex,
      previousStepIndex,
      atStart,
      atEnd,
      nextStep,
      previousStep,
    ],
  );
}
