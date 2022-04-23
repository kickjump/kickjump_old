import { addIcon } from '@iconify/svelte/offline';
import type _ from '@iconify/types';
import discord from '@iconify-icons/ri/discord-fill';
import github from '@iconify-icons/ri/github-fill';
import menuLine from '@iconify-icons/ri/menu-line';
import moonFill from '@iconify-icons/ri/moon-fill';
import moonLine from '@iconify-icons/ri/moon-line';
import sunFill from '@iconify-icons/ri/sun-fill';
import sunLine from '@iconify-icons/ri/sun-line';
import twitter from '@iconify-icons/ri/twitter-fill';

const ICONS = {
  discord,
  github,
  menuLine,
  moonFill,
  moonLine,
  sunFill,
  sunLine,
  twitter,
} as const;

for (const icon of Object.entries(ICONS)) {
  addIcon(...icon);
}

export type IconType = keyof typeof ICONS;
