<script lang="ts">
  import { getStepContext } from './step-context';

  export let id: string;

  const { step, nextStep, previousStep } = getStepContext();
</script>

{#if $step === id}
  <slot {nextStep} {previousStep} />
{/if}
