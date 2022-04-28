<script lang="ts">
  import clsx from 'clsx';

  import { type IconType, Icon } from '$components/icon';
  import type { Maybe } from '$types';

  import Button, {
    type ButtonSize,
    type ButtonTheme,
    type ButtonVariant,
    ICON_TEXT_SIZE,
  } from './button.svelte';

  export let icon: IconType;
  export let theme: ButtonTheme = 'default';
  export let variant: ButtonVariant = 'ghost';
  export let size: ButtonSize = 'md';
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
  let className: Maybe<string> = undefined;
  let element: HTMLButtonElement | HTMLAnchorElement;

  export function getElement() {
    return element;
  }

  $: classes = clsx(ICON_TEXT_SIZE[size], className);
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
  let:element
>
  <Icon {icon} />
</Button>
