import chevronDown from '@iconify/icons-ri/arrow-down-s-line';
import book from '@iconify/icons-ri/book-line';
import checkboxCircle from '@iconify/icons-ri/checkbox-blank-circle-line';
import github from '@iconify/icons-simple-icons/github';
import type _ from '@iconify/types';

export const IconVariant = {
  github,
  chevronDown,
  checkboxCircle,
  book,
};

export type IconVariant = keyof typeof IconVariant;
