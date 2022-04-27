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
  
  import { type Maybe } from '$types';
  
  import { type ColoredIconifyIcon,CUSTOM_ICONS } from './custom-icons';

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
  let className: Maybe<string> = null;

  export let size: IconProps['height'] = '1em';
  export let align: IconProps['align'] = null;
  export let color: IconProps['color'] = getPreferredColor(icon);
  export let flip: IconProps['flip'] = null;
  export let hAlign: IconProps['hAlign'] = null;
  export let hFlip: IconProps['hFlip'] = null;
  export let id: IconProps['id'] = null;
  export let inline: IconProps['inline'] = null;
  export let rotate: IconProps['rotate'] = null;
  export let slice: IconProps['slice'] = null;
  export let style: IconProps['style'] = null;
  export let vAlign: IconProps['vAlign'] = null;
  export let vFlip: IconProps['vFlip'] = null;
  export let height: IconProps['height'] = null;
  export let width: IconProps['width'] = null;
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
