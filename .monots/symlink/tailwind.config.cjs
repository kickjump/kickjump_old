/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
  content: ['./apps/*/src/**/*.{html,js,svelte,ts,css}'],

  theme: {
    extend: {
      borderWidth: {
        1: '1px',
      },
      boxShadow: {
        outline: '0 0 0 3px hsl(207deg 73% 57% / 60%)',
      },
      borderRadius: {},
      fontFamily: {
        body: '"Short Stack", Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        heading: '"Patrick Hand SC", cursive',
        subHeading: '"Patrick Hand", cursive',
      },

      minWidth: (theme) => {
        return {
          ...theme('spacing'),
        };
      },
      maxWidth: (theme) => {
        return {
          ...theme('spacing'),
        };
      },
      minHeight: (theme) => {
        return {
          ...theme('spacing'),
        };
      },
      maxHeight: (theme) => {
        return {
          ...theme('spacing'),
        };
      },
      gridTemplateRows: {
        layout: 'auto 1fr auto',
      },
      gridTemplateColumns: {
        navbar: 'auto 1fr auto',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          primary: 'hsl(248, 49%, 60%)',
          secondary: 'hsl(34, 100%, 49%)',
          'primary-focus': 'hsl(255, 40%, 53%)',
          'secondary-focus': 'hsl(22, 100%, 48%)',
        },
      },
      {
        dark: {
          ...require('daisyui/src/colors/themes')['[data-theme=dracula]'],
        },
      },
    ],
  },
};

module.exports = config;

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (variable.endsWith('-static')) {
      return `var(${variable})`;
    }

    if (opacityValue === undefined) {
      return `hsl(var(${variable}))`;
    }

    return `hsla(var(${variable}), ${opacityValue})`;
  };
}
