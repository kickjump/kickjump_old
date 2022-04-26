import { getContext, setContext } from 'svelte';
import { type Readable, derived, writable } from 'svelte/store';
import invariant from 'tiny-invariant';

export const STEP_CONTEXT_NAME = '$$step-wizard$$';

export interface StepContext {
  /**
   * The current step id.
   */
  step: Readable<string>;

  /**
   * The current step index.
   */
  stepIndex: Readable<number>;

  /**
   * The steps that have been registered.
   *
   * TODO
   */
  // registeredSteps: Readable<number>;

  /**
   * The data that can be customized by each step.
   */
  data: Readable<Partial<StepContextData>>;

  /**
   * Skips to the next step.
   */
  nextStep: () => void;

  /**
   * Returns to the previous step.
   */
  previousStep: () => void;

  /**
   * Jump to a specific step.
   */
  jumpToStep: (step: string) => void;

  /**
   * Update the data provided.
   */
  updateData: (update: Partial<StepContextData>) => void;

  /**
   * Register a new step.
   */
  // registerStep: (index: number) => void;
}

export function getStepContext(): StepContext {
  const context = getContext<StepContext | undefined>(STEP_CONTEXT_NAME);

  if (!context) {
    throw new Error(
      'StepWizard compound components cannot be rendered outside the StepWizard component',
    );
  }

  return context;
}

interface StepProps {
  initialData?: Partial<StepContextData>;
  initialStep?: string;
  stepIds: readonly [string, ...string[]];
}

export function setStepContext(props: StepProps) {
  const { stepIds, initialData = {}, initialStep = stepIds[0] } = props;
  const step = writable(initialStep);
  const stepIndex = derived(step, getStepIndex);
  const data = writable(initialData);

  function getStepIndex($step: string): number {
    return stepIds.indexOf($step);
  }

  function nextStep() {
    step.update((value) => {
      const next = getStepIndex(value) + 1;
      const stepId = next >= stepIds.length ? value : stepIds[next];
      invariant(
        stepId,
        `'nextStep' produced an invalid stepId: ${stepId}, not found in stepIds: ${stepIds.join(
          ', ',
        )}`,
      );

      return stepId;
    });
  }

  function previousStep() {
    step.update((value) => {
      const previous = getStepIndex(value) - 1;
      const stepId = previous < 0 ? stepIds[0] : stepIds[previous];
      invariant(
        stepId,
        `'previousStep' produced an invalid stepId: ${stepId}, not found in stepIds: ${stepIds.join(
          ', ',
        )}`,
      );

      return stepId;
    });
  }

  function jumpToStep(stepId: string) {
    step.update((value) => {
      return stepId.includes(value) ? stepId : value;
    });
  }

  function updateData(update: Partial<StepContextData>) {
    data.update((value) => {
      return {
        ...value,
        ...update,
      };
    });
  }

  const stepContext: StepContext = {
    step: asReadable(step),
    stepIndex: asReadable(stepIndex),
    data: asReadable(data),
    nextStep,
    previousStep,
    updateData,
    jumpToStep,
  };

  setContext<StepContext>(STEP_CONTEXT_NAME, stepContext);
  return stepContext;
}

function asReadable<Type, Store extends Readable<Type>>(store: Store): Readable<Type> {
  return { subscribe: store.subscribe };
}

export interface StepContextData {}
