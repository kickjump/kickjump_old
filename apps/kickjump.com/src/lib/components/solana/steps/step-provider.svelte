<script lang="ts">
  import { writable } from 'svelte/store';
  import { setStepContext, type StepContextData } from './step-context';
  export let initialStep = 0;
  export let initialData: StepContextData = {};

  let step = writable(initialStep);
  let data = writable(initialData);

  function nextStep() {
    $step += 1;
  }

  function previousStep() {
    if ($step > 0) {
      $step -= 1;
    }
  }

  function updateData(newData: Partial<StepContextData>) {
    $data = { ...$data, ...newData };
  }

  setStepContext({ step, nextStep, previousStep, data, updateData });
</script>

<slot {nextStep} {previousStep} />
