/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./anchor/*.test.ts'],
    reporters: process.env.CI ? 'dot' : 'default',
  },
});
