<script lang="ts">
  import { useQuery } from '../../src/index.js';

  const query = useQuery(['set-default-data-value'], async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return 'test';
  });

  // $: console.log($query);
</script>

<div>
  <h1>{$query.data ?? 'default'}</h1>
</div>
