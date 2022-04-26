<script lang="ts" context="module">
  import { ModalTitle } from '$components/modal';
  import StepLayout from './step-layout.svelte';
  import { t } from '$utils/intl';
  import { type Maybe } from '$types';
  import { walletStore } from '@svelte-on-solana/wallet-adapter-core';
  import { getWalletProviders, createRefreshUrl, cleanUrl } from '../wallet-providers';
  import type { ProviderInfo } from '../types';
  import { getStepContext } from './step-context';
  import { onMount } from 'svelte';
  import { session } from '$app/stores';

  declare module './step-context' {
    interface StepContextData {
      selectedProvider?: ProviderInfo;
    }
  }
</script>

<script lang="ts">
  import Button from '$components/buttons/button.svelte';
  import SelectWalletItem from './select-wallet-item.svelte';
  import { Icon } from '$components/icon';
  import clsx from 'clsx';

  let showUninstalled = false;
  let providers = getWalletProviders($session.userAgent);
  let providerToInstall: Maybe<ProviderInfo> = undefined;

  onMount(() => {
    // update the selected provider once in the browser to update the ui to know
    // whether the wallet is installed.
    providers = getWalletProviders();
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

  $: ({ updateData, nextStep } = getStepContext());
  $: uninstalledNumber = providers.filter((provider) => provider.isUninstalled).length;
  $: displayedProviders = providers.filter((provider) =>
    showUninstalled ? true : !provider.isUninstalled,
  );
  $: footerText = showUninstalled
    ? $t('walletStep.selectWallet.hide', { values: { count: uninstalledNumber } })
    : $t('walletStep.selectWallet.show', { values: { count: uninstalledNumber } });
  $: refreshUrl = providerToInstall ? createRefreshUrl() : undefined;
  $: contentClasses = clsx(
    'overflow-y-scroll grid grid-flow-row auto-rows-min',
    providerToInstall ? 'h-64' : 'h-72',
  );
  $: cleanedUrl = providerToInstall ? cleanUrl(providerToInstall?.info.url) : '';
</script>

<StepLayout>
  <ModalTitle as="h3" slot="heading">{$t('walletStep.selectWallet.title')}</ModalTitle>
  <div slot="content" class={contentClasses}>
    {#if providerToInstall}
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
    {:else}
      {#each displayedProviders as provider (provider.info.url)}
        <SelectWalletItem
          {provider}
          onInstall={onInstallFactory(provider)}
          onSelect={onSelectFactory(provider)}
        />
      {/each}
    {/if}
  </div>
  <svelte:fragment slot="footer">
    {#if providerToInstall}
      <div class="flex-1 flex flex-col justify-end items-end gap-y-2">
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
        <span class="text-xs text-center"
          >{$t('walletStep.installWallet.finished')}
          <a class="bold underline underline-offset-1" href={refreshUrl} target="_self">
            {$t('walletStep.installWallet.refresh')}
          </a>
        </span>
      </div>
    {:else if uninstalledNumber > 0}
      <Button size="sm" variant="link" onClick={() => (showUninstalled = !showUninstalled)}>
        {footerText}
      </Button>
    {/if}
  </svelte:fragment>
</StepLayout>
