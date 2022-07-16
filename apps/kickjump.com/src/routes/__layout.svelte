<script context="module" lang="ts">
  import '../app.css';

  import { createClient, transformer, TRPC_ENDPOINT } from '@kickjump/trpc/client';
  import type { Load } from '@sveltejs/kit';
  import SvelteSeo from 'svelte-seo';

  import { page, session } from '$app/stores';
  import { TRPCProvider } from '$components';
  import MainLayout from '$layout/main.svelte';
  import { DEFAULT_SEO } from '$lib/constants';

  export const load: Load = ({ url }) => ({
    props: { key: url.href },
    stuff: { ...DEFAULT_SEO },
  });
</script>

<script lang="ts">
  export let key: string;
  const client = createClient({ url: TRPC_ENDPOINT, transformer, csrf: $session.csrf });
  $: stuff = { ...DEFAULT_SEO, ...$page.stuff };
</script>

{#key stuff}
  <SvelteSeo {...stuff} />
{/key}
<TRPCProvider {client}>
  <MainLayout refresh={key}><slot /></MainLayout>
</TRPCProvider>
