import { addIcon } from '@iconify/svelte/offline';
import type _ from '@iconify/types';
import warning from '@iconify-icons/ri/alert-line';
import checkboxCircle from '@iconify-icons/ri/checkbox-circle-line';
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

const ICONS = {
  checkboxCircle,
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
} as const;

for (const icon of Object.entries(ICONS)) {
  addIcon(...icon);
}

export type IconType = keyof typeof ICONS;
