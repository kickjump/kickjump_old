<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  import { GettingStartedCard } from '$modules/create-project';

  export const load: Load = () => ({ stuff: { title: 'Projects | KickJump' } });
</script>

<section class="grid sm:grid-cols-2 gap-8 h-min" aria-label="Projects List">
  <h3>No projects found</h3>
</section>
