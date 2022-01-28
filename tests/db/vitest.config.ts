/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globalSetup: './helpers/global-setup.ts',
    include: ['*.test.ts'],
  },
});
