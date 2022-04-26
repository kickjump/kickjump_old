<script lang="ts">
  import { getStepContext } from './step-context';

  export let index: number;

  const { step, nextStep, previousStep } = getStepContext();
  console.log({ $step, index });
</script>

{#if $step === index}
  <slot {nextStep} {previousStep} />
{/if}
