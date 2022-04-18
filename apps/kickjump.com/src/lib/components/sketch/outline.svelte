<script lang="ts">
  import { range } from '$lib/utils/helpers';
  import { type BorderWidth, BORDER_WIDTH } from './generate-sketch-props';

  import cx from 'clsx';

  import { generateSketchProps, type SketchOptions } from './generate-sketch-props';

  export let seed: number = 40;
  export let iterations = 1;
  export let filters: SketchOptions['filters'] = undefined;
  export let shapes: SketchOptions['shapes'] = undefined;
  export let rotations: SketchOptions['rotations'] = [];
  export let rotationClamp: SketchOptions['rotationClamp'] = [0, 2];
  export let border: BorderWidth = 'md';

  let className: string = '';
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
  $: classes = range(props.iterations).map((ii) => ({
    class: cx(baseClass, props.shapes[ii], props.filters[ii]),
    rotation: `rotate(${props.rotations[ii]}deg)`,
  }));
</script>

{#each classes as cls}
  <span class={cls.class} style:transform={cls.rotation} />
{/each}
