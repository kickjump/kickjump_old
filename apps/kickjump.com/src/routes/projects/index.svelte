<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  import { Card } from '$components';

  export const load: Load = () => ({ stuff: { title: 'Projects | KickJump' } });
</script>

<h2>Create your own project</h2>
<section aria-label="Projects List">
  <Card />
</section>
