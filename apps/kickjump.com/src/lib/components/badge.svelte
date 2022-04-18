<script lang="ts">
  import type { PaperType } from '../types/index';

  export let type: PaperType = 'primary';
  export let rounded: boolean = false;
</script>

<span {...$$restProps} class="{$$restProps.class ?? ''} badge {type}" class:rounded>
  <slot />
</span>

<style>
  .badge.rounded {
    border-radius: 30%;
  }
</style>
