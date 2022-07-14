<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  import { Button } from '$components';

  export const load: Load = () => ({ stuff: { title: 'Projects | KickJump' } });
</script>

<div aria-label="Projects List" class="container justify-self-center grid  px-8 sm:px-0  pt-8">
  <section class="grid sm:grid-cols-2 gap-8 h-min">
    <div class="card bg-primary text-primary-content">
      <div class="card-body">
        <h2 class="text-left">I am an open source creator 🎉</h2>
        <p class="my-6">Raise funds for your next great open source project!</p>
        <div class="card-actions justify-center">
          <Button href="/projects/create" variant="solid" size="lg">Create!</Button>
        </div>
      </div>
    </div>
    <div class="card bg-secondary text-primary-content sketchy-3">
      <div class="card-body">
        <h2 class="text-right">I am an open source supporter 💖</h2>
        <p class="my-6">Become a valued supporter of the next great open source projects!</p>
        <div class="card-actions justify-center">
          <Button href="/projects/explore" size="lg" theme="accent">Explore!</Button>
        </div>
      </div>
    </div>
  </section>
</div>
