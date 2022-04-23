<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import { addMessages, init } from 'svelte-intl-precompile';
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
  import '../app.css';
  import { getLocaleFromNavigator } from '$utils/intl';
  import { Header, Footer, Filters, PageTransition } from '$components';
  import SvelteTheme from 'svelte-themes/SvelteTheme.svelte';

  export let key: string;
  export let lang: string | undefined;
  const initialLocale = getLocaleFromNavigator(lang) ?? 'en';

  init({ fallbackLocale: 'en', initialLocale });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Patrick+Hand+SC&family=Short+Stack&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<SvelteTheme />

<div class="grid min-h-full grid-rows-layout">
  <Header />
  <main class="max-w-full overflow-x-hidden px-6 gap-8">
    <PageTransition refresh={key}>
      <slot />
    </PageTransition>
  </main>
  <Footer />
</div>

<Filters />
