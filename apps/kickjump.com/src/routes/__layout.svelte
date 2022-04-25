<script context="module" lang="ts">
  import '../app.css';
  import type { Load } from '@sveltejs/kit';
  import { init } from 'svelte-intl-precompile';
  import { registerAll } from '$locales';
  import { getLocaleFromNavigator } from '$utils/intl';
  import MainLayout from '$layout/main.svelte';

  registerAll();

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
