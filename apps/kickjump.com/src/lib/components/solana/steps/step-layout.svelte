<script lang="ts">
  import {
    cubicInOut,
    // cubicIn, cubicOut
  } from 'svelte/easing';
  import {
    type FadeParams,
    fade,
    // fly, type FlyParams
  } from 'svelte/transition';

  import { IconButton } from '$components/buttons';
  import { getModalContext } from '$components/modal';

  import { StepContext } from './step-context';

  // const FLY_IN: FlyParams = { x: -20, duration: 200, delay: 300, easing: cubicIn };
  // const FLY_OUT: FlyParams = { x: -20, duration: 200, easing: cubicOut };
  const FADE: FadeParams = { duration: 300, easing: cubicInOut };

  $: ({ close } = getModalContext());
  $: ({
    stepIndex,
    previousStep,
    // step
  } = StepContext.context);
</script>

<!-- {#key step} -->
<!-- <div
  class="py-8 flex flex-col gap-y-4 step-height flex-1 row-[1/1] col-[1/1]"
  in:fly={FLY_IN}
  out:fly={FLY_OUT}
> -->
<div
  class="py-8 flex flex-col gap-y-4 step-height flex-1 row-[1/1] col-[1/1]"
  transition:fade|local={FADE}
>
  <header class="px-6 flex flex-row gap-x-4 place-items-center mb-8">
    <div class="flex flex-shrink-0 place-items-center w-8 h-8">
      {#if $stepIndex > 0}
        <IconButton
          icon="back"
          size="sm"
          onClick={() => {
            previousStep();
          }}
        />
      {/if}
    </div>
    <div class="flex-1 flex place-items-center">
      <slot name="heading" />
    </div>
  </header>

  <IconButton
    icon="close"
    class="absolute top-8 right-6"
    size="sm"
    onClick={() => {
      close('close-button');
    }}
  />

  <div class="px-6 flex-1 grid">
    <slot name="content" />
  </div>

  {#if $$slots.footer}
    <footer class="grid gap-x-2 px-6 justify-end items-center empty:hidden">
      <slot name="footer" />
    </footer>
  {/if}
</div>
<!-- {/key} -->
