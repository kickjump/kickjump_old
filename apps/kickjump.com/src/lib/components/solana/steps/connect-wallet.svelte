<script lang="ts" context="module">
  import { quintIn } from 'svelte/easing';
  import { type FlyParams, fly } from 'svelte/transition';

  import LoadingBars from '$components/icon/loading-bars.svelte';
  import { ModalTitle } from '$components/modal';
  import StepLayout from '$components/solana/steps/step-layout.svelte';
  import { solana } from '$stores/solana';

  import { WALLET_RESULTS_ID } from './constants.js';
  import { StepContext } from './step-context.js';

  const FLY_IN: FlyParams = { duration: 400, easing: quintIn, y: 75 };
</script>

<script lang="ts">
  let newConnection = false;
  $: ({ data, previousStep, step, jumpToStep, addError, addSuccess } = StepContext.context);
  $: selectedWallet = $data.selectedWallet;
  $: connected = $solana.connected;

  $: if (selectedWallet && !connected) {
    $solana
      .selectWallet(selectedWallet.adapter.name)
      .then(() => {
        newConnection = true;
        return $solana.connect();
      })
      .then(() => {})
      .catch((error) => {
        addError(error instanceof Error ? error.message : 'Something went wrong... 😢');
        jumpToStep(WALLET_RESULTS_ID);
      });
  }

  $: if (selectedWallet?.adapter.name === $solana.name && connected && newConnection) {
    addSuccess(`${selectedWallet?.adapter.name} connected successfully!`);
    jumpToStep(WALLET_RESULTS_ID);
  }
</script>

{#if $data.selectedWallet}
  <StepLayout>
    <svelte:fragment slot="content">
      {#key $step}
        <div class="row-[1/1] col-[1/1] grid place-items-center" in:fly={FLY_IN}>
          <ModalTitle as="h3" class="text-center">Connecting...</ModalTitle>
          <p>
            Please unlock your {$data.selectedWallet?.adapter.name} wallet.
          </p>
          <div class="h-8" />
          <div>
            <LoadingBars size={80} class="text-primary/50" />
          </div>
          <div class="h-8" />
          <p class="text-center text-xs">
            Having trouble?{' '}
            <button
              class="inline bold underline underline-offset-1"
              on:click={() => previousStep()}
            >
              Go back
            </button>
          </p>
        </div>
      {/key}
    </svelte:fragment>
  </StepLayout>
{/if}
