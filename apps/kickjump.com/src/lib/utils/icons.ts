import { addIcon } from '@iconify/svelte/offline';
import type _ from '@iconify/types';
import github from '@iconify-icons/ri/github-fill';
import moonFill from '@iconify-icons/ri/moon-fill';
import moonLine from '@iconify-icons/ri/moon-line';
import sunFill from '@iconify-icons/ri/sun-fill';
import sunLine from '@iconify-icons/ri/sun-line';

const ICONS = {
  github,
  sunLine,
  moonLine,
  sunFill,
  moonFill,
} as const;

for (const icon of Object.entries(ICONS)) {
  addIcon(...icon);
}

export type IconType = keyof typeof ICONS;
