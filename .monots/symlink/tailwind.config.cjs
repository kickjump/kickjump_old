/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
  content: ['./apps/*/src/**/*.{html,js,svelte,ts,css}'],

  theme: {
    extend: {
      colors: {
        // primary: withOpacityValue('--color-primary'),
        // primaryHover: withOpacityValue('--color-primary-hover'),
        // primaryActive: withOpacityValue('--color-primary-active'),
        // primaryGhost: withOpacityValue('--color-primary-ghost'),
        // secondary: withOpacityValue('--color-secondary'),
        // secondaryHover: withOpacityValue('--color-secondary-hover'),
        // secondaryActive: withOpacityValue('--color-secondary-active'),
        // secondaryOutline: withOpacityValue('--color-secondary-outline'),
        // secondaryGhost: withOpacityValue('--color-secondary-ghost'),
        // background: withOpacityValue('--color-background'),
        // text: withOpacityValue('--color-text'),
        // neutral: withOpacityValue('--color-neutral'),
        // buttonText: withOpacityValue('--color-button-text'),
        // border: withOpacityValue('--color-border'),
        // colorFocusStatic: withOpacityValue('--color-focus-static'),
        // colorFocusOffset: withOpacityValue('--color-focus-offset'),
      },
      borderWidth: {
        1: '1px',
      },
      boxShadow: {
        outline: '0 0 0 3px hsl(207deg 73% 57% / 60%)',
      },
      borderRadius: {
        toggleSwitch: '50% 45% 40% 50% / 40% 50% 50% 45%',
        toggleBorder: '30% 35% 30% 30% / 30% 50% 30% 45%',
        paper1: '255px 15px 15px 225px / 15px 225px 255px 15px',
        paper2: '125px 10px 185px 20px / 25px 205px',
        paper3: '15px 255px 225px 15px / 225px 15px 15px 255px',
        paper4: '15px 25px 25px 155px / 225px 150px 115px 25px',
        paper5: '250px 25px 20px 15px / 15px 80px 115px 105px',
        paper6: '28px 100px 15px 20px / 125px 30px 225px 205px',
      },
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
        },
      },
      {
        dark: {
          ...require('daisyui/src/colors/themes')['[data-theme=halloween]'],
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
