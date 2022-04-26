import { getContext, setContext } from 'svelte';
import invariant from 'tiny-invariant';

export interface ModalContext {
  close: (method?: Exclude<ModalCloseMethod, 'event'>) => void;
}

const MODAL_CONTEXT = '$$modal-context$$';

export function getModalContext(): ModalContext {
  const context = getContext<ModalContext | undefined>(MODAL_CONTEXT);
  invariant(context, 'Modal context not found');

  return context;
}

interface ModalProps {
  onClose: ModalCloseHandler;
}

export function setModalContext(props: ModalProps): ModalContext {
  const { onClose } = props;
  const context: ModalContext = {
    close: (method = 'context') => onClose(method),
  };

  setContext(MODAL_CONTEXT, context);

  return context;
}

export type ModalCloseHandler = (method?: ModalCloseMethod) => void | Promise<void>;
export type ModalCloseMethod = 'context' | 'event' | 'close-button';
