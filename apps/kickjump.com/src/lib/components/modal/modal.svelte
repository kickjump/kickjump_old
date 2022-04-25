<script lang="ts" context="module">
  import type { Maybe } from '$types';
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
  } from '@rgossiaux/svelte-headlessui';
  import IconButton from '$components/buttons/icon-button.svelte';

  export { DialogTitle as ModalTitle, DialogDescription as ModalDescription };

  export interface WithFocus {
    focus: () => void;
  }
</script>

<script lang="ts">
  export let isOpen = false;
  export let disableOverlay = false;
  export let disableClose = false;
  export let initialFocus: Maybe<HTMLElement> = undefined;
  export let onClose: () => void = () => (isOpen = false);
</script>

<Dialog
  open={isOpen}
  {initialFocus}
  on:close={onClose}
  class="fixed inset-0 z-20 content overflow-y-auto flex justify-center items-start duration-200 overscroll-contain"
>
  {#if !disableOverlay}
    <DialogOverlay class="fixed inset-0 bg-neutral-focus/40" />
  {/if}

  {#if $$slots.custom}
    <slot name="custom" />
  {:else}
    <section
      class="my-14 bg-base-100 sketchy-1 relative flex flex-col w-full shadow-lg max-w-lg gap-y-4 p-0 min-h-60"
    >
      {#if $$slots.headerBar}
        <slot name="headerBar" />
      {/if}
      {#if $$slots.heading}
        <header class="pt-6 px-6">
          <slot name="heading" />
        </header>
      {/if}

      {#if !disableClose}
        <IconButton
          icon="close"
          class="absolute top-6 right-4"
          size="sm"
          onClick={() => {
            isOpen = false;
          }}
        />
      {/if}

      <!-- {#if $$slots.content} -->
      <div class="px-6 flex-1">
        <slot name="content" />
      </div>
      <!-- {/if} -->

      {#if $$slots.footer}
        <footer class="flex gap-x-2 px-6 pb-4 justify-end py-4 items-center">
          <slot name="footer" />
        </footer>
      {/if}
    </section>
  {/if}
</Dialog>
