<script lang="ts" context="module">
  import { Editor } from 'bytemd';

  import { plugins } from './plugins.js';
</script>

<script lang="ts">
  export let value: string;
  export let placeholder = '';
  export let readOnly = false;

  function onChange(event: CustomEvent<{ value: string }>) {
    value = event.detail.value;
  }
</script>

<Editor {value} {plugins} on:change={onChange} {placeholder} mode="tab" editorConfig={{ readOnly }}>
  hello
</Editor>
