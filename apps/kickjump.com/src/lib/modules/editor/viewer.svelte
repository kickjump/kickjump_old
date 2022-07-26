<script lang="ts" context="module">
  import { Viewer } from 'bytemd';

  import { plugins } from './plugins.js';
</script>

<script lang="ts">
  export let value: string;
</script>

<Viewer {value} {plugins} />
