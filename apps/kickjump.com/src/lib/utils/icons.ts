import { addIcon } from '@iconify/svelte/offline';
import github from '@iconify-icons/ri/github-fill';

const ICONS = {
  github,
} as const;

for (const icon of Object.entries(ICONS)) {
  addIcon(...icon);
}

export type IconType = keyof typeof ICONS;
