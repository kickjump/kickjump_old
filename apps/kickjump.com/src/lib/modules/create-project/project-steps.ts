import type { ProjectModel } from '@kickjump/db';
import { writable } from 'svelte/store';

import { indexedDBStorage, persist } from '$stores/persistent-store';

import { default as ExampleForm } from './example-form.svelte';
import { default as SetTitleSlug } from './set-title-slug.svelte';

export const persistedProject = persist<ProjectModel.Project>(
  writable(),
  indexedDBStorage(),
  'projects.create',
);

export interface CreateProjectStep {
  href: string;
  title: string;
}

export function getStepHref(index: number) {
  const name = PROJECT_CREATE_STEPS[index]?.name;

  if (!name) {
    // Do something here
  }

  return `/projects/create/${index + 1}-${name}`;
}

export const PROJECT_CREATE_STEPS = [
  { name: 'set-title', title: 'Name your project ✨', component: SetTitleSlug },
  { name: 'example', title: 'This is an example ✨', component: ExampleForm },
] as const;
