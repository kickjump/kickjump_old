<script lang="ts" context="module">
  import { ModalTitle } from '$components/modal';
  import StepLayout from './step-layout.svelte';
  import { t } from '$utils/intl';
  import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
  import { getStepContext } from './step-context';
  import { SELECT_WALLET_ID } from './select-wallet.svelte';
  import LoadingBars from '$components/icon/loading-bars.svelte';
  import type { WalletName } from '@solana/wallet-adapter-base';
  import { fly, type FlyParams } from 'svelte/transition';
  import { quintIn } from 'svelte/easing';

  const FLY_IN: FlyParams = { duration: 400, easing: quintIn, y: 75 };

  export const CONNECT_WALLET_ID = 'connect-wallet' as const;
</script>

<script lang="ts">
  $: ({ data, jumpToStep, nextStep, previousStep, step } = getStepContext());
  $: ({ selectedProvider } = $data);
  $: name = selectedProvider?.info.name;
  $: if (!selectedProvider) {
    jumpToStep(SELECT_WALLET_ID);
  }
  $: if (name) {
    $walletStore.walletsByName[name as WalletName]?.connect().then(() => {
      nextStep();
    });
  }
</script>

{#if selectedProvider}
  <StepLayout>
    <svelte:fragment slot="content">
      {#key $step}
        <div class="row-[1/1] col-[1/1] grid place-items-center" in:fly={FLY_IN}>
          <ModalTitle as="h3" class="text-center">
            {$t('walletStep.connectWallet.connecting')}
          </ModalTitle>
          <p
            >{$t('walletStep.connectWallet.unlock', {
              values: { name: selectedProvider.info.name },
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
