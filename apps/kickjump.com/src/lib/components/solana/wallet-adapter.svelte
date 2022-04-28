<script lang="ts">
  import type { Adapter } from '@solana/wallet-adapter-base';
  import { clusterApiUrl } from '@solana/web3.js';
  import {
    ConnectionProvider,
    WalletMultiButton,
    WalletProvider,
  } from '@svelte-on-solana/wallet-adapter-ui';
  import { onMount } from 'svelte';

  import { DEFAULT_WALLET_PROVIDERS } from './wallet-providers';

  const localStorageKey = 'walletAdapter';
  const network = clusterApiUrl('devnet'); // localhost or mainnet

  let wallets: Adapter[] = [];

  onMount(async () => {
    for (const [_, provider] of Object.entries(DEFAULT_WALLET_PROVIDERS)) {
      wallets = [...wallets, provider.makeAdapter('', '')];
    }
  });
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect={false} />
<ConnectionProvider {network} />
<div>
  <slot />
</div>
<WalletMultiButton />
