<script lang="ts">
  import { type IconType, Icon } from '$components/icon';

  export let checked: boolean;
  export let initial: IconType;
  export let swap: IconType;
  export let label: string;
  export let size: string | number | null = null;
</script>

<label class="swap swap-rotate hover:bg-base-content hover:bg-opacity-20 px-3 sketchy-5" aria-label={label}>
  <!-- this hidden checkbox controls the state -->
  <input type="checkbox" on:change {checked} class="invisible" data-testid="theme-toggle-checkbox" />
  <Icon icon={initial} {size} class="swap-on fill-current" />
  <Icon icon={swap} {size} class="swap-off fill-current" />
</label>
