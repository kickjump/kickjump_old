/// <reference types="vitest" />
import { defineConfig } from 'vite';

const config = defineConfig({
  test: {
    include: ['**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});

export default config;
