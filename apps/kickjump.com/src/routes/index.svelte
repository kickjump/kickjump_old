<script lang="ts">
  import SvelteSeo from 'svelte-seo';
  import type { SvelteSeoProps } from 'svelte-seo/types/SvelteSeo';

  import { Button } from '$components';
  const DEFAULT_SEO: SvelteSeoProps = {
    title: 'KickJump',
    description: 'Your toolkit for financially sustainable open source development.',
    twitter: {
      site: '@kickjumpco',
      title: 'KickJump',
      description: 'Your toolkit for financially sustainable open source development.',
    },
  };
</script>

<SvelteSeo {...DEFAULT_SEO} />

<div class="hero hero-height">
  <div class="hero-content text-center">
    <div class="max-w-2xl">
      <h1 class="pb-14 gradient-text">
        <strong>Unlock</strong> financial freedom with open source
      </h1>
      <!-- <p class="py-6"
        >Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
        quasi. In deleniti eaque aut repudiandae et a id nisi.</p
      > -->
      <Button onClick={() => {}} theme="primary" variant="outline" size="lg" class="border-4"
        >Get Started</Button
      >
    </div>
  </div>
</div>

<style>
  .hero-height {
    min-height: 50vh;
  }
</style>
