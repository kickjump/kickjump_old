<script lang="ts" context="module">
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
</script>

<script lang="ts">
  import type { Maybe } from '$types';
  import cx from 'clsx';

  export let theme: ButtonTheme = 'default';
  export let variant: ButtonVariant = 'solid';
  export let size: ButtonSize = 'md';
  export let shape: ButtonShape = 'default';
  export let disabled: boolean = false;
  export let type: Maybe<'submit' | 'reset' | 'button'> = undefined;
  export let isLink: boolean = false;
  export let external: boolean = false;
  export let refresh: boolean = false;
  export let href: Maybe<string> = undefined;
  export let active: boolean = false;
  export let glass = false;
  export let disableAnimation = false;
  export let loading = false;
  let className: Maybe<string> = undefined;
  export { className as class };

  $: element = href || isLink ? 'a' : 'button';
  $: props =
    element === 'a'
      ? { href, target: external ? '_blank' : refresh ? '_self' : undefined, role: 'button' }
      : { type };
  $: wrapperClass = cx(
    'btn',
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
</script>

<svelte:element this={element} on:click class={wrapperClass} {...props}>
  <slot name="leftIcon" />
  <slot />
  <slot name="rightIcon" />
</svelte:element>
