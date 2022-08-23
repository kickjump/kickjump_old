<script lang="ts">
  import { setContext } from 'svelte';

  import { createIsResetStore, ERROR_RESET_BOUNDARY_CONTEXT } from '../';

  setContext(ERROR_RESET_BOUNDARY_CONTEXT, createIsResetStore());
</script>

<slot />
