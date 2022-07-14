export const ALERT_TYPE = /*tw*/ {
  default: { style: '', icon: undefined },
  /** Alert with `info` color */
  info: { style: 'alert-info', icon: 'info' },
  /** Alert with `success` color */
  success: { style: 'alert-success', icon: 'checkboxCircle' },
  /** Alert with `warning` color */
  warning: { style: 'alert-warning', icon: 'warning' },
  /** Alert with `error` color */
  error: { style: 'alert-error', icon: 'error' },
} as const;

export type AlertType = keyof typeof ALERT_TYPE;

export type AlertInteraction =
  | { type: 'dismiss' }
  | {
      type: 'confirm';
      accept?: string;
      deny?: string;
    }
  | { type: 'prompt'; text?: string };

export type AlertResult = { type: 'dismiss' | 'prompt' } | { type: 'confirm'; accept: boolean };

declare global {
  namespace svelte {
    namespace JSX {
      interface DOMAttributes<T> {
        oninteraction?: (event: CustomEvent<AlertResult>) => void;
      }
    }
  }
}
