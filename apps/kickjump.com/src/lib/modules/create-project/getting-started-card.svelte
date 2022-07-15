<script lang="ts">
  import clsx from 'clsx';

  import { type ButtonTheme, Button } from '$components';

  let className = '';
  export let variant: 'primary' | 'secondary' = 'primary';
  export let title: string;
  export let message: string;
  export let href: string;
  export let button: string;
  export let align = 'text-left';

  export { className as class };
  $: variantClass = variant === 'primary' ? 'bg-primary' : 'bg-secondary';
  $: theme = (variant === 'primary' ? 'default' : 'accent') as ButtonTheme;
  $: classes = clsx(`card text-primary-content`, variantClass, className);
</script>

<div class={classes}>
  <div class="card-body">
    <h2 class={align}>{title}</h2>
    <p class="my-6">{message}</p>
    <div class="card-actions justify-center">
      <Button {href} {theme} size="lg">{button}</Button>
    </div>
  </div>
</div>
