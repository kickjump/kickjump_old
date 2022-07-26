<script lang="ts" context="module">
  import { trpc } from '@kickjump/trpc/client';
  import JSONTree from 'svelte-json-tree';
</script>

<script lang="ts">
  const query = trpc.github.userRepos.infiniteQuery(
    { perPage: 100 },
    {
      getNextPageParam: (page) => page.nextCursor,
      getPreviousPageParam: (page) => page.prevCursor,
    },
  );
</script>

{#if $query.isLoading}
  <p>Loading installations...</p>
{:else if $query.isError}
  <p>Something went wrong 😢</p>
{:else if $query.data?.pages}
  <ul>
    {#each $query.data.pages as value}
      <div><JSONTree {value} /></div>
    {/each}
  </ul>
{/if}
<div><a class="btn" href="/">Install</a></div>
