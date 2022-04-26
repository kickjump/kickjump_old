<script lang="ts">
  import { setStepContext, type StepContextData } from './step-context';
  export let stepIds: readonly [string, ...string[]];
  export let initialStep = stepIds[0];
  export let initialData: StepContextData = {};

  const { nextStep, previousStep, step } = setStepContext({ initialData, stepIds, initialStep });
</script>

<slot {nextStep} {previousStep} step={$step} />
