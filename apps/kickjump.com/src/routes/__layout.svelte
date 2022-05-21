<script context="module" lang="ts">
  import '../app.css';

  import type { Load } from '@sveltejs/kit';
  import { addMessages, init } from 'svelte-intl-precompile';
  import SvelteSeo from 'svelte-seo';

  import { page } from '$app/stores';
  import MainLayout from '$layout/main.svelte';
  import en from '$locales/en.js';
  import enGb from '$locales/en-gb.js';
  import es from '$locales/es.js';
  import { DEFAULT_SEO } from '$utils/constants';
  import { getLocaleFromNavigator } from '$utils/intl';

  addMessages('en', en);
  addMessages('en-GB', enGb);
  addMessages('es', es);

  export const load: Load = ({ url, session }) => ({
    props: { key: url.href, lang: session.preferredLanguage },
    stuff: { ...DEFAULT_SEO },
  });
</script>

<script lang="ts">
  export let key: string;
  export let lang: string | undefined;
  const initialLocale = getLocaleFromNavigator(lang) ?? 'en';

  init({ fallbackLocale: 'en', initialLocale });
</script>

<SvelteSeo {...$page.stuff} />
<MainLayout refresh={key}><slot yo="yo" /></MainLayout>
