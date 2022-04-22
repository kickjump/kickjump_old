<script lang="ts">
  import { page } from '$app/stores';
  import Logo from '$lib/components/logo.svelte';
  import { Button } from '$lib/components/button';
  import Switch from '../toggles/switch.svelte';
  import themeStore, { setTheme } from 'svelte-themes';
  import Icon from '../icon.svelte';

  $: isDark = $themeStore.theme === 'dark';

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark');
  }
</script>

<navbar class="h-20 container grid gap-x-8 items-center navbar">
  <a href="/" aria-label="Home" class="justify-self-center">
    <Logo size="4em" />
  </a>

  <div class="justify-self-end flex gap-x-4">
    <Button href="/projects/create" variant="ghost">Projects</Button>
    <Button href="/about" variant="ghost">About</Button>
  </div>

  <div>
    <span class="flex flex-row gap-x-1 justify-center items-center text-gray-600">
      <Icon icon="sunFill" size="1em" />
      <Switch checked={isDark} on:change={toggleTheme} />
      <Icon icon="moonFill" size="1em" />
    </span>
  </div>
</navbar>

<style lang="postcss">
  .navbar {
    grid-template-columns: auto 1fr auto;
  }
</style>
