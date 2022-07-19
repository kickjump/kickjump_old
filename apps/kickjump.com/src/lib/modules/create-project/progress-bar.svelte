<script lang="ts" context="module">
  import type { CreateProjectStep } from './project-steps.js';
</script>

<script lang="ts">
  export let selected = 0;
  export let steps: CreateProjectStep[] = [
    { href: '#', title: 'First' },
    { href: '#', title: 'Second' },
    { href: '#', title: 'Third' },
    { href: '#', title: 'Fourth' },
  ];
  const selectedClass =
    'flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-indigo-500 text-white';
  const defaultClass =
    'flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold bg-slate-100 text-slate-500';
</script>

<div class="px-4 pt-12 pb-8">
  <div class="max-w-md mx-auto w-full">
    <div class="relative">
      <div class="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200" aria-hidden="true" />
      <ul class="relative flex justify-between w-full">
        {#each steps as step, index}
          {@const classes = selected <= index ? selectedClass : defaultClass}
          <li>
            <a class={classes} href={step.href} title={step.title}>
              {index + 1}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
