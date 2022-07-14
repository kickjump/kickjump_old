<script lang="ts">
  import clsx from 'clsx';

  export let label: string;
  let className = '';
  export { className as class };

  $: classes = clsx(
    'container',
    'justify-self-center',
    'grid',
    'px-8',
    'sm:px-0',
    'pt-8',
    className,
  );
</script>

<div aria-label={label} class={classes}><slot /></div>
