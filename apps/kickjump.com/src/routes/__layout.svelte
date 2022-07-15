<script context="module" lang="ts">
  import '../app.css';

  import { client } from '@kickjump/trpc/client';
  import type { Load } from '@sveltejs/kit';
  import SvelteSeo from 'svelte-seo';

  import { page } from '$app/stores';
  import { TRPCProvider } from '$components';
  import MainLayout from '$layout/main.svelte';
  import { DEFAULT_SEO } from '$lib/constants';

  export const load: Load = ({ url, session }) => ({
    props: { key: url.href, lang: session.preferredLanguage },
    stuff: { ...DEFAULT_SEO },
  });
</script>

<script lang="ts">
  export let key: string;
</script>

<SvelteSeo {...$page.stuff} />
<TRPCProvider {client}>
  <MainLayout refresh={key}><slot /></MainLayout>
</TRPCProvider>
