import { default as SetTitleSlug } from './set-title-slug.svelte';
export interface CreateProjectStep {
  href: string;
  title: string;
}

export const STEPS = [
  { name: 'set-title', title: 'Name your project ✨', component: SetTitleSlug },
];
