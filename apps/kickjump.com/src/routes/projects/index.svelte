<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  import { GettingStartedCard } from '$modules/create-project';

  export const load: Load = () => ({ stuff: { title: 'Projects | KickJump' } });
</script>

<section class="grid sm:grid-cols-2 gap-8 h-min">
  <GettingStartedCard
    variant="primary"
    title="I am an open source creator 🎉"
    message="Raise funds for your next great open source project!"
    href="/projects/create"
    button="Create!"
  />
  <GettingStartedCard
    variant="secondary"
    title="I am an open source supporter 💖"
    message="Become a valued supporter of the next great open source projects!"
    href="/projects/explore"
    button="Explore!"
    align="text-right"
    class="sketchy-3"
  />
</section>
