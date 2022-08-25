<script lang="ts">
  import { marked } from 'marked';

  export let value: string;
</script>

<div class="prose-base">{@html marked(value)}</div>
