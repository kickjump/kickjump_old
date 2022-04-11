import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';
import presetWebFonts from '@unocss/preset-web-fonts';
import { defineConfig } from 'unocss';

export default defineConfig({
  include: ['app/**/*.{ts,tsx}', '../../packages/kickjump__components/src/**/*.{ts,tsx}'],
  presets: [
    presetUno(),
    presetWebFonts({ provider: 'google', fonts: { sans: 'Roboto' } }),
    presetIcons({}),
  ],
});
