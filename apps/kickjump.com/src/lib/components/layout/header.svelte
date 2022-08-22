<script lang="ts">
  import { EnhancedURL } from '@kickjump/svelte-auth/client';
  import themeStore, { setTheme } from 'svelte-themes';

  import { page } from '$app/stores';
  import { Button } from '$components/buttons';
  import Icon from '$components/icon/icon.svelte';
  import Logo from '$components/logo/logo.svelte';
  import { auth } from '$lib/auth';
  import { session } from '$stores/session';
  import { matchesHref } from '$utils/core';

  import { IconToggle } from '../toggles';

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark');
  }

  const items = [
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
  ];

  $: ({ user } = $session);
  // $: console.log($session);
  $: loginPath = EnhancedURL.of({
    path: '/login',
    base: $page.url,
    params: { redirect: $page.url.searchParams.get('redirect') ?? $page.url.href },
  }).searchPath;
  $: loggedIn = !!$session.user?.id;
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
  $: toggleLabel = isDark ? 'Light Mode Toggle' : 'Dark Mode Toggle';
</script>

<header
  class="inline-grid place-items-center backdrop-blur-sm sticky top-0 sketchy-1 shadow-lg bg-base-100/50 z-10"
>
  <navbar class="h-20 container grid gap-x-8 items-center grid-cols-navbar">
    <a href="/" aria-label="Home" class="justify-self-center">
      <Logo size="4em" />
    </a>

    <div class="hidden sm:flex justify-self-end gap-x-4">
      {#each items as { href, label } (href)}
        <Button {href} variant="ghost" active={matchesHref($page, href)}>{label}</Button>
      {/each}
      <IconToggle
        checked={isDark}
        on:change={toggleTheme}
        swap="moonFill"
        initial="sunFill"
        label={toggleLabel}
      />
    </div>
    {#key user}
      <div class="pl-8 justify-self-end flex flex-row gap-x-1">
        <Button variant="ghost" class="block sm:hidden">
          <Icon icon="menuLine" size="2em" />
        </Button>
        {#if loggedIn}
          <Button href={auth.logoutUrl().searchPath} variant="outline">Logout</Button>
        {:else}
          <Button href={loginPath} variant="outline">Login</Button>
        {/if}
      </div>
    {/key}
  </navbar>
</header>
