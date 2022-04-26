import { getContext, setContext } from 'svelte';
import invariant from 'tiny-invariant';

export interface ModalContext {
  close: () => void;
}

const MODAL_CONTEXT = '$$modal-context$$';

export function getModalContext(): ModalContext {
  const context = getContext<ModalContext | undefined>(MODAL_CONTEXT);
  invariant(context, 'Modal context not found');

  return context;
}

export function setModalContext(context: ModalContext) {
  setContext(MODAL_CONTEXT, context);
}
