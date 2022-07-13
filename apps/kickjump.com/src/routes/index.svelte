<script lang="ts" context="module">
  // import { useQuery } from '@sveltestack/svelte-query';

  import { Button } from '$components';
  // import { trpc } from '$lib/trpc';
</script>

<script lang="ts">
  // const metaResult = useQuery('meta', () => trpc.meta.read.query('https://google.com'));
  // const githubResult = useQuery('github', () => trpc.github.play.query());

  // $: console.log($metaResult.data);
  // $: console.log($githubResult.data);
</script>

<div class="hero hero-height">
  <div class="hero-content text-center">
    <div class="max-w-2xl">
      <h1 class="pb-14 gradient-text">
        <strong>Unlock</strong> financial freedom with open source
      </h1>
      <Button onClick={() => {}} theme="primary" variant="outline" size="lg" class="border-4"
        >Get Started</Button
      >
    </div>
  </div>
</div>

<style>
  .hero-height {
    min-height: 50vh;
  }
</style>
