import { type WithId, TagUtils } from '@kickjump/types';

import { e, run } from '../edgedb.js';

export async function findMany(target: string): Promise<TagUtils.Tag[]> {
  const query = e.select(e.Tag, (tag) => ({
    ...TagUtils.FIELDS,
    filter: e.op(tag.tagged.id, '=', e.uuid(target)),
  }));

  const results = await run(query);
  return results;
}

interface AttachProps {
  targets: [string, ...string[]];
  names: [string, ...string[]];
}

export async function attach({ targets, names }: AttachProps): Promise<WithId[]> {
  const [firstTarget, ...rest] = targets;
  const tagged = e.select(e.Taggable, (taggable) => ({
    filter: e.op(
      taggable.id,
      'in',
      e.set(e.uuid(firstTarget), ...rest.map((target) => e.uuid(target))),
    ),
  }));

  const queries = names.map((name) => {
    return e.insert(e.Tag, { name, tagged }).unlessConflict((tag) => ({
      on: tag.name,
      else: e.update(tag, () => ({
        set: {
          tagged: {
            '+=': tagged,
          },
        },
      })),
    }));
  });

  const query = e.set(...queries);
  const result = await run(query);

  return result;
}
