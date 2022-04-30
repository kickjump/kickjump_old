<script lang="ts" context="module">
  import { Button } from '$components/buttons';
  import { ModalTitle } from '$components/modal';

  import { StepContext } from '../step-context';
  import StepLayout from '../step-layout.svelte';
  export const WALLET_RESULTS_ID = 'results' as const;
</script>

<script lang="ts">
  $: ({ errors, reset, nextStep } = StepContext.context);
  $: error = $errors.at(0);
</script>

{#if error}
  <StepLayout>
    <ModalTitle as="h3" slot="heading">Something went wrong 😢</ModalTitle>
    <svelte:fragment slot="content">
      <p>{error}</p>
    </svelte:fragment>
    <svelte:fragment slot="footer">
      <div class="flex-1 flex flex-col justify-end items-end gap-y-2 row-[1/1] col-[1/1] h-16">
        <div class="flex gap-x-7 justify-end items-end">
          <Button size="sm" theme="error" onClick={() => reset()}>Retry</Button>
          <Button size="sm" onClick={() => nextStep()}>I'm done 🤷‍♂️</Button>
        </div>
      </div>
    </svelte:fragment>
  </StepLayout>
{/if}
