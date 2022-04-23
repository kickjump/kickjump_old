<script lang="ts">
  import { type Maybe } from '$types';
  import {
    type ButtonVariant,
    BUTTON_SIZE,
    type ButtonSize,
    type ButtonTheme,
    BUTTON_THEME,
  } from '$components/button/constants';
  import cx from 'clsx';
  import { generateBorderClasses, type BorderWidth } from '../sketch/generate-sketch-props';

  export let theme: ButtonTheme = 'default';
  export let variant: ButtonVariant = 'solid';
  export let size: ButtonSize = 'md';
  export let block: boolean = false;
  export let disabled: boolean = false;
  export let type: Maybe<'submit' | 'reset' | 'button'> = undefined;
  export let isLink: boolean = false;
  export let external: boolean = false;
  export let refresh: boolean = false;
  export let href: Maybe<string> = undefined;
  export let seed: number = 100;
  export let borderWidth: BorderWidth = 'md';
  export let active: boolean = false;
  let className: Maybe<string> = undefined;
  export { className as class };

  $: element = href || isLink ? 'a' : 'button';
  $: props =
    element === 'a'
      ? { href, target: external ? '_blank' : refresh ? '_self' : undefined, role: 'button' }
      : { type };
  $: wrapperClass = cx(
    'relative',
    'focus:shadow-outline',
    'focus:rounded-t-md',
    'inline-flex',
    'appearance-none',
    'justify-center',
    'items-center',
    'select-none',
    'whitespace-nowrap',
    'align-middle',
    'outline-none',
    'outline-offset-2',
    'w-auto',
    'leading-tight',
    'font-semibold',
    'transition',
    BUTTON_THEME[theme][variant].current,
    'group',
    BUTTON_SIZE[size],
    disabled && 'opacity-40 cursor-not-allowed',
    block && 'w-full',
    variant === 'link' && 'zero-padding',
    variant !== 'link' && BUTTON_THEME[theme][variant].bg,
    generateBorderClasses({ seed, variant, width: borderWidth }),
    className,
    active && BUTTON_THEME[theme][variant].active,
  );
</script>

<svelte:element this={element} on:click class={wrapperClass} {...props}>
  {#if $$slots.leftIcon}
    <span class="self-center shrink-0 mr-2">
      <slot name="leftIcon" />
    </span>
  {/if}

  <span class="z-0 ">
    <slot />
  </span>

  {#if $$slots.rightIcon}
    <span class="z-0 self-center shrink-0 ml-2">
      <slot name="rightIcon" />
    </span>
  {/if}
</svelte:element>

<style lang="postcss">
  .zero-padding {
    padding: 0;
    height: auto;
  }
</style>
