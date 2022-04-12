import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
// import { ConnectWalletButton } from '@gokiprotocol/walletkit';
import { SolanaIcon } from '@kickjump/components';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';

import { getWalletSignature } from '~/utils/solana';

interface LoginWithSolanaProps {
  hash: string;
}

export const LoginWithSolana = (props: LoginWithSolanaProps) => {
  const { hash } = props;
  // Whether the request for signature can be automated. This is the case when
  // the user is not connected when interacting with this form.
  const [automate, setAutomate] = useState(false);
  const buttonProps = useMemo(() => {}, []);
  // const wallet = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <Lorem count={2} /> */}
            This is the body!
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* <ConnectWalletButton /> */}
    </>
  );
};
