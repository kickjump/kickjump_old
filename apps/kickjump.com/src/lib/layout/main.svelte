<script lang="ts">
  import SvelteTheme from 'svelte-themes/SvelteTheme.svelte';

  import { page } from '$app/stores';
  import { Filters, Footer, Header, PageTransition } from '$components';
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
  <PageTransition
    refresh={$page.routeId ?? ''}
    animateTransition={$page.stuff.animateTransition ?? false}
  >
    <slot />
  </PageTransition>
  <Footer />
</div>

<Filters />
