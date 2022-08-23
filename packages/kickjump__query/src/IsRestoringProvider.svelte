<script lang="ts">
  import { setContext } from 'svelte';

  import { IS_RESTORING_CONTEXT } from '../';

  export let isRestoring = false;

  $: setContext(IS_RESTORING_CONTEXT, isRestoring);
</script>
