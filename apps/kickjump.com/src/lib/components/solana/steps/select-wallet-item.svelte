<script lang="ts">
  import Icon from '$components/icon/icon.svelte';
  import { type ProviderInfo } from '../types';
  import { cleanUrl } from '../wallet-providers';
  import { t } from '$utils/intl';

  export let provider: ProviderInfo;
  export let onSelect: () => void;
  export let onInstall: () => void;

  $: ({ icon, name } = provider.info);
  $: cleanedUrl = cleanUrl(provider.info.url);
  $: installationMessage = provider.isUninstalled
    ? ` (${$t('walletStep.selectWallet.item.uninstalled')})`
    : '';
</script>

<div>
  <button
    on:click={() => {
      if (provider.isUninstalled) {
        onInstall?.();
      } else {
        onSelect?.();
      }
    }}
    class="sketchy-6 text-left w-full select-none cursor-pointer px-6 grid grid-cols-[auto_1fr] gap-x-8 items-center justify-items-start bg-base-100 hover:bg-base-300 border-b-2 border-b-base-content/10 hover:border-b-base-content/20 py-4"
  >
    <Icon {icon} size="2rem" />
    <div class="flex flex-col">
      <span class="bold text-base tracking-tight ">{name}</span>
      <span class="bold text-xs text-base-content/60">{cleanedUrl}{installationMessage}</span>
    </div>
  </button>
</div>
