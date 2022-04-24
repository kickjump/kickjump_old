<script>
  import Icon from '$components/icon.svelte';
  import AltLogo from '$components/logo/alt-logo.svelte';
</script>

<footer class="grid w-full items-center bg-neutral sketchy-footer relative">
  <div class="footer items-center p-4 bg-neutral text-neutral-content container place-self-center">
    <div class="items-center grid-flow-col">
      <AltLogo size="3em" class="text-neutral" />
      <p>Copyright © {new Date().getFullYear()} - KickJump Ltd</p>
    </div>
    <div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
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
