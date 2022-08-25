<script lang="ts">
  import { QueryClient } from '@kickjump/query';
  import Hydrate from '@kickjump/query/dist/Hydrate.svelte';
  import QueryClientProvider from '@kickjump/query/dist/QueryClientProvider.svelte';
  import { createClient, TRPCContext } from '@kickjump/trpc/client';

  import { page } from '$app/stores';
  // import { dehydratedState } from '$stores/dehydrated-state';
  import { session } from '$stores/session';

  const [client, setCsrf] = createClient($page.url.origin);
  const queryClient = new QueryClient();

  const trpc = TRPCContext.create({ client, queryClient });
  $: setCsrf($session.csrf);
</script>

<QueryClientProvider client={queryClient}>
  <Hydrate state={$page.data.dehydratedState}>
    <slot {trpc} />
  </Hydrate>
</QueryClientProvider>
