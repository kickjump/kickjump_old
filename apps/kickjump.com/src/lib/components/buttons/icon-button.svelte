<script lang="ts">
  import type { Maybe } from '$types';
  import Icon from '$components/icon/icon.svelte';
  import Button, { type ButtonVariant, type ButtonTheme, type ButtonSize } from './button.svelte';
  import type { IconType } from '$components/icon';
  import clsx from 'clsx';

  export let icon: IconType;
  export let theme: ButtonTheme = 'default';
  export let variant: ButtonVariant = 'ghost';
  export let size: ButtonSize = 'md';
  export let disabled: boolean = false;
  export let type: Maybe<'submit' | 'reset' | 'button'> = undefined;
  export let external: boolean = false;
  export let refresh: boolean = false;
  export let href: Maybe<string> = undefined;
  export let active: boolean = false;
  export let glass = false;
  export let disableAnimation = false;
  export let loading = false;
  export let onClick: Maybe<svelte.JSX.MouseEventHandler<HTMLButtonElement>> = undefined;
  let className: Maybe<string> = undefined;

  const TEXT_SIZE: Record<ButtonSize, string> = /*tw*/ {
    xs: 'text-base',
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  $: classes = clsx(TEXT_SIZE[size], className);
  export { className as class };
</script>

<Button
  class={classes}
  {theme}
  {variant}
  {size}
  {disabled}
  {type}
  {external}
  {refresh}
  {href}
  {active}
  {glass}
  {disableAnimation}
  {loading}
  {onClick}
  shape="square"
>
  <Icon {icon} />
</Button>
