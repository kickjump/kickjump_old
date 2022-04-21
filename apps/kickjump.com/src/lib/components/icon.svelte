<script lang="ts">
  import Icon, { type IconifyIcon, type IconProps } from '@iconify/svelte/dist/OfflineIcon.svelte';
  import { type IconType } from '$lib/utils/icons';
  import { type Maybe } from '$lib/types';
  import cx from 'clsx';

  export let icon: IconType | IconifyIcon;
  let className: Maybe<string> = undefined;

  export let size: IconProps['height'] = 24;
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
