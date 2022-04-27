<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { addUrlParams, getUrlParam } from '$utils/url';

  import Button from '$components/buttons/button.svelte';
  import { Modal, type ModalCloseMethod } from '$components/modal';
  import { ConnectWallet, CONNECT_WALLET_ID } from './steps/connect';
  import { SelectWallet, SELECT_WALLET_ID } from './steps/select';
  import StepProvider from './steps/step-provider.svelte';
  import Step from './steps/step.svelte';

  const stepIds = [SELECT_WALLET_ID, CONNECT_WALLET_ID] as const;
  let open: boolean = getUrlParam($page.url, 'steps') === '1';
  let initialStep = getUrlParam($page.url, 'stepId') || stepIds[0];

  // Need a way to differentiate depending on how the modal was closed.
  async function onClose(method?: ModalCloseMethod) {
    // ignore escape and clicking outside the modal
    if (method === 'event') return;

    if (method === 'close-button') {
      let url = addUrlParams({
        params: { stepId: undefined, steps: undefined },
        href: location.href,
      });

      await goto(url, {});
    }

    open = false;
  }
</script>

<Button onClick={() => (open = !open)} theme="default" variant="solid" rightIcon="solana">
  Login with solana
</Button>
<StepProvider {stepIds} {initialStep} onFinish={() => (open = false)}>
  <Modal {open} {onClose} class="my-14 mx-4 sm:mx-0" sectionClass="max-w-md grid">
    <svelte:fragment slot="custom">
      <Step id={SELECT_WALLET_ID}>
        <SelectWallet />
      </Step>
      <Step id={CONNECT_WALLET_ID}>
        <ConnectWallet />
      </Step>
    </svelte:fragment>
  </Modal>
</StepProvider>
