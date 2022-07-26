<script context="module" lang="ts">
  import '../app.css';

  import { createClient } from '@kickjump/trpc/client';
  import type { Load } from '@sveltejs/kit';

  import { page, session } from '$app/stores';
  import { Seo, TRPCProvider } from '$components';
  import MainLayout from '$layout/main.svelte';
  import { DEFAULT_SEO } from '$lib/constants';

  export const load: Load = ({ url }) => ({
    props: { key: url.href },
    stuff: { ...DEFAULT_SEO },
  });
</script>

<script lang="ts">
  export let key: string;

  const client = createClient($session.csrf);
  $: ({ animateTransition = false, ...seo } = { ...DEFAULT_SEO, ...$page.stuff });
</script>

<Seo {...seo} />
<TRPCProvider {client}>
  <MainLayout {animateTransition} refresh={key}><slot /></MainLayout>
</TRPCProvider>
