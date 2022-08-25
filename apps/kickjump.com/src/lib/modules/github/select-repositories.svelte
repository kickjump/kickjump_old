<script lang="ts" context="module">
  import { trpc } from '@kickjump/trpc/client';
  import JSONTree from 'svelte-json-tree';

  import { Button } from '$components';
  import { auth } from '$lib/auth';
</script>

<script lang="ts">
  const query = trpc.github.userInstallations.query();

  const href = auth.strategyUrl('github', 'install').searchPath;
</script>

{#if $query.isLoading}
  <p>Loading installations...</p>
{:else if $query.isError}
  <p>Something went wrong 😢</p>
{:else if $query.data?.totalCount === 0}
  <p>No installations found</p>
{:else if $query.data?.installations}
  <ul>
    {#each $query.data.installations as value}
      <div><JSONTree {value} /></div>
    {/each}
  </ul>
{/if}
<div><Button {href}>Install</Button></div>
