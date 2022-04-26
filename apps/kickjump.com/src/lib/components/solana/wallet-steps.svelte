<script lang="ts">
  import Button from '$components/buttons/button.svelte';
  import { Modal } from '$components/modal';
  import SelectWallet from './steps/select-wallet.svelte';
  import StepWizard from './steps/step-provider.svelte';
  import Step from './steps/step.svelte';

  let isOpen: boolean;

  // Need a way to differentiate depending on how the modal was closed.
  function onClose() {
    isOpen = false;
  }
</script>

<Button onClick={() => (isOpen = !isOpen)} theme="default" variant="solid" rightIcon="solana"
  >Login with solana</Button
>
<StepWizard>
  <Modal bind:isOpen {onClose} class="items-center" sectionClass="max-w-md">
    <div slot="custom" class="py-8 flex flex-col gap-y-4 step-height">
      <Step index={0}>
        <SelectWallet />
      </Step>
    </div>
  </Modal>
</StepWizard>
