<script lang="ts">
  import { onDestroy, onMount, setContext } from 'svelte';

  import { type QueryClient, QUERY_CLIENT_CONTEXT } from '../';

  // Props with default values
  export let client: QueryClient;

  onMount(() => {
    client.mount();
  });

  $: setContext(QUERY_CLIENT_CONTEXT, client);

  onDestroy(() => {
    client.unmount();
  });
</script>

<slot />
