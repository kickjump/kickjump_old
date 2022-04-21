import adapter from '@sveltejs/adapter-auto';
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  experimental: {
    // prebundleSvelteLibraries: true,
  },
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: adapter(),
    vite: {
      plugins: [
        precompileIntl('locales'), // if your translations are defined in /locales/[lang].json
      ],
      // ...
      define: {
        'process.env.BROWSER': true,
      },

      optimizeDeps: {
        // include: ['@project-serum/anchor', '@solana/web3.js', 'buffer'],
        include: ['@kickjump/db > @kickjump/prisma'],
      },
    },
  },
};

export default config;