import pluginBreaks from '@bytemd/plugin-breaks';
import pluginGemoji from '@bytemd/plugin-gemoji';
import pluginHighlightSsr from '@bytemd/plugin-highlight-ssr';
import pluginMathSsr from '@bytemd/plugin-math-ssr';
import pluginMediumZoom from '@bytemd/plugin-medium-zoom';
import pluginMermaid from '@bytemd/plugin-mermaid';

export const plugins = [
  pluginBreaks(),
  pluginGemoji(),
  pluginHighlightSsr({}),
  pluginMathSsr({}),
  pluginMediumZoom({}),
  pluginMermaid({}),
];
