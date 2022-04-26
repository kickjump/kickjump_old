<script lang="ts">
  import { IconButton } from '$components/buttons';
  import { getModalContext } from '$components/modal';
  import { getStepContext } from './step-context';

  $: ({ close } = getModalContext());
  $: ({ step, previousStep } = getStepContext());
</script>

<header class="px-6 flex flex-row gap-x-4 items-start justify-center mb-8">
  <div class="flex-shrink-0">
    {#if $step > 0}
      <IconButton
        icon="back"
        size="sm"
        onClick={() => {
          previousStep();
        }}
      />
    {/if}
  </div>
  <div class="flex-1 self-center justify-center items-center ">
    <slot name="heading" />
  </div>
</header>

<IconButton
  icon="close"
  class="absolute top-6 right-4"
  size="sm"
  onClick={() => {
    close();
  }}
/>

<div class="px-6 flex-1">
  <slot name="content" />
</div>

{#if $$slots.footer}
  <footer class="flex gap-x-2 px-6 justify-end items-center empty:hidden">
    <slot name="footer" />
  </footer>
{/if}
