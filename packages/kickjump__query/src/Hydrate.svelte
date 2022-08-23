<script lang="ts">
  import type {
    DehydratedState,
    HydrateOptions,
    MutationOptions,
    QueryOptions,
  } from '@tanstack/query-core';
  import { hydrate } from '@tanstack/query-core';

  import { useQueryClient } from './use-query-client.js';

  export let state: DehydratedState;
  export let queries: QueryOptions | undefined = undefined;
  export let mutations: MutationOptions | undefined = undefined;

  $: queryClient = useQueryClient();
  $: options =
    queries || mutations ? ({ defaultOptions: { queries, mutations } } as HydrateOptions) : {};

  $: if (state) {
    hydrate(queryClient, state, options);
  }
</script>
