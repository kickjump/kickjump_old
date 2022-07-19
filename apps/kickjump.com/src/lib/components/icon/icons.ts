import { addIcon } from '@iconify/svelte/offline';
import type _ from '@iconify/types';
import warning from '@iconify-icons/ri/alert-line.js';
import arrowLeft from '@iconify-icons/ri/arrow-left-line.js';
import back from '@iconify-icons/ri/arrow-left-s-line.js';
import arrowRight from '@iconify-icons/ri/arrow-right-line.js';
import forward from '@iconify-icons/ri/arrow-right-s-line.js';
import checkboxCircle from '@iconify-icons/ri/checkbox-circle-line.js';
import close from '@iconify-icons/ri/close-line.js';
import discord from '@iconify-icons/ri/discord-fill.js';
import error from '@iconify-icons/ri/error-warning-line.js';
import github from '@iconify-icons/ri/github-fill.js';
import info from '@iconify-icons/ri/information-line.js';
import menuLine from '@iconify-icons/ri/menu-line.js';
import moonFill from '@iconify-icons/ri/moon-fill.js';
import moonLine from '@iconify-icons/ri/moon-line.js';
import sunFill from '@iconify-icons/ri/sun-fill.js';
import sunLine from '@iconify-icons/ri/sun-line.js';
import twitter from '@iconify-icons/ri/twitter-fill.js';

import * as custom from './custom-icons.js';

const ICONS = {
  ...custom,
  back,
  forward,
  arrowLeft,
  arrowRight,
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
