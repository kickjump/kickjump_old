import { isFunction } from 'is-what';
import { getContext, hasContext, setContext } from 'svelte';
import { type Readable, type Writable, derived, writable } from 'svelte/store';
import invariant from 'tiny-invariant';

import { asReadable } from '$stores/utils';

const CONTEXT_KEY = Symbol('$$step-context$$');

interface Writables {
  step: Writable<string>;
  data: Writable<Partial<StepContextData>>;
  errors: Writable<string[]>;
  successes: Writable<string[]>;
}

interface Readables {
  stepIndex: Readable<number>;
  step: Readable<string>;
  data: Readable<Partial<StepContextData>>;
  errors: Readable<string[]>;
  successes: Readable<string[]>;
}

interface Props {
  initialData?: Partial<StepContextData>;
  initialStep?: string;
  stepIds: readonly [string, ...string[]];
  onFinish: () => void;
}

export class StepContext {
  /**
   * Dynamically provide the context when accessed.
   */
  static context(): StepContext {
    const context = getContext<StepContext | undefined>(CONTEXT_KEY);
    invariant(context, 'StepProvider compound components cannot be rendered outside the context');

    return context;
  }

  /**
   * Check if the context exists for the current component.
   */
  static has(): boolean {
    return hasContext(CONTEXT_KEY);
  }

  /**
   * Create a new context.
   */
  static create(props: Props): StepContext {
    const context = new StepContext(props);
    setContext<StepContext>(CONTEXT_KEY, context);

    return context;
  }

  readonly #props: Required<Props>;
  readonly #writables: Writables;
  readonly #readables: Readables;

  /**
   * The current step id.
   */
  get step(): Readable<string> {
    return this.#readables.step;
  }

  /**
   * The current step index which is derived from the step id.
   */
  get stepIndex(): Readable<number> {
    return this.#readables.stepIndex;
  }

  /**
   * Track the errors.
   */
  get errors(): Readable<string[]> {
    return this.#readables.errors;
  }

  get successes(): Readable<string[]> {
    return this.#readables.successes;
  }

  /**
   * The data that can be customized by each step.
   */
  get data(): Readable<StepContextData> {
    return this.#readables.data;
  }

  private constructor(props: Props) {
    const { stepIds, initialData = {}, initialStep = stepIds[0], onFinish } = props;
    this.#props = { stepIds, initialData, initialStep, onFinish };
    const step = writable(initialStep);
    const stepIndex = derived(step, ($step) => this.#getStepIndex($step));
    const data = writable(initialData);
    const errors = writable<string[]>([]);
    const successes = writable<string[]>([]);

    this.#writables = { step, data, errors, successes };
    this.#readables = {
      stepIndex,
      step: asReadable(step),
      data: asReadable(data),
      errors: asReadable(errors),
      successes: asReadable(successes),
    };
  }

  /**
   * Increment the current step index.
   */
  nextStep = () => {
    const { onFinish, stepIds } = this.#props;
    this.#writables.step.update((value) => {
      const current = this.#getStepIndex(value);
      const next = current + 1;

      if (next > stepIds.length - 1) {
        onFinish();
        return value;
      }

      const stepId = next >= stepIds.length ? value : stepIds[next];
      invariant(
        stepId,
        `'nextStep' produced an invalid stepId: ${stepId}, not found in stepIds: ${stepIds.join(
          ', ',
        )}`,
      );

      return stepId;
    });
  };

  /**
   * Decrement the current step index.
   */
  previousStep = () => {
    const { stepIds } = this.#props;

    this.#writables.step.update((value) => {
      const previous = this.#getStepIndex(value) - 1;
      const stepId = previous <= 0 ? stepIds[0] : stepIds[previous];
      invariant(
        stepId,
        `'previousStep' produced an invalid stepId: ${stepId}, not found in stepIds: ${stepIds.join(
          ', ',
        )}`,
      );

      return stepId;
    });
  };

  /**
   * Add an error to the error list which can be displayed on a dedicated
   * results step.
   */
  addError = (error: string, ...rest: string[]) => {
    this.#writables.errors.update((errors) => [...errors, error, ...rest]);
  };

  addSuccess = (success: string, ...rest: string[]) => {
    this.#writables.successes.update((successes) => [...successes, success, ...rest]);
  };

  /**
   * Reset everything.
   *
   * This is a promise to that it is resolved after the store has been reset.
   */
  reset = () => {
    const { initialData, initialStep } = this.#props;
    const { successes, data, errors } = this.#writables;
    data.set(initialData);
    this.jumpToStep(initialStep);
    errors.set([]);
    successes.set([]);
  };

  /**
   * Jump to the requested step.
   */
  jumpToStep = (step: string) => {
    const { stepIds } = this.#props;

    this.#writables.step.update((value) => {
      return stepIds.includes(value) ? step : value;
    });
  };

  /**
   * Update the context data.
   */
  updateData = (update: UpdateDataParam) => {
    this.#writables.data.update((value) => {
      return {
        ...value,
        ...(isFunction(update) ? update(value) : update),
      };
    });
  };

  #getStepIndex($step: string): number {
    const newIndex = this.#props.stepIds.indexOf($step);
    return newIndex;
  }
}

type UpdateDataParam =
  | Partial<StepContextData>
  | ((data: Partial<StepContextData>) => Partial<StepContextData>);

export interface StepContextData {}
