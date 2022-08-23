<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  import type { QueryClient } from '../../src/index.js';
  import QueryClientProvider from '../../src/QueryClientProvider.svelte';

  export let client: QueryClient;
  export let Component: SvelteComponent;
</script>

<QueryClientProvider {client}>
  <svelte:component this={Component} />
</QueryClientProvider>
