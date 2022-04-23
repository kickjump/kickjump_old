<script lang="ts">
  import { Button } from '$components/buttons';
  import { Icon } from '$components';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button on:click={(_e) => alert('button clicked!')} on:yo={(e) => e.detail.awesome}>Solid</Button>
<Button variant="outline" theme="primary">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Icon icon="github" class="text-primary" size={500} />

<h4>Ideas for more sketchy borders</h4>
<ol>
  <li><a href="https://codepen.io/jackharner/pen/oMaBpZ">Borders with images</a></li>
  <li><a href="https://codepen.io/piccalilli/pen/MPLzay">Borders with <code>::before</code></a></li>
</ol>
