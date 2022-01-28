/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig({
  plugins: [react()],
  test: {
    include: ['**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['./tests/setup/react-setup.ts'],
  },
});

export default config;
