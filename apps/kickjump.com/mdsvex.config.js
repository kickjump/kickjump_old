import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
