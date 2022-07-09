import init, { Document } from '@kickjump/scraper';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ url }) => {
  const input = url.searchParams.get('url') ?? 'https://github.com/remirror/remirror';
  const response = await fetch(input);
  const html = await response.text();
  await init();
  const doc = new Document(html);

  console.log({ doc });
  const body = {
    title: doc.root.query('title').at(0)?.text().join(' '),
    image: doc.root.query('meta[property="og:image"]').at(0)?.attributes.get('content'),
  };

  return { body };
};

// WebAssembly.Instance();
