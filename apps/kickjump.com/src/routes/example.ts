import { json } from '@kickjump/svelte-auth';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(_: RequestEvent): Promise<Response> {
  const response = await fetch('https://api.github.com/example');
  const value = await response.json();
  return json({ value });
}
