<script lang="ts" context="module">
  import { Button, PageWrapper } from '$components';
  import { getStepHref, GettingStartedCard } from '$modules/create-project';

  export const load = () => {
    return {
      stuff: { animateTransition: true },
    };
  };
</script>

<div class="hero hero-height">
  <div class="hero-content text-center">
    <div class="max-w-2xl">
      <h1 class="pb-14 gradient-text">
        <strong>Unlock</strong> financial freedom with open source
      </h1>
      <Button href="/projects" theme="primary" variant="outline" size="lg" class="border-4"
        >Get Started</Button
      >
    </div>
  </div>
</div>
<PageWrapper label="Projects">
  <section class="grid sm:grid-cols-2 gap-8 h-min" aria-label="Projects List">
    <GettingStartedCard
      variant="primary"
      title="I am an open source creator 🎉"
      message="Raise funds for your next great open source project!"
      href={getStepHref(0)}
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
</PageWrapper>

<style>
  .hero-height {
    min-height: 50vh;
  }
</style>
