import { s } from '@kickjump/validation';

import { t } from '../init.js';
import { authenticated } from '../middleware.js';

export const project = t.router({
  slugAndTitle: authenticated
    .input(s.object({ title: s.size(s.string(), 4, 40), slug: s.slug() }))
    .mutation(async (props) => {
      const { input } = props;
    }),
  slugAvailable: authenticated.input(s.object({ slug: s.slug() })).query(async ({}) => {}),
});
