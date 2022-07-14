<script lang="ts">
  import type { AnyRouter, TRPCClient } from '@kickjump/trpc/client';
  import { type SSRState, TRPCContext } from '@kickjump/trpc/client';
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';

  export let queryClient = new QueryClient();
  export let client: TRPCClient<AnyRouter>;
  export let ssrState: SSRState | undefined = undefined;

  TRPCContext.create({ client, queryClient, ssrState });
</script>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
