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
  import { setModalContext, type ModalCloseHandler } from './modal-context';
  import { fade, scale, type FadeParams, type ScaleParams } from 'svelte/transition';
  import { cubicIn, cubicOut, cubicInOut } from 'svelte/easing';

  const SCALE_IN: ScaleParams = { start: 0.2, opacity: 0, duration: 300, easing: cubicIn };
  const SCALE_OUT: ScaleParams = { start: 0.2, opacity: 0, duration: 300, easing: cubicOut };
  const FADE: FadeParams = { duration: 300, easing: cubicInOut };

  const SECTION_CLASS = 'bg-base-100 sketchy-1 relative w-full shadow-lg max-w-lg p-0';

  export { DialogTitle as ModalTitle, DialogDescription as ModalDescription };
</script>

<script lang="ts">
  export let open: boolean;
  export let disableOverlay = false;
  export let hideCloseButton = false;
  export let initialFocus: Maybe<HTMLElement | 'close'> = undefined;
  export let sectionClass: Maybe<ClassValue> = undefined;
  export let onClose: ModalCloseHandler;
  let close: Maybe<IconButton>;
  let className: Maybe<ClassValue> = undefined;
  export { className as class };

  setModalContext({ onClose });

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

<Dialog {open} {initialFocusDerived} on:close={() => onClose('event')} class={classes}>
  {#if !disableOverlay}
    <span transition:fade={FADE}>
      <DialogOverlay class="fixed inset-0 bg-neutral-focus/40" />
    </span>
  {/if}

  {#if $$slots.custom}
    <section class={sectionClasses} in:scale={SCALE_IN} out:scale={SCALE_OUT}>
      <slot name="custom" />
    </section>
  {:else}
    <section class={sectionClasses} in:scale={SCALE_IN} out:scale={SCALE_OUT}>
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
            onClose('close-button');
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
