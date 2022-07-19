<script lang="ts">
  import SvelteTheme from 'svelte-themes/SvelteTheme.svelte';

  export let animateTransition: boolean;
  import { Filters, Footer, Header, PageTransition } from '$components';
  export let refresh: string;
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
  <PageTransition {refresh} {animateTransition}>
    <slot />
  </PageTransition>
  <Footer />
</div>

<Filters />
