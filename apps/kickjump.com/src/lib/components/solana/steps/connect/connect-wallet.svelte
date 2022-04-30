<script lang="ts" context="module">
  import { quintIn } from 'svelte/easing';
  import { type FlyParams, fly } from 'svelte/transition';

  import LoadingBars from '$components/icon/loading-bars.svelte';
  import { ModalTitle } from '$components/modal';
  import StepLayout from '$components/solana/steps/step-layout.svelte';
  import { solana } from '$stores/solana';
  import { t } from '$utils/intl';

  import { WALLET_RESULTS_ID } from '../results';
  import { StepContext } from '../step-context';

  const FLY_IN: FlyParams = { duration: 400, easing: quintIn, y: 75 };

  export const CONNECT_WALLET_ID = 'connect-wallet' as const;
</script>

<script lang="ts">
  $: ({ data, previousStep, nextStep, step, jumpToStep, addError } = StepContext.context);
  $: name = $data.selectedWallet?.adapter.name;

  $: if (name) {
    $solana
      .selectWallet(name)
      .then(() => {
        return $solana.connect();
      })
      .catch((error) => {
        addError(error instanceof Error ? error.message : 'Something went wrong... 😢');
        jumpToStep(WALLET_RESULTS_ID);
      });
  } else {
    $solana.disconnect();
  }

  $: if (name && $solana.connected) {
    nextStep();
  }
</script>

{#if $data.selectedWallet}
  <StepLayout>
    <svelte:fragment slot="content">
      {#key $step}
        <div class="row-[1/1] col-[1/1] grid place-items-center" in:fly={FLY_IN}>
          <ModalTitle as="h3" class="text-center">
            {$t('walletStep.connectWallet.connecting')}
          </ModalTitle>
          <p
            >{$t('walletStep.connectWallet.unlock', {
              values: { name: $data.selectedWallet?.adapter.name },
            })}
          </p>
          <div class="h-8" />
          <div>
            <LoadingBars size={80} class="text-primary/50" />
          </div>
          <div class="h-8" />
          <p class="text-center text-xs">
            {$t('walletStep.connectWallet.trouble')}{' '}
            <button
              class="inline bold underline underline-offset-1"
              on:click={() => previousStep()}
            >
              {$t('walletStep.connectWallet.back')}
            </button>
          </p>
        </div>
      {/key}
    </svelte:fragment>
  </StepLayout>
{/if}
