<script lang="ts">
  import Icon from '$components/icon/icon.svelte';
  import { type WalletWithMetadata, cleanUrl } from '$stores/solana';

  export let wallet: WalletWithMetadata;
  export let onSelect: () => void;
  export let onInstall: () => void;

  $: cleanedUrl = cleanUrl(wallet.adapter.url);
  $: installationMessage = !wallet.isInstalled ? ` (not installed)` : '';
</script>

<div>
  <button
    on:click={() => {
      if (!wallet.isInstalled) {
        onInstall?.();
      } else {
        onSelect?.();
      }
    }}
    class="sketchy-6 text-left w-full select-none cursor-pointer px-6 grid grid-cols-[auto_1fr] gap-x-8 items-center justify-items-start bg-base-100 hover:bg-base-300 border-b-2 border-b-base-content/10 hover:border-b-base-content/20 py-4"
  >
    <Icon icon={wallet.icon} size="2rem" />
    <div class="flex flex-col">
      <span class="bold text-base tracking-tight ">{wallet.adapter.name}</span>
      <span class="bold text-xs text-base-content/60">{cleanedUrl}{installationMessage}</span>
    </div>
  </button>
</div>
