<script lang="ts">
  import clsx from 'clsx';
  import { type FlyParams, fly } from 'svelte/transition';

  import type { Maybe } from '$types';
  export let refresh: string | number;
  export let animateTransition: boolean | undefined = false;
  let className: Maybe<string> = undefined;

  export { className as class };

  const flyIn: FlyParams = { x: -50, duration: 250, delay: 300 };
  const flyOut: FlyParams = { x: -50, duration: 250 };

  $: classes = clsx('max-w-full overflow-x-hidden grid', className);
</script>

{#if animateTransition}
  <main class={classes}><slot /></main>
{:else}
  {#key refresh}
    <main in:fly={flyIn} out:fly={flyOut} class={classes}>
      <slot />
    </main>
  {/key}
{/if}
