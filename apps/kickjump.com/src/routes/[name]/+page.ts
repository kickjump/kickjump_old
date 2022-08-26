import type { ProjectUtils } from '@kickjump/types';
import { transformer } from '@kickjump/types';

import { withPageLoad } from '$lib/route-loaders.js';

import type { PageLoadEvent } from './$types.js';

export async function load(event: PageLoadEvent) {
  const project: ProjectUtils.Project = transformer.deserialize(event.data);

  return withPageLoad({ seo: { title: `${project.name} | Project` }, event, data: { project } });
}
