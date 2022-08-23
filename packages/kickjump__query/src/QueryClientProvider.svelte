<script lang="ts">
  import type { QueryClient } from '@tanstack/query-core';
  import { onDestroy, onMount, setContext } from 'svelte';

  import { QUERY_CLIENT_CONTEXT } from './index.js';

  // Props with default values
  export let client: QueryClient;

  onMount(() => {
    client.mount();
  });

  setContext(QUERY_CLIENT_CONTEXT, client);

  onDestroy(() => {
    client.unmount();
  });
</script>

<slot />
