<script lang="ts">
  import cx from 'clsx';

  import { type SketchOptions, generateSketchProps } from './generate-sketch-props';

  export let seed = 50;
  export let iterations = 1;
  export let filters: SketchOptions['filters'] = undefined;
  export let shapes: SketchOptions['shapes'] = [];
  export let rotations: SketchOptions['rotations'] = [];
  export let rotationClamp: SketchOptions['rotationClamp'] = [0, 2];

  let className = '';
  export { className as class };

  $: props = generateSketchProps(seed, { iterations, filters, shapes, rotationClamp, rotations });
  $: baseClass = cx(
    'absolute',
    'inset-0',
    'transition',
    'group-hover:border-b-2',
    'group-hover:translate-y-1',
    'group-active:border-b-2',
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
