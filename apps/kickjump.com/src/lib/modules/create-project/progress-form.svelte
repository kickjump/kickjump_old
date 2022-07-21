<script lang="ts" context="module">
  import Icon from '../../components/icon/icon.svelte';
  import { getStepHref, PROJECT_CREATE_STEPS } from './project-steps.js';
</script>

<script lang="ts">
  export let heading: string;
  export let index: number;

  const previous = PROJECT_CREATE_STEPS[index - 1];
  const next = PROJECT_CREATE_STEPS[index + 1];
</script>

<div class="px-4 pt-5">
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl text-slate-800 font-bold pb-14">{heading}</h1>
    <!-- Form -->
    <slot />
    <div class="flex items-center justify-between">
      {#if previous}
        <a
          class="text-sm underline hover:no-underline text-accent-content inline-flex items-center"
          href={getStepHref(index - 1)}
          title={previous.title}
        >
          <Icon icon="arrowLeft" class="mr-2" /> Back
        </a>
      {/if}
      {#if next}
        <a
          class="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-auto"
          href={getStepHref(index + 1)}
          title={next.title}
        >
          Next Step <Icon icon="arrowRight" class="ml-2" />
        </a>
      {/if}
    </div>
  </div>
</div>
