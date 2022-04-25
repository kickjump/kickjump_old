<script lang="ts">
  import type { Maybe } from '$types';
  import clsx from 'clsx';

  // import { onMount } from 'svelte';
  import { fly, type FlyParams } from 'svelte/transition';
  export let refresh: string;
  let reducedMotion = false;
  let className: Maybe<string> = undefined;

  export { className as class };

  const flyIn: FlyParams = { x: -50, duration: 250, delay: 300 };
  const flyOut: FlyParams = { x: -50, duration: 250 };

  // onMount(() => {
  //   console.log({ matches: window.matchMedia(`(prefers-reduced-motion: reduce)`) });
  //   reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
  //   console.log({ refresh, reducedMotion });
  // });

  $: classes = clsx('max-w-full overflow-x-hidden', className);
</script>

{#if reducedMotion === true}
  <main class={classes}><slot /></main>
{:else}
  {#key refresh}
    <main in:fly={flyIn} out:fly={flyOut} class={classes}>
      <slot />
    </main>
  {/key}
{/if}
