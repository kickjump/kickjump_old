<script>
  import Icon from '$components/icon.svelte';
  import AltLogo from '$components/logo/alt-logo.svelte';
</script>

<footer
  class="grid w-full gap-x-10 gap-y-4 text-sm leading-5 items-center p-4 bg-gray-800 text-background"
>
  <div class="container grid-flow-row md:grid-flow-col place-items-start grid place-self-center">
    <div class="items-center grid-flow-col grid place-items-start gap-2">
      <AltLogo size="3em" class="text-gray-800" />
      <p>Copyright © {new Date().getFullYear()} - KickJump Ltd</p>
    </div>
    <div
      class="grid place-items-start grid-flow-col gap-4 md:place-self-center md:justify-self-end"
    >
      <a href="/r/github" target="_blank" class="hover:text-gray-300 active:text-gray-400">
        <Icon icon="github" size="2em" />
      </a>
      <a href="/r/discord" target="_blank" class="hover:text-gray-300 active:text-gray-400">
        <Icon icon="discord" size="2em" />
      </a>
      <a href="/r/twitter" target="_blank" class="hover:text-gray-300 active:text-gray-400">
        <Icon icon="twitter" size="2em" />
      </a>
    </div>
  </div>
</footer>
