/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globalSetup: ['./setup/kickjump.com-setup.js'],
    include: ['./anchor/*.test.ts'],
    reporters: process.env.CI ? 'dot' : 'default',
  },
});
