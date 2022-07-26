<script lang="ts" context="module">
</script>

<script lang="ts">
  export let index = 0;
  const PROJECT_CREATE_STEPS = [
    { title: '' },
    { title: '' },
    { title: '' },
    { title: '' },
    { title: '' },
  ];
  const steps = PROJECT_CREATE_STEPS.map((data) => ({
    href: '#',
    title: data.title,
  }));

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
        {#each steps as step, ii}
          {@const classes = index >= ii ? selectedClass : defaultClass}
          <li>
            <a class={classes} href={step.href} title={step.title}>
              {ii + 1}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
