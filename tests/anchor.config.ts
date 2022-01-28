/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    include: ['./anchor/*.test.ts'],
  },
});
