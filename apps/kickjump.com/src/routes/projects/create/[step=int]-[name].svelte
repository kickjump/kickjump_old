<script lang="ts" context="module">
  import { browser } from '$app/env';
  import {
    getStepHref,
    persistedProject,
    ProgressBar,
    ProgressForm,
    PROJECT_CREATE_STEPS,
  } from '$modules/create-project';
</script>

<script lang="ts">
  export let index: number;
  const step = PROJECT_CREATE_STEPS.at(index) ?? PROJECT_CREATE_STEPS[0];

  async function navigateToStart() {
    const { goto } = await import('$app/navigation');
    await goto(getStepHref(0));
  }

  $: if (browser && !$persistedProject && index !== 0) {
    navigateToStart();
  }

  $: console.log({ $persistedProject });
</script>

<div class="grid-cols-2 grid ">
  <section>
    <ProgressBar />
    <ProgressForm heading={step.title} {index}>
      <svelte:component this={step.component} />
      <div class="px-8 py-8" />
    </ProgressForm>
  </section>
</div>

<!-- <VirtualList /> -->
<!-- <SelectRepositories /> -->
<!-- <ViewUserRepos /> -->
