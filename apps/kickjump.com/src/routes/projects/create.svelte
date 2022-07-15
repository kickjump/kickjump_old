<script lang="ts">
  import { Button } from '$components';
  import { auth } from '$lib/auth';
  import SelectRepositories from '$modules/create-project/select-repositories.svelte';
  const href = auth.strategyUrl('github', 'install').searchPath;
  console.log({ href });
</script>

<!-- <VirtualList /> -->
<SelectRepositories />
<div>
  <Button {href}>Add Installation</Button>
</div>
