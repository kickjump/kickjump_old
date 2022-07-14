<script lang="ts" context="module">
  import type { IconifyIcon } from '@iconify/types';
  import cx from 'clsx';

  import { type IconType, Icon } from '$components/icon';
  import type { Maybe } from '$types';

  import {
    type ButtonShape,
    type ButtonSize,
    type ButtonTheme,
    type ButtonVariant,
    BUTTON_SHAPE,
    BUTTON_SIZE,
    BUTTON_THEME,
    BUTTON_VARIANT,
    ICON_TEXT_SIZE,
  } from './button-types.js';
</script>

<script lang="ts">
  export let theme: ButtonTheme = 'default';
  export let variant: ButtonVariant = 'solid';
  export let size: ButtonSize = 'md';
  export let shape: ButtonShape = 'default';
  export let disabled = false;
  export let type: Maybe<'submit' | 'reset' | 'button'> = undefined;
  export let external = false;
  export let refresh = false;
  export let href: Maybe<string> = undefined;
  export let active = false;
  export let glass = false;
  export let disableAnimation = false;
  export let loading = false;
  export let onClick: Maybe<svelte.JSX.MouseEventHandler<HTMLButtonElement>> = undefined;
  export let leftIcon: Maybe<IconType | IconifyIcon> = undefined;
  export let rightIcon: Maybe<IconType | IconifyIcon> = undefined;
  let className: Maybe<string> = undefined;

  let element: HTMLButtonElement | HTMLAnchorElement;

  export function getElement() {
    return element;
  }

  $: tag = href ? 'a' : 'button';
  $: props =
    tag === 'a'
      ? { href, target: external ? '_blank' : refresh ? '_self' : undefined, role: 'button' }
      : { type };
  $: wrapperClass = cx(
    'btn',
    'gap-x-3',
    BUTTON_THEME[theme],
    BUTTON_VARIANT[variant],
    BUTTON_SIZE[size],
    BUTTON_SHAPE[shape],
    active && 'btn-active',
    glass && 'glass',
    loading && 'loading',
    disabled && 'btn-disabled',
    disableAnimation && 'no-animation',
    className,
  );
  $: iconClass = ICON_TEXT_SIZE[size];

  export { className as class };
</script>

<svelte:element this={tag} bind:this={element} on:click={onClick} class={wrapperClass} {...props}>
  {#if leftIcon}
    <Icon icon={leftIcon} class={iconClass} />
  {:else}
    <slot name="leftIcon" />
  {/if}

  <slot {element} />

  {#if rightIcon}
    <Icon icon={rightIcon} class={iconClass} />
  {:else}
    <slot name="rightIcon" />
  {/if}
</svelte:element>
