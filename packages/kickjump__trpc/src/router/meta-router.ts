import scraper from 'metascraper';
import metaAuthor from 'metascraper-author';
import metaClearbit from 'metascraper-clearbit';
import metaDate from 'metascraper-date';
import metaDescription from 'metascraper-description';
import metaImage from 'metascraper-image';
import metaLogo from 'metascraper-logo';
import metaPublisher from 'metascraper-publisher';
import metaTitle from 'metascraper-title';
import metaUrl from 'metascraper-url';

import { s } from '../client';
import { t } from '../init.js';

const metascraper = scraper([
  metaImage(),
  metaAuthor(),
  metaDate(),
  metaDescription(),
  metaLogo(),
  metaClearbit(),
  metaPublisher(),
  metaTitle(),
  metaUrl(),
]);

/**
 * The meta procedure.
 */
export const meta = t.router({
  read: t.procedure.input(s.string()).query(async (props) => {
    const { input: url } = props;
    const response = await fetch(url);
    const html = await response.text();
    const data = await metascraper({ url: url, html });

    return data;
  }),
});

declare module 'metascraper' {
  interface Metadata {
    logo: string;
  }
}
