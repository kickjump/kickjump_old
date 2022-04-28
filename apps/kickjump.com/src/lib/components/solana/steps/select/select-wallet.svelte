<script lang="ts" context="module">
  import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import { quintInOut } from 'svelte/easing';
  import { type FadeParams, fade } from 'svelte/transition';

  import { session } from '$app/stores';
  import Button from '$components/buttons/button.svelte';
  import { Icon } from '$components/icon';
  import { Skeleton } from '$components/loaders';
  import { ModalTitle } from '$components/modal';
  import type { ProviderInfo } from '$components/solana/types';
  import { cleanUrl, getWalletProviders } from '$components/solana/wallet-providers';
  import { showUninstalledWallets } from '$lib/stores/persistent-data';
  import type { Maybe } from '$types';
  import { t } from '$utils/intl';
  import { addUrlParams } from '$utils/url';

  import { getStepContext } from '../step-context';
  import StepLayout from '../step-layout.svelte';
  import SelectWalletItem from './item.svelte';

  export const SELECT_WALLET_ID = 'select-wallet' as const;
  // const FADE_IN: FadeParams = { duration: 300, delay: 400, easing: quintInOut };
  const FADE_OUT: FadeParams = { duration: 250, easing: quintInOut };

  declare module '../step-context' {
    interface StepContextData {
      /**
       * The chosen provider by the user.
       */
      selectedProvider?: ProviderInfo;

      /**
       * True when the providers have already been loaded since the last
       * refresh. Prevents the loading skeleton from being shown on every render
       * of the providers.
       */
      providersLoadedInBrowser?: boolean;
    }
  }

  declare module '$utils/url' {
    export interface KnownUrlParams {
      /**
       * The current step id.
       */
      stepId: string | undefined;

      /**
       * The steps def
       */
      steps: string | undefined;
    }
  }
</script>

<script lang="ts">
  let providers = getWalletProviders($session.userAgent);
  let providerToInstall: Maybe<ProviderInfo> = undefined;

  onMount(() => {
    // update the selected provider once in the browser to update the ui to know
    // whether the wallet is installed.
    providers = getWalletProviders();
    const timeout = setTimeout(() => {
      updateData({ providersLoadedInBrowser: true });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  });

  function onSelectFactory(selectedProvider: ProviderInfo) {
    return () => {
      $walletStore.disconnect().then(() => {
        updateData({ selectedProvider });
        nextStep();
      });
    };
  }

  function onInstallFactory(info: ProviderInfo) {
    return () => {
      providerToInstall = info;
      // window.open(providerToInstall.info.url, '_blank', 'noopener');
    };
  }

  $: ({ updateData, nextStep, data } = getStepContext());
  $: loading = !$data?.providersLoadedInBrowser;

  $: uninstalledNumber = providers.filter((provider) => provider.isUninstalled).length;
  $: displayedProviders = providers.filter((provider) =>
    $showUninstalledWallets ? true : !provider.isUninstalled,
  );
  $: footerText = $showUninstalledWallets
    ? $t('walletStep.selectWallet.hide', { values: { count: uninstalledNumber } })
    : $t('walletStep.selectWallet.show', { values: { count: uninstalledNumber } });
  $: refreshUrl = providerToInstall
    ? addUrlParams({ params: { stepId: SELECT_WALLET_ID, steps: '1' }, href: location.href })
    : undefined;
  $: contentClasses = clsx(
    'row-[1/1] col-[1/1]',
    'overflow-y-scroll grid grid-flow-row auto-rows-min',
    // providerToInstall ? 'h-64' : 'h-72',
    'h-64',
  );
  $: cleanedUrl = providerToInstall ? cleanUrl(providerToInstall?.info.url) : '';
</script>

<StepLayout>
  <ModalTitle as="h3" slot="heading">{$t('walletStep.selectWallet.title')}</ModalTitle>
  <svelte:fragment slot="content">
    {#if loading}
      <div class={contentClasses} transition:fade={FADE_OUT}>
        {#each providers as _}
          <Skeleton height={100} width="100%">
            <circle cx="50" cy="50" r="40" />
            <!-- <rect width="96" height="72" x="0" y="0" rx="12" ry="12" /> -->
            <rect width="260" height="10" x="108" y="19" rx="5" ry="5" />
            <rect width="150" height="10" x="108" y="43" rx="5" ry="5" />
          </Skeleton>
        {/each}
      </div>
    {:else if providerToInstall}
      <div class={contentClasses} transition:fade={FADE_OUT}>
        <div class="flex flex-row pb-4 gap-x-4 justify-center items-center">
          <Icon icon={providerToInstall.info.icon} size="3rem" />
          <h3 class="flex-1 ">{providerToInstall.info.name}</h3>
        </div>
        <h4 class="pb-4">{$t('walletStep.installWallet.redirect')}</h4>
        <p class="pb-2 text-sm">
          {$t('walletStep.installWallet.instructions', {
            values: { mode: 'browser', name: providerToInstall.info.name },
          })}
        </p>
        <p class="text-sm">
          {$t('walletStep.installWallet.warning', {
            values: { url: cleanedUrl },
          })}
        </p>
      </div>
    {:else}
      <div class={contentClasses} transition:fade={FADE_OUT}>
        {#each displayedProviders as provider (provider.info.url)}
          <SelectWalletItem
            {provider}
            onInstall={onInstallFactory(provider)}
            onSelect={onSelectFactory(provider)}
          />
        {/each}
      </div>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="footer">
    {#if providerToInstall}
      <div
        class="flex-1 flex flex-col justify-end items-end gap-y-2 row-[1/1] col-[1/1] h-16"
        transition:fade={FADE_OUT}
      >
        <div class="flex gap-x-7 justify-end items-end">
          <Button size="sm" theme="error" onClick={() => (providerToInstall = undefined)}>
            {$t('walletStep.installWallet.cancel')}
          </Button>
          <Button
            size="sm"
            onClick={() => window.open(providerToInstall?.info.url, '_blank', 'noopener')}
          >
            {$t('walletStep.installWallet.install')}
          </Button>
        </div>
        <span class="text-xs text-center">
          {$t('walletStep.installWallet.finished')}
          <a class="bold underline underline-offset-1" href={refreshUrl} target="_self">
            {$t('walletStep.installWallet.refresh')}
          </a>
        </span>
      </div>
    {:else if uninstalledNumber > 0}
      <div
        transition:fade={FADE_OUT}
        class="flex-1 flex flex-col justify-end items-end gap-y-2 row-[1/1] col-[1/1] h-16"
      >
        <Button
          size="sm"
          variant="link"
          onClick={() => ($showUninstalledWallets = !$showUninstalledWallets)}
        >
          {footerText}
        </Button>
      </div>
    {/if}
  </svelte:fragment>
</StepLayout>
