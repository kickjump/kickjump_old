<script lang="ts" context="module">
  import type { Maybe } from '$types';
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
  } from '@rgossiaux/svelte-headlessui';
  import IconButton from '$components/buttons/icon-button.svelte';
  import clsx, { type ClassValue } from 'clsx';
  import { setModalContext } from './modal-context';

  export { DialogTitle as ModalTitle, DialogDescription as ModalDescription };

  const SECTION_CLASS = 'bg-base-100 sketchy-1 relative w-full shadow-lg max-w-lg p-0';
</script>

<script lang="ts">
  export let isOpen = false;
  export let disableOverlay = false;
  export let hideCloseButton = false;
  export let initialFocus: Maybe<HTMLElement | 'close'> = undefined;
  export let sectionClass: Maybe<ClassValue> = undefined;
  export let onClose: (method?: 'context' | 'event') => void = () => (isOpen = false);
  let close: Maybe<IconButton>;
  let className: Maybe<ClassValue> = undefined;
  export { className as class };

  setModalContext({
    close: () => onClose('context'),
  });

  $: initialFocusDerived = initialFocus === 'close' ? close?.getElement() : initialFocus;
  $: sectionClasses = clsx(
    SECTION_CLASS,
    !$$slots.custom && 'my-14 py-6 flex flex-col gap-y-4 min-h-60',
    sectionClass,
  );
  $: classes = clsx(
    'fixed inset-0 z-20 content overflow-y-auto flex justify-center items-start duration-200 overscroll-contain',
    className,
  );
</script>

<Dialog open={isOpen} {initialFocusDerived} on:close={() => onClose('event')} class={classes}>
  {#if !disableOverlay}
    <DialogOverlay class="fixed inset-0 bg-neutral-focus/40" />
  {/if}

  {#if $$slots.custom}
    <section class={sectionClasses}>
      <slot name="custom" />
    </section>
  {:else}
    <section class={sectionClasses}>
      {#if $$slots.heading}
        <header class="px-6">
          <slot name="heading" />
        </header>
      {/if}

      {#if !hideCloseButton}
        <IconButton
          bind:this={close}
          icon="close"
          class="absolute top-6 right-4"
          size="sm"
          onClick={() => {
            isOpen = false;
          }}
        />
      {/if}

      <div class="px-6 flex-1">
        <slot name="content" />
      </div>

      {#if $$slots.footer}
        <footer class="flex gap-x-2 px-6 justify-end items-center">
          <slot name="footer" />
        </footer>
      {/if}
    </section>
  {/if}
</Dialog>
