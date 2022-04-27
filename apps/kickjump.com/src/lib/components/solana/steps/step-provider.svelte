<script lang="ts">
  import { createStepContext, type StepContextData } from './step-context';
  export let stepIds: readonly [string, ...string[]];
  export let initialStep = stepIds[0];
  export let initialData: StepContextData = {};
  export let onFinish: () => void;

  const context = createStepContext({ initialData, stepIds, initialStep, onFinish });
  $: step = context.step;
</script>

<slot nextStep={context.nextStep} previousStep={context.previousStep} step={$step} />
