// import scraper from 'metascraper';
// import metaAuthor from 'metascraper-author';
// import metaClearbit from 'metascraper-clearbit';
// import metaDate from 'metascraper-date';
// import metaDescription from 'metascraper-description';
// import metaImage from 'metascraper-image';
// import metaLogo from 'metascraper-logo';
// import metaPublisher from 'metascraper-publisher';
// import metaTitle from 'metascraper-title';
// import metaUrl from 'metascraper-url';
import init, { Document } from '@kickjump/scraper';
import * as trpc from '@trpc/server';

import * as s from '$lib/structs';

const MetaSchema = s.object({ url: s.string() });
// const metascraper = scraper([
//   metaImage(),
//   metaAuthor(),
//   metaDate(),
//   metaDescription(),
//   metaLogo(),
//   metaClearbit(),
//   metaPublisher(),
//   metaTitle(),
//   metaUrl(),
// ]);

export const metaRouter = trpc.router().query('data', {
  input: MetaSchema,
  resolve: async ({ input }) => {
    const response = await fetch(input.url);
    const html = await response.text();
    await init();
    const doc = new Document(html);
    // const data = await metascraper({ url: input.url, html });

    return {
      title: doc.root.query('title').at(0)?.text(),
      image: doc.root.query('meta[property="og:image:url"]').at(0)?.attributes.get('content'),
    };

    // return data;
  },
});

// declare module 'metascraper' {
//   interface Metadata {
//     logo: string;
//   }
// }
