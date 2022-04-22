<script context="module">
  import { addMessages, init } from 'svelte-intl-precompile';
  import { session } from '$app/stores';
  import en from '$locales/en.js';
  import enGb from '$locales/en-gb.js';
  import es from '$locales/es.js';

  addMessages('en', en);
  addMessages('en-GB', enGb);
  addMessages('es', es);
</script>

<script lang="ts">
  import '../app.css';
  import { getDirFromCountryCode, getLocaleFromNavigator } from '$lib/utils/intl';
  import Header from '$lib/components/layout/header.svelte';
  import Footer from '$lib/components/layout/footer.svelte';
  import SvgFilters from '$lib/components/svg-filters.svelte';
  import SvelteTheme from 'svelte-themes/SvelteTheme.svelte';

  const lang = getLocaleFromNavigator($session.preferredLanguage) ?? 'en';
  const dir = getDirFromCountryCode(lang);

  init({
    fallbackLocale: 'en',
    initialLocale: lang,
  });
</script>

<svelte:head>
  <html {lang} {dir} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Patrick+Hand+SC&family=Short+Stack&display=swap"
    rel="stylesheet"
  />
</svelte:head>
<SvelteTheme />

<div class="grid min-h-full grid-rows-layout px-6 gap-8">
  <header class="inline-grid place-items-center"><Header /></header>
  <main class="max-w-full overflow-x-hidden"><slot /></main>
  <footer class=""><Footer /></footer>
</div>

<SvgFilters />

<style lang="postcss"></style>
