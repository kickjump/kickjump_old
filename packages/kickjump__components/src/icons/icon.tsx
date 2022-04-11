import { Box } from '@chakra-ui/react';
import { type IconProps as BaseIconProps, addIcon, Icon as BaseIcon } from '@iconify/react';
import { type IconifyIcon } from '@iconify/types';
import clsx from 'clsx';
import type { LiteralUnion } from 'type-fest';

import { IconVariant } from './icon-variant.js';

export interface IconProps extends Omit<BaseIconProps, 'icon'> {
  /**
   * @default '1em'
   *
   * Set the `width`, `height` and `line-height`.
   */
  size?: BaseIconProps['width'];
  // icon: IconVariant;
  icon: LiteralUnion<IconVariant, string> | IconifyIcon;
}

for (const [key, value] of Object.entries(IconVariant)) {
  addIcon(key, value);
}

/**
 * The icon component.
 *
 * This is based on the iconify library https://docs.iconify.design/icon-components/react/
 */
export const Icon = (props: IconProps) => {
  let { size = '1em', width, height, className, style, ...rest } = props;
  let lineHeight: IconProps['size'];

  if (size && !width && !height) {
    lineHeight = width = height = size;
  }

  return (
    <BaseIcon
      {...rest}
      style={{ lineHeight, ...style }}
      className={clsx('flex-shrink-0 inline-block', className)}
      width={width}
      height={height}
    />
  );
};
