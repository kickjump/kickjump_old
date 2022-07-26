/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    teardownTimeout: 5000,
    include: ['./anchor/*.test.ts'],
    reporters: process.env.CI ? 'dot' : 'default',
  },
});
