<script lang="ts">
  import { QueryClient } from '@kickjump/query';
  import QueryClientProvider from '@kickjump/query/dist/QueryClientProvider.svelte';
  import { createClient, TRPCContext } from '@kickjump/trpc/client';
  import { onMount } from 'svelte';

  import { session } from '$stores/session';

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
