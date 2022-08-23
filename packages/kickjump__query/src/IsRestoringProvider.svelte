<script lang="ts">
  import { setContext } from 'svelte';

  import { IS_RESTORING_CONTEXT } from './use-is-restoring.js';

  export let isRestoring = false;

  $: setContext(IS_RESTORING_CONTEXT, isRestoring);
</script>
