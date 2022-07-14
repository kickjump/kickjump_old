export const BUTTON_THEME = {
  default: '',
  /** Button with `primary` color */
  primary: 'btn-primary',
  /** Button with `secondary` color */
  secondary: 'btn-secondary',
  /** Button with `accent` color */
  accent: 'btn-accent',
  /** Button with `info` color */
  info: 'btn-info',
  /** Button with `success` color */
  success: 'btn-success',
  /** Button with `warning` color */
  warning: 'btn-warning',
  /** Button with `error` color */
  error: 'btn-error',
} as const;

export type ButtonTheme = keyof typeof BUTTON_THEME;

export const BUTTON_VARIANT = {
  solid: '',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  link: 'btn-link',
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANT;

export const BUTTON_SIZE = /*tw*/ {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export type ButtonSize = keyof typeof BUTTON_SIZE;

export const BUTTON_SHAPE = /*tw*/ {
  default: '',
  circle: 'btn-circle',
  square: 'btn-square',
  block: 'btn-block',
  wide: 'btn-wide',
};

export type ButtonShape = keyof typeof BUTTON_SHAPE;

export const ICON_TEXT_SIZE: Record<ButtonSize, string> = /*tw*/ {
  xs: 'text-base',
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-6xl',
};
