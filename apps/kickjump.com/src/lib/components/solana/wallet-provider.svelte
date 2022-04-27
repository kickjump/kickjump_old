<script lang="ts">
  /**
   * @component
   *
   * This initializes the wallet store for the entire application. It should be
   * added to the __layout file for the relevent section of the site.
   */

  import type { Adapter } from '@solana/wallet-adapter-base';
  import type { WalletError } from '@solana/wallet-adapter-base';
  import { initialize } from '@svelte-on-solana/wallet-adapter-core';
  import { onMount } from 'svelte';

  export let localStorageKey = 'wallet-storage';
  export let autoConnect = false;
  export let onError = (error: WalletError) => console.error(error);
  let wallets: Adapter[];

  onMount(async () => {
    const { PhantomWalletAdapter, SolflareWalletAdapter, GlowWalletAdapter } = await import(
      '@solana/wallet-adapter-wallets'
    );

    wallets = [new PhantomWalletAdapter(), new GlowWalletAdapter(), new SolflareWalletAdapter()];
  });

  $: wallets && initialize({ wallets, autoConnect, localStorageKey, onError });
</script>

<svelte:head>
  <script>
    window.global = window;
  </script>
</svelte:head>
<slot />
