<script context="module">
  export let metadata = {
    title: '',
  };

  export function load() {
    return { stuff: { title: metadata.title } };
  }
</script>

<div class="page-wrapper prose-xl py-12">
  <slot />
</div>
