<script lang="ts">
  import {
    Connection,
    clusterApiUrl,
    type Commitment,
    type ConnectionConfig,
  } from '@solana/web3.js';
  import { workspace } from '$components/solana/workspace';

  export let network: string = clusterApiUrl('devnet');
  export let config: Commitment | ConnectionConfig | undefined = 'processed';

  $: workspace.set({ connection: new Connection(network, config) });
</script>

<slot />
