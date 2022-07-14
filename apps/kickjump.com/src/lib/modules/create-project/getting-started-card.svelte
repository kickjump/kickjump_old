<script lang="ts">
  import { type ButtonTheme, Button } from '$components';

  let className = '';
  export let variant: 'primary' | 'secondary' = 'primary';
  export let title: string;
  export let message: string;
  export let href: string;
  export let button: string;
  export let align = 'text-left';

  export { className as class };
  $: theme = (variant === 'primary' ? 'default' : 'accent') as ButtonTheme;
</script>

<div class="card bg-{variant} text-primary-content {className}">
  <div class="card-body">
    <h2 class={align}>{title}</h2>
    <p class="my-6">{message}</p>
    <div class="card-actions justify-center">
      <Button {href} {theme} size="lg">{button}</Button>
    </div>
  </div>
</div>
