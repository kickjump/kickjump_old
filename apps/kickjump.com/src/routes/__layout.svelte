<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/layout/header.svelte';
  import Footer from '$lib/components/layout/footer.svelte';
  import SvgFilters from '$lib/components/svg-filters.svelte';
  import SvelteTheme from 'svelte-themes/SvelteTheme.svelte';
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

<div class="grid min-h-full grid-rows-layout px-6">
  <header class=""><Header /></header>
  <main class=""><slot /></main>
  <footer class=""><Footer /></footer>
</div>

<SvgFilters />

<style lang="postcss"></style>
