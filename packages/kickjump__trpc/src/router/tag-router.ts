import { e, run } from '@kickjump/db';
import { z } from 'zod';

import { t } from '../init.js';

export const tag = t.router({
  /**
   * Search through all tags.
   */
  search: t.procedure.input(z.string()).query(async (props) => {
    const query = e.select(e.Tag, (tag) => ({
      name: true,
      limit: e.int64(20),
      order_by: e.count(tag.tagged),
      filter: e.op(tag.name, 'ilike', `${props.input}%`),
    }));

    const tags = await run(query);
    return tags.map((tag) => tag.name);
  }),
});
