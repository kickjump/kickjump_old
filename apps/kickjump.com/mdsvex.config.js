import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import path from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;
const config = defineConfig({
  extensions: ['.svelte.md', '.md', '.svx'],
  smartypants: { dashes: 'oldschool' },
  layout: {
    page: path.join(__dirname, './src/lib/layout/page.svelte'),
    article: path.join(__dirname, './src/lib/layout/article.svelte'),
  },

  remarkPlugins: [],
  rehypePlugins: [],
});

export default config;
