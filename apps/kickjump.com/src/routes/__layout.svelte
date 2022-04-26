<script context="module" lang="ts">
  import '../app.css';
  import type { Load } from '@sveltejs/kit';
  import { init, addMessages } from 'svelte-intl-precompile';
  import { getLocaleFromNavigator } from '$utils/intl';
  import MainLayout from '$layout/main.svelte';
  import en from '$locales/en.js';
  import enGb from '$locales/en-gb.js';
  import es from '$locales/es.js';

  addMessages('en', en);
  addMessages('en-GB', enGb);
  addMessages('es', es);

  export const load: Load = ({ url, session }) => ({
    props: { key: url.href, lang: session.preferredLanguage },
  });
</script>

<script lang="ts">
  export let key: string;
  export let lang: string | undefined;
  const initialLocale = getLocaleFromNavigator(lang) ?? 'en';

  init({ fallbackLocale: 'en', initialLocale });
</script>

<MainLayout refresh={key}><slot yo="yo" /></MainLayout>
