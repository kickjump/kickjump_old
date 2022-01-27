/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    // globalSetup: './e2e/helpers/global-setup.ts',
    include: ['./e2e/*.test.ts'],
  },
});
