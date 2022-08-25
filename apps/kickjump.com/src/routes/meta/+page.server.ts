/**
 * Example of server side prefetching
 */
import { createSSG } from '@kickjump/trpc';

import { withPageServerLoad } from '../../lib/route-loaders.js';
import type { PageServerLoadEvent } from './$types.js';

export async function load(event: PageServerLoadEvent) {
  const ssg = createSSG();
  await ssg.meta.read.fetch('https://google.com');
  const dehydratedState = ssg.dehydrate();
  console.log(JSON.stringify(ssg.dehydrate(), null, 2));

  return withPageServerLoad({
    event,
    dehydratedState,
    seo: { title: 'Meta | KickJump' },
    data: { a: true, b: false },
  });
}
