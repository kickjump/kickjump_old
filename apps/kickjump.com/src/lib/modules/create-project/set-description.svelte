<script lang="ts" context="module">
  import 'bytemd/dist/index.css';

  import pluginBreaks from '@bytemd/plugin-breaks';
  import pluginGemoji from '@bytemd/plugin-gemoji';
  import pluginHighlightSsr from '@bytemd/plugin-highlight-ssr';
  import pluginMathSsr from '@bytemd/plugin-math-ssr';
  import pluginMediumZoom from '@bytemd/plugin-medium-zoom';
  import pluginMermaid from '@bytemd/plugin-mermaid';
  import { trpc } from '@kickjump/trpc/client';
  import { Editor } from 'bytemd';

  import { persistedProject } from './project-steps.js';

  const plugins = [
    pluginBreaks(),
    pluginGemoji(),
    pluginHighlightSsr({}),
    pluginMathSsr({}),
    pluginMediumZoom({}),
    pluginMermaid({}),
  ];
</script>

<script lang="ts">
  let value: string;

  const updateDescription = trpc;

  function onChange(event: CustomEvent<{ value: string }>) {
    value = event.detail.value;
  }
</script>

<Editor {value} {plugins} on:change={onChange} />
