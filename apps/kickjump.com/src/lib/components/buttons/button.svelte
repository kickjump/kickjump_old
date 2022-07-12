<script lang="ts" context="module">
  import type { IconifyIcon } from '@iconify/types';
  import cx from 'clsx';

  import { type IconType, Icon } from '$components/icon';
  import type { Maybe } from '$types';

  const BUTTON_THEME = {
    default: '',
    /** Button with `primary` color */
    primary: 'btn-primary',
    /** Button with `secondary` color */
    secondary: 'btn-secondary',
    /** Button with `accent` color */
    accent: 'btn-accent',
    /** Button with `info` color */
    info: 'btn-info',
    /** Button with `success` color */
    success: 'btn-success',
    /** Button with `warning` color */
    warning: 'btn-warning',
    /** Button with `error` color */
    error: 'btn-error',
  } as const;

  export type ButtonTheme = keyof typeof BUTTON_THEME;

  const BUTTON_VARIANT = {
    solid: '',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    link: 'btn-link',
  } as const;

  export type ButtonVariant = keyof typeof BUTTON_VARIANT;

  const BUTTON_SIZE = /*tw*/ {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  export type ButtonSize = keyof typeof BUTTON_SIZE;

  const BUTTON_SHAPE = /*tw*/ {
    default: '',
    circle: 'btn-circle',
    square: 'btn-square',
    block: 'btn-block',
    wide: 'btn-wide',
  };

  export type ButtonShape = keyof typeof BUTTON_SHAPE;

  export const ICON_TEXT_SIZE: Record<ButtonSize, string> = /*tw*/ {
    xs: 'text-base',
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-6xl',
  };
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

  export {
    // _transition as transition, _in as in, _out as out,
    className as class,
  };
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
