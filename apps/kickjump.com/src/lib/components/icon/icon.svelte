<script lang="ts" context="module">
  import Icon, { type IconProps } from '@iconify/svelte/dist/OfflineIcon.svelte';
  import { addIcon } from '@iconify/svelte/offline';
  import type _ from '@iconify/types';
  import warning from '@iconify-icons/ri/alert-line';
  import back from '@iconify-icons/ri/arrow-left-s-line';
  import checkboxCircle from '@iconify-icons/ri/checkbox-circle-line';
  import close from '@iconify-icons/ri/close-line';
  import discord from '@iconify-icons/ri/discord-fill';
  import error from '@iconify-icons/ri/error-warning-line';
  import github from '@iconify-icons/ri/github-fill';
  import info from '@iconify-icons/ri/information-line';
  import menuLine from '@iconify-icons/ri/menu-line';
  import moonFill from '@iconify-icons/ri/moon-fill';
  import moonLine from '@iconify-icons/ri/moon-line';
  import sunFill from '@iconify-icons/ri/sun-fill';
  import sunLine from '@iconify-icons/ri/sun-line';
  import twitter from '@iconify-icons/ri/twitter-fill';
  import cx from 'clsx';

  import type { Maybe } from '$types';

  import { type ColoredIconifyIcon, CUSTOM_ICONS } from './custom-icons';

  const ICONS = {
    ...CUSTOM_ICONS,
    back,
    checkboxCircle,
    close,
    discord,
    error,
    github,
    info,
    menuLine,
    moonFill,
    moonLine,
    sunFill,
    sunLine,
    twitter,
    warning,
  };

  for (const icon of Object.entries(ICONS)) {
    addIcon(...icon);
  }

  function getPreferredColor(icon: IconType | ColoredIconifyIcon) {
    return typeof icon === 'string' ? (ICONS[icon] as ColoredIconifyIcon)?.color : icon.color;
  }

  export type IconType = keyof typeof ICONS;
</script>

<script lang="ts">
  export let icon: IconType | ColoredIconifyIcon;
  let className: Maybe<string> = undefined;

  export let size: IconProps['height'] = '1em';
  export let align: IconProps['align'] = undefined;
  export let color: IconProps['color'] = getPreferredColor(icon);
  export let flip: IconProps['flip'] = undefined;
  export let hAlign: IconProps['hAlign'] = undefined;
  export let hFlip: IconProps['hFlip'] = undefined;
  export let id: IconProps['id'] = undefined;
  export let inline: IconProps['inline'] = undefined;
  export let rotate: IconProps['rotate'] = undefined;
  export let slice: IconProps['slice'] = undefined;
  export let style: IconProps['style'] = undefined;
  export let vAlign: IconProps['vAlign'] = undefined;
  export let vFlip: IconProps['vFlip'] = undefined;
  export let height: IconProps['height'] = undefined;
  export let width: IconProps['width'] = undefined;
  export { className as class };

  $: heightValue = height || size;
  $: widthValue = width || size;
  $: classes = cx(
    // 'sketch-icon',
    className,
  );
</script>

<Icon
  class={classes}
  {icon}
  {align}
  {color}
  {flip}
  {hAlign}
  {hFlip}
  {id}
  {inline}
  {rotate}
  {slice}
  {style}
  {vAlign}
  {vFlip}
  height={heightValue}
  width={widthValue}
/>
