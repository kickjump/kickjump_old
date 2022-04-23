<script lang="ts">
  import { page } from '$app/stores';
  import Logo from '$components/logo/logo.svelte';
  import { Button } from '$components/button';
  import Switch from '../toggles/switch.svelte';
  import themeStore, { setTheme } from 'svelte-themes';
  import Icon from '../icon.svelte';
  import { matchesHref } from '$utils/core';
  import { t } from '$utils/intl';

  let open: boolean = false;

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark');
  }

  function toggleMenu() {
    open = !open;
  }

  const items = [
    { label: $t('projects'), href: '/projects' },
    { label: $t('about'), href: '/about' },
  ];

  $: isDark =
    $themeStore.theme === 'dark' ||
    ($themeStore.theme === 'system' && $themeStore.resolvedTheme === 'dark');
  $: {
    if (
      $themeStore.theme === 'system' &&
      $themeStore.resolvedTheme &&
      $themeStore.resolvedTheme !== 'system'
    ) {
      setTheme($themeStore.resolvedTheme);
    }
  }
</script>

<header class="inline-grid place-items-center">
  <navbar class="h-20 container grid gap-x-8 items-center grid-cols-navbar">
    <a href="/" aria-label="Home" class="justify-self-center">
      <Logo size="4em" />
    </a>

    <div class="hidden sm:flex justify-self-end gap-x-4">
      {#each items as { href, label } (href)}
        <Button {href} variant="ghost" active={matchesHref($page, href)}>{label}</Button>
      {/each}
    </div>

    <div class="border-l-text border-l-2 pl-8 justify-self-end flex flex-row gap-x-1">
      <span class="hidden sm:flex flex-row gap-x-1 justify-center items-center text-gray-600">
        <Icon icon="sunFill" size="1em" />
        <Switch checked={isDark} on:change={toggleTheme} />
        <Icon icon="moonFill" size="1em" />
      </span>
      <Button on:click={toggleMenu} variant="ghost" class="block sm:hidden">
        <Icon icon="menuLine" size="2em" />
      </Button>
    </div>
  </navbar>
</header>
