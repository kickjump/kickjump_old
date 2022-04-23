<script lang="ts">
  import Icon from '$components/icon.svelte';
  import type { IconType } from '$utils/icons';

  export let checked: boolean;
  export let initial: IconType;
  export let swap: IconType;
  export let size: string | number = '1.5em';
</script>

<label class="swap swap-rotate">
  <!-- this hidden checkbox controls the state -->
  <input type="checkbox" on:change {checked} class="invisible" />
  <Icon icon={initial} {size} class="swap-on fill-current" />
  <Icon icon={swap} {size} class="swap-off fill-current" />
</label>
