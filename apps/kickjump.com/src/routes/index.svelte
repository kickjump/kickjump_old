<script lang="ts">
  import Button from '$lib/components/button.svelte';
  import Icon from '$lib/components/icon.svelte';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button on:click={(_e) => alert('button clicked!')} on:yo={(e) => e.detail.awesome}>Solid</Button>
<Button variant="outline" theme="primary">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Icon icon="github" class="text-primary" size={500} />
