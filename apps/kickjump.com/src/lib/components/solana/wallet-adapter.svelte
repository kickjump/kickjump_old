<script lang="ts">
  import { onMount } from 'svelte';
  import { clusterApiUrl } from '@solana/web3.js';
  import type { Adapter } from '@solana/wallet-adapter-base';
  import {
    workSpace,
    WalletProvider,
    WalletMultiButton,
    ConnectionProvider,
  } from '@svelte-on-solana/wallet-adapter-ui';

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
