<script lang="ts" context="module">
  import { trpc } from '@kickjump/trpc/client';
  import JSONTree from 'svelte-json-tree';

  // import { Skeleton } from '$components/loaders';

  // import VirtualList from 'svelte-tiny-virtual-list';
</script>

<script lang="ts">
  const query = trpc.github.repos.infiniteQuery(
    { perPage: 100 },
    {
      getNextPageParam: (page) => page.nextCursor,
      getPreviousPageParam: (page) => page.prevCursor,
    },
  );

  $: console.log($query.data);
</script>

<!-- {#if $query.isLoading}
  <p>Loading installations...</p>
{:else if $query.isError}
  <p>Something went wrong 😢</p>
{:else if $query.data?.totalCount === 0}
  <p>No installations found</p>
{:else if $query.data?.installations}
  <ul>
    {#each $query.data.pages as value}
      <div><JSONTree {value} /></div>
    {/each}
  </ul>
{/if}
<div><Button {href}>Install</Button></div> -->
