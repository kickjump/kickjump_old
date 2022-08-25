<script lang="ts">
  import { trpc } from '@kickjump/trpc/client';

  $: query = trpc.meta.read.query('https://google.com');
  $: query2 = trpc.meta.read.query('https://github.com');
</script>

<h3>Query 1</h3>
{#if $query.isLoading}
  <p>Loading...</p>
{:else if $query.isError}
  <p>Something went wrong 😢</p>
{:else}
  <pre>{JSON.stringify($query.data, null, 2)}</pre>
{/if}

<h3>Query 2</h3>
{#if $query2.isLoading}
  <p>Loading...</p>
{:else if $query2.isError}
  <p>Something went wrong 😢</p>
{:else}
  <pre>{JSON.stringify($query2.data, null, 2)}</pre>
{/if}
