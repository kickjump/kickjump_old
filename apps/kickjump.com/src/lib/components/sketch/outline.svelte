<script lang="ts">
  import cx from 'clsx';

  import {
    type BorderWidth,
    type SketchOptions,
    BORDER_WIDTH,
    generateSketchProps,
  } from './generate-sketch-props';

  export let seed = 40;
  export let iterations = 1;
  export let filters: SketchOptions['filters'] = undefined;
  export let shapes: SketchOptions['shapes'] = undefined;
  export let rotations: SketchOptions['rotations'] = [];
  export let rotationClamp: SketchOptions['rotationClamp'] = [0, 2];
  export let border: BorderWidth = 'md';

  let className = '';
  export { className as class };

  $: props = generateSketchProps(seed, { iterations, filters, shapes, rotationClamp, rotations });
  $: baseClass = cx(
    'absolute',
    'inset-0',
    'transition-all',
    BORDER_WIDTH[border],
    'border-current',
    className,
  );
  $: classes = [...'#'.repeat(props.iterations)].map((_, index) => ({
    class: cx(baseClass, props.shapes[index], props.filters[index]),
    rotation: `rotate(${props.rotations[index]}deg)`,
  }));
</script>

{#each classes as cls}
  <span class={cls.class} style:transform={cls.rotation} />
{/each}
