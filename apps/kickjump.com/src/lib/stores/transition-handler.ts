import { isFunction } from 'is-what';
import type { TransitionConfig } from 'svelte/transition';

import type { Maybe } from '$types';

const ANY_TRANSITION: TransitionAction = () => ({ delay: 0, duration: 0 });

export type TransitionAction = <Element extends HTMLElement, Config extends object>(
  element: Element,
  config: Config,
) => TransitionConfig;
export function useTransition<Transition extends TransitionAction>(
  transition: Maybe<Transition>,
): Transition {
  return transition ? transition : (ANY_TRANSITION as Transition);
}

export type TransitionTuple = [method: TransitionAction, config: object];
export type TransitionWithOptions = TransitionTuple | TransitionAction;

export function getTransitionConfig(options: Maybe<TransitionWithOptions>): TransitionTuple {
  if (isFunction(options)) {
    return [options, {}];
  }

  return options || ([ANY_TRANSITION, undefined] as any);
}
