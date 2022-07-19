import './src/app.d.ts';

import { sveltekit } from '@sveltejs/kit/vite';
import * as path from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

export default defineConfig({
  mode: process.env.VITE_MODE ? process.env.MODE : undefined,
  plugins: [sveltekit()],
  ssr: { noExternal: ['@kickjump/**'] },
  legacy: { buildSsrCjsExternalHeuristics: true },
  resolve: {
    alias: {
      $components: path.resolve('./src/lib/components'),
      $layout: path.resolve('./src/lib/layout'),
      $stores: path.resolve('./src/lib/stores'),
      $modules: path.resolve('./src/lib/modules'),
      $server: path.resolve('./src/lib/server'),
      $types: path.resolve('./src/lib/types'),
      $utils: path.resolve('./src/lib/utils'),
      $lib: path.resolve('./src/lib'),
    },
  },
  server: { port: 3000 },
});

const plugin: Plugin = {
  name: 'vite-plugin-pnpm-resolve',
};

// function patchSsrNoExternal(): Plugin {
//   return {
//     name: 'vite-plugin-patch-ssr-noexternal',
//     enforce: 'post',
//     config(config) {
//       if (!config.ssr?.noExternal) return;
//       const external = Array.isArray(config.ssr.noExternal)
//         ? config.ssr.noExternal
//         : config.ssr.noExternal === true
//         ? [/.*/]
//         : [config.ssr.noExternal];

//       config.ssr.noExternal = external.map((x) =>
//         typeof x !== 'string' || x.includes('*') || x.endsWith('/**') ? x : `${x}${!x.endsWith('/') ? '/' : ''}**`
//       );
//     }
//   }
// }
