/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globalSetup: './setup/db-setup.ts',
    include: ['./db/*.test.ts'],
  },
});
