<script lang="ts">
  import { setStepContext, type StepContextData } from './step-context';
  export let stepIds: readonly [string, ...string[]];
  export let initialStep = stepIds[0];
  export let initialData: StepContextData = {};
  export let onFinish: () => void;

  const { nextStep, previousStep, step } = setStepContext({
    initialData,
    stepIds,
    initialStep,
    onFinish,
  });
</script>

<slot {nextStep} {previousStep} step={$step} />
