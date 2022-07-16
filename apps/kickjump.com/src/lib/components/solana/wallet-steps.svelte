<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$components/buttons/button.svelte';
  import { type ModalCloseMethod, Modal } from '$components/modal';
  import { addUrlParams, getUrlParam } from '$utils/url';

  import ConnectWallet from './steps/connect-wallet.svelte';
  import { CONNECT_WALLET_ID, SELECT_WALLET_ID, WALLET_RESULTS_ID } from './steps/constants.js';
  import SelectWallet from './steps/select-wallet.svelte';
  import Step from './steps/step.svelte';
  import type { StepContext } from './steps/step-context';
  import StepProvider from './steps/step-provider.svelte';
  import WalletResults from './steps/wallet-results.svelte';

  const stepIds = [SELECT_WALLET_ID, CONNECT_WALLET_ID, WALLET_RESULTS_ID] as const;
  let open: boolean = getUrlParam($page.url, 'steps') === '1';
  const initialStep = getUrlParam($page.url, 'stepId') || stepIds[0];

  // Need a way to differentiate depending on how the modal was closed.
  function createOnClose(_context: StepContext) {
    return async (method?: ModalCloseMethod) => {
      if (!open) {
        return;
      }

      // ignore escape and clicking outside the modal
      if (method === 'event') {
        const shouldClose = confirm('Are you sure you want to close the popup?');

        if (!shouldClose) {
          return;
        }
      }

      if (method === 'close-button') {
        const url = addUrlParams({
          params: { stepId: undefined, steps: undefined },
          href: location.href,
        });

        await goto(url, {});
      }

      open = false;
    };
  }
</script>

<Button onClick={() => (open = !open)} theme="default" variant="solid" rightIcon="solana">
  Login with solana
</Button>
<StepProvider {stepIds} {initialStep} onFinish={() => (open = false)} let:context>
  <Modal
    {open}
    onClose={createOnClose(context)}
    class="my-14 mx-4 sm:mx-0"
    sectionClass="max-w-md grid"
  >
    <svelte:fragment slot="custom">
      <Step id={SELECT_WALLET_ID}>
        <SelectWallet />
      </Step>
      <Step id={CONNECT_WALLET_ID}>
        <ConnectWallet />
      </Step>
      <Step id={WALLET_RESULTS_ID}>
        <WalletResults />
      </Step>
    </svelte:fragment>
  </Modal>
</StepProvider>
