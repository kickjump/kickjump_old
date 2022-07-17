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

import * as custom from './custom-icons';

const ICONS = {
  ...custom,
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

export function loadIcons() {
  for (const [name, data] of Object.entries(ICONS)) {
    addIcon(name, data);
  }
}

export type IconType = keyof typeof ICONS;
