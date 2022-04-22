export const BUTTON_VARIANT = {
  solid: '',
  outline: '',
  ghost: '',
  link: '',
};

export type ButtonVariant = keyof typeof BUTTON_VARIANT;

export const BUTTON_SIZE = /*tw*/ {
  xs: 'min-w-6 h-6 px-2 text-xs',
  sm: 'min-w-8 h-8 px-3 text-sm',
  md: 'min-w-10 h-10 px-4 text-md',
  lg: 'min-w-12 h-12 px-6 text-lg',
};

export type ButtonSize = keyof typeof BUTTON_SIZE;

export const BUTTON_THEME = /*tw*/ {
  primary: {
    solid: {
      bg: 'bg-primary hover:bg-primaryHover active:bg-primaryActive',
      current: 'text-white',
      active: 'bg-primaryActive',
    },
    outline: {
      bg: 'bg-white group hover:bg-purple-100 active:bg-purple-200',
      current: 'text-primary hover:text-primaryHover active:text-primaryActive',
      active: 'bg-purple-200 text-primaryActive',
    },
    ghost: {
      bg: 'bg-white group hover:bg-purple-100 active:bg-purple-200',
      current: 'text-primary hover:text-primaryHover active:text-primaryActive',
      active: 'bg-purple-200 text-primaryActive',
    },
    link: {
      bg: 'bg-white group',
      current: 'text-primary hover:text-primaryHover active:text-primaryActive',
      active: 'text-primaryActive',
    },
  },
  secondary: {
    solid: {
      bg: 'bg-secondary hover:bg-secondaryHover active:bg-secondaryActive',
      current: 'text-white',
      active: 'bg-secondaryActive',
    },
    outline: {
      bg: 'bg-white group hover:bg-orange-100 active:bg-orange-200',
      current: 'text-secondary hover:text-secondaryHover active:text-secondaryActive',
      active: 'bg-orange-200 text-secondaryActive',
    },
    ghost: {
      bg: 'bg-white group hover:bg-orange-100 active:bg-orange-200',
      current: 'text-secondary hover:text-secondaryHover active:text-secondaryActive',
      active: 'bg-orange-200 text-secondaryActive',
    },
    link: {
      bg: 'bg-white group',
      current: 'text-secondary hover:text-secondaryHover active:text-secondaryActive',
      active: 'text-secondaryActive',
    },
  },
  success: {
    solid: {
      bg: 'bg-green-600 hover:bg-green-700 active:bg-green-800',
      current: 'text-white',
      active: 'bg-green-800',
    },
    outline: {
      bg: 'bg-white hover:bg-green-100 active:bg-green-200',
      current: 'text-green-600 hover:text-green-700 active:text-green-800',
      active: 'bg-green-200 text-green-800',
    },
    ghost: {
      bg: 'bg-white hover:bg-green-100 active:bg-green-200',
      current: 'text-green-600 hover:text-green-700 active:text-green-800',
      active: 'bg-green-200 text-green-800',
    },
    link: {
      bg: 'bg-white',
      current: 'text-green-600 hover:text-green-700 active:text-green-800',
      active: 'text-green-800',
    },
  },
  // warning: {
  //   solid: {},
  //   outline: {},
  //   ghost: {},
  //   link: {},
  //   bg: 'bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500',
  //   current: 'text-yellow-300 hover:text-yellow-400 active:text-yellow-500',
  //   text: 'text-text',
  // },
  // danger: {
  //   solid: {},
  //   outline: {},
  //   ghost: {},
  //   link: {},
  //   bg: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
  //   current: 'text-red-600 hover:text-red-700 active:text-red-800',
  //   text: 'text-white',
  // },
  default: {
    solid: {
      bg: 'bg-gray-700 hover:bg-gray-800 active:bg-gray-800',
      current: 'text-white',
      active: 'bg-gray-800',
    },
    outline: {
      bg: 'bg-white hover:bg-gray-100 active:bg-gray-200',
      current: 'text-gray-700 hover:text-gray-800 active:text-gray-800',
      active: 'text-gray-800 bg-gray-200',
    },
    ghost: {
      bg: 'bg-white hover:bg-gray-100 active:bg-gray-200',
      current: 'text-gray-700 hover:text-gray-800 active:text-gray-800',
      active: 'bg-gray-200 text-gray-800',
    },
    link: {
      bg: 'bg-white',
      current: 'text-gray-700 hover:text-gray-800 active:text-gray-800',
      active: 'text-gray-800',
    },
  },
};

export type ButtonTheme = keyof typeof BUTTON_THEME;
