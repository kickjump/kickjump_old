<script lang="ts">
  import { type StepContextData, StepContext } from './step-context';
  export let stepIds: readonly [string, ...string[]];
  export let initialStep = stepIds[0];
  export let initialData: StepContextData = {};
  export let onFinish: () => void;

  const context = StepContext.create({ initialData, stepIds, initialStep, onFinish });
  $: step = context.step;
</script>

<slot nextStep={context.nextStep} previousStep={context.previousStep} step={$step} />
