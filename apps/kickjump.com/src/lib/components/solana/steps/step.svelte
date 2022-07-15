<script lang="ts">
  import { StepContext } from './step-context';

  export let id: string;

  let { step, nextStep, previousStep } = StepContext.context();
</script>

{#if $step === id}
  <slot {nextStep} {previousStep} />
{/if}
