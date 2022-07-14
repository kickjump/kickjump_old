<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
  import type { TRPCClient } from '@trpc/client';
  import type { AnyRouter } from '@trpc/server';

  import { type SSRState, TRPCContext } from './trpc-store.js';

  export let queryClient = new QueryClient();
  export let client: TRPCClient<AnyRouter>;
  export let ssrState: SSRState | undefined = undefined;

  TRPCContext.create({ client, queryClient, ssrState });
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
