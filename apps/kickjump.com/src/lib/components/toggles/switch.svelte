<script lang="ts">
  import { Switch } from '@rgossiaux/svelte-headlessui';
  import cx from 'clsx';

  import type { Maybe } from '$types';

  export let checked: boolean;
  export let description = '';
  export let animated = true;
  export let name: Maybe<string> = undefined;
  let className = '';
  export { className as class };

  $: classes = cx(
    'switch',
    checked && 'checked',
    'inline-block',
    animated && 'animated',
    className,
  );
</script>

<Switch {checked} on:change class={classes}>
  {#if name}
    <input type="hidden" {name} value={checked} />
  {/if}
  <span class="sr-only">{description}</span>
</Switch>

<style type="postcss">
  :global(.switch) {
    position: relative;
    width: 2rem;
    height: 0.5rem;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      /* top: 0; */
      top: -0.1em;
      display: inline-block;
      height: 16px;
      border: 2px solid #555;
      width: 32px;
      border-radius: 30% 35% 30% 30% / 30% 50% 30% 45%;
    }

    &::after {
      content: '';
      font-size: 1.5rem;
      line-height: 0.5;
      color: #555;
      display: inline-block;
      width: 12px;
      height: 12px;
      position: absolute;
      border: 2px solid #555;
      border-radius: 50% 45% 40% 50% / 40% 50% 50% 45%;
      top: 0;
      left: 0;
      background-color: #555;
    }
  }

  :global(.switch.checked)::after {
    left: 18px;
  }

  :global(.switch.animated)::after {
    transition: left 0.15s ease-in-out;
  }
</style>
