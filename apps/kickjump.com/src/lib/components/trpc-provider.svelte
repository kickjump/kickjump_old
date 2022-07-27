<script lang="ts">
  import { createClient, TRPCContext } from '@kickjump/trpc/client';
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
  import { onMount } from 'svelte';

  import { session } from '$app/stores';

  const [client, setCsrf] = createClient();

  onMount(() => {
    setCsrf($session.csrf);
  });

  const queryClient = new QueryClient();

  const trpc = TRPCContext.create({ client, queryClient });
</script>

<QueryClientProvider client={queryClient}>
  <slot {trpc} />
</QueryClientProvider>
