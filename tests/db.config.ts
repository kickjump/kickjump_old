/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: ['./setup/db-setup.ts'],
    hookTimeout: 30_000,
    testTimeout: 15_000,
    include: ['./db/*.test.ts'],
    reporters: process.env.CI ? 'dot' : 'default',
  },
});
