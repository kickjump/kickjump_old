<script lang="ts" context="module">
  import Icon, { type IconProps, addIcon } from '@iconify/svelte/dist/OfflineIcon.svelte';
  import type _ from '@iconify/types';
  import type { IconifyIcon } from '@iconify/types';
  import bellFill from '@iconify-icons/bi/bell-fill';
  import cx from 'clsx';

  import type { Maybe } from '$types';

  import { type IconType, loadIcons } from './icons.js';

  loadIcons();
</script>

<script lang="ts">
  addIcon('bell', bellFill);
  // TODO(@ifiokjr) icons are not rendering properly
  export let icon: IconType | IconifyIcon;
  let className: Maybe<string> = undefined;

  export let size: IconProps['height'] = '1em';
  export let align: IconProps['align'] = undefined;
  export let color: IconProps['color'] = undefined;
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
  $: classes = cx('sketch-icon', className);
</script>

<!-- <Icon icon="bell" inline={true} /> -->

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
