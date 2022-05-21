/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: ['./setup/db-setup.ts'],
    include: ['./db/*.test.ts'],
    reporters: process.env.CI ? 'dot' : 'default',
  },
});
