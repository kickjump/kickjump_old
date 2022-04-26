import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';

export const STEP_CONTEXT_NAME = '$$step-wizard$$';

export interface StepContext {
  /**
   * Zero indexed step number.
   */
  step: Writable<number>;

  /**
   * The data that can be customized by each step.
   */
  data: Writable<Partial<StepContextData>>;

  /**
   * Skips to the next step.
   */
  nextStep: () => void;

  /**
   * Returns to the previous step.
   */
  previousStep: () => void;

  /**
   * Update the data provided.
   */
  updateData: (update: Partial<StepContextData>) => void;
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

export function setStepContext(stepContext: StepContext) {
  setContext(STEP_CONTEXT_NAME, stepContext);
}

export interface StepContextData {}
