<script lang="ts">
  import {
    type DehydratedState,
    type HydrateOptions,
    type MutationOptions,
    type QueryOptions,
    hydrate,
    useQueryClient,
  } from '../';

  export let state: DehydratedState;
  export let queries: QueryOptions | undefined = undefined;
  export let mutations: MutationOptions | undefined = undefined;

  $: client = useQueryClient();
  $: options =
    queries || mutations ? ({ defaultOptions: { queries, mutations } } as HydrateOptions) : {};

  $: hydrate(client, state, options);
</script>

<slot />
