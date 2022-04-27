<script lang="ts">
  import type { Adapter } from '@solana/wallet-adapter-base';
  import { clusterApiUrl } from '@solana/web3.js';
  import {
    ConnectionProvider,
    WalletMultiButton,
    WalletProvider,
  } from '@svelte-on-solana/wallet-adapter-ui';
  import { onMount } from 'svelte';

  const localStorageKey = 'walletAdapter';
  const network = clusterApiUrl('devnet'); // localhost or mainnet

  let wallets: Adapter[] = [];

  onMount(async () => {
    const { PhantomWalletAdapter, SolflareWalletAdapter, GlowWalletAdapter } = await import(
      '@solana/wallet-adapter-wallets'
    );

    wallets = [new PhantomWalletAdapter(), new GlowWalletAdapter(), new SolflareWalletAdapter()];
  });
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect={false} />
<ConnectionProvider {network} />
<div>
  <slot />
</div>
<WalletMultiButton />
