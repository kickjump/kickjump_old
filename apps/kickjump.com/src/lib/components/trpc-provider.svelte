<script lang="ts">
  import { QueryClient } from '@kickjump/query';
  import QueryClientProvider from '@kickjump/query/dist/QueryClientProvider.svelte';
  import { createClient, TRPCContext } from '@kickjump/trpc/client';

  import { page } from '$app/stores';
  import { session } from '$stores/session';

  const [client, setCsrf] = createClient($page.url.origin);
  const queryClient = new QueryClient();

  const trpc = TRPCContext.create({ client, queryClient });
  $: setCsrf($session.csrf);
</script>

<QueryClientProvider client={queryClient}>
  <slot {trpc} />
</QueryClientProvider>
