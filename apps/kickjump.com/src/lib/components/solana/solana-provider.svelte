<script lang="ts">
  import type { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base';
  import { onMount } from 'svelte';

  import { createWallets, solana } from '$stores/solana';

  /**
   * @component
   *
   * This initializes the wallet store for the entire application. It should be
   * added to the __layout file for the relevent section of the site.
   */

  export let autoConnect = false;
  export let connection = $solana.connection;
  let wallets: BaseMessageSignerWalletAdapter[];

  onMount(() => {
    wallets = createWallets($solana.connection);

    solana.on('walletError', (error) => console.error(error));
    solana.initialize({ wallets, autoConnect, connection });
    return solana.removeAllEventListeners;
  });
</script>

<svelte:head>
  <script>
    window.global = window;
  </script>
</svelte:head>
<slot />
