/**
 * Adapted from `@testing-library/events` to support more intuitive typing
 * within playwright tests for this project.
 *
 * The plan is to extract this into it's own project eventually.
 */

import delay from 'delay';
import type { Page } from 'playwright-core';

import { isApple, selectAll } from './utils.js';

/**
 * A function which creates a typist with custom options.
 *
 * ```ts
 * import { createTypist } from 'playwright-typist';
 *
 * const typist = createTypist()
 *
 * test('this is the typist', () => {
 *   typist('Hello,{enter}World!')
 * });
 * ```
 *
 * #### Special characters
 *
 * The following special character strings are supported:
 *
 * | Text string   | Key       | Modifier   | Notes                                                                                                                                                               |
 * | ------------- | --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 * | `{enter}`     | Enter     | N/A        | Will insert a newline character (`<textarea />` only).                                                                                                              |
 * | `{space}`     | `' '`     | N/A        |                                                                                                                                                                     |
 * | `{esc}`       | Escape    | N/A        |                                                                                                                                                                     |
 * | `{backspace}` | Backspace | N/A        | Will delete the previous character (or the characters within the `selectedRange`, see example below).                                                               |
 * | `{del}`       | Delete    | N/A        | Will delete the next character (or the characters within the `selectedRange`, see example below)                                                                    |
 * | `{selectall}` | N/A       | N/A        | Selects all the text of the element. Note that this will only work for elements that support selection ranges (so, not `email`, `password`, `number`, among others) |
 * | `{shift}`     | Shift     | `shiftKey` | Does **not** capitalize following characters.                                                                                                                       |
 * | `{ctrl}`      | Control   | `ctrlKey`  |                                                                                                                                                                     |
 * | `{alt}`       | Alt       | `altKey`   |                                                                                                                                                                     |
 * | `{meta}`      | OS        | `metaKey`  |                                                                                                                                                                     |
 * | `{cmd}`       | OS        | `metaKey`  | Meta key for mac                                                                                                                                                    |
 * | `{mod}`       | OS        | `metaKey`  | Meta key on mac, Control on Windows.                                                                                                                                |
 *
 *  **A note about modifiers:** Modifier keys (`{shift}`, `{ctrl}`, `{alt}`,
 * `{meta}`) will activate their corresponding event modifiers for the duration
 * of type command or until they are closed (via `{/shift}`, `{/ctrl}`, etc.).
 * If they are not closed explicitly, then events will be fired to close them
 * automatically (to disable this, set the `skipAutoClose` option to `true`).
 *
 * <!-- space out these notes -->
 *
 * We take the same [stance as
 * Cypress](https://docs.cypress.io/api/commands/type.html#Modifiers) in that we
 * do not simulate the behavior that happens with modifier key combinations as
 * different operating systems function differently in this regard. An example
 * of an usage with a selection range:
 *
 * ```ts
 * import { typist } from 'playwright-typist';
 * const type = createTypist({ delay: 10 });
 *
 * test('`typing like a pro`', async () => {
 *   await type('Hello{enter}World!');
 * });
 * ```
 */
export function typist(options: TypistOptions) {
  return async function type(text: string, optionsOverride?: TypistOptions): Promise<void> {
    for (const action of createActionQueue(text, { ...options, ...optionsOverride })) {
      await action(options);
    }
  };
}

export interface TypistOptions {
  /**
   * Provide a page to the typist.
   */
  page: Page;

  /**
   * Set a delay in `ms` when typing.
   *
   * @default undefined - no delay.
   */
  delay?: number | undefined;

  /**
   * Set to true to skip auto closing the event modifiers.
   */
  skipAutoClose?: boolean | undefined;

  /**
   * Extra actions to add.
   */
  actions?: Record<string, TypistAction> | undefined;
}

const defaultModifierActions: Record<string, TypistAction> = {
  // Closable modifier tags.
  ...createCloseableAction('shift', 'Shift'),
  ...createCloseableAction('ctrl', 'Control'),
  ...createCloseableAction('alt', 'Alt'),
  ...createCloseableAction('meta', 'Meta'),
  ...createCloseableAction('mod', isApple() ? 'Meta' : 'Control'),
  ...createCloseableAction('cmd', 'Meta'),

  // General modifiers.
  '{selectall}': ({ delay, page }: TypistOptions) => selectAll({ delay, page }),
  '{capslock}': ({ delay, page }: TypistOptions) => page.keyboard.press('CapsLock', { delay }),
  '{arrowleft}': ({ delay, page }: TypistOptions) => page.keyboard.press('ArrowLeft', { delay }),
  '{arrowright}': ({ delay, page }: TypistOptions) => page.keyboard.press('ArrowRight', { delay }),
  '{arrowdown}': ({ delay, page }: TypistOptions) => page.keyboard.press('ArrowDown', { delay }),
  '{arrowup}': ({ delay, page }: TypistOptions) => page.keyboard.press('ArrowUp', { delay }),
  '{pagedown}': ({ delay, page }: TypistOptions) => page.keyboard.press('PageDown', { delay }),
  '{pageup}': ({ delay, page }: TypistOptions) => page.keyboard.press('PageUp', { delay }),
  ...createAliasedActions(),
  '{enter}': ({ delay, page }: TypistOptions) => page.keyboard.press('Enter', { delay }),
  '\n': ({ delay, page }: TypistOptions) => page.keyboard.press('Enter', { delay }),
  '\r': ({ delay, page }: TypistOptions) => page.keyboard.press('Enter', { delay }),
  '{tab}': ({ delay, page }: TypistOptions) => page.keyboard.press('Tab', { delay }),
  '{esc}': ({ delay, page }: TypistOptions) => page.keyboard.press('Escape', { delay }),
  '{del}': ({ delay, page }: TypistOptions) => page.keyboard.press('Delete', { delay }),
  '{backspace}': ({ delay, page }: TypistOptions) => page.keyboard.press('Backspace', { delay }),
  '{space}': ({ delay, page }: TypistOptions) => page.keyboard.press('Space', { delay }),
  ' ': ({ delay, page }: TypistOptions) => page.keyboard.press('Space', { delay }),
  '{f1}': ({ delay, page }: TypistOptions) => page.keyboard.press('F1', { delay }),
  '{f2}': ({ delay, page }: TypistOptions) => page.keyboard.press('F2', { delay }),
  '{f3}': ({ delay, page }: TypistOptions) => page.keyboard.press('F3', { delay }),
  '{f4}': ({ delay, page }: TypistOptions) => page.keyboard.press('F4', { delay }),
  '{f5}': ({ delay, page }: TypistOptions) => page.keyboard.press('F5', { delay }),
  '{f6}': ({ delay, page }: TypistOptions) => page.keyboard.press('F6', { delay }),
  '{f7}': ({ delay, page }: TypistOptions) => page.keyboard.press('F7', { delay }),
  '{f8}': ({ delay, page }: TypistOptions) => page.keyboard.press('F8', { delay }),
  '{f9}': ({ delay, page }: TypistOptions) => page.keyboard.press('F9', { delay }),
  '{f10}': ({ delay, page }: TypistOptions) => page.keyboard.press('F10', { delay }),
  '{f11}': ({ delay, page }: TypistOptions) => page.keyboard.press('F11', { delay }),
  '{f12}': ({ delay, page }: TypistOptions) => page.keyboard.press('F12', { delay }),
};

function createAliasedActions() {
  const homeAction: TypistAction = ({ delay, page }) =>
    isApple() ? Promise.resolve() : page.keyboard.press('Home', { delay });
  homeAction.alias = isApple() ? '{cmd}{arrowleft}{/cmd}' : undefined;

  const endAction: TypistAction = ({ delay, page }) =>
    isApple() ? Promise.resolve() : page.keyboard.press('End', { delay });
  endAction.alias = isApple() ? '{cmd}{arrowright}{/cmd}' : undefined;

  return {
    '{home}': homeAction,
    '{end}': endAction,
  };
}

function createCloseableAction(name: string, key: string): Record<string, TypistAction> {
  const openTag = `{${name}}`;
  const closeTag = `{/${name}}`;

  const open: TypistAction = async (options) => {
    await options.page.keyboard.down(key);
    return options.delay ? delay(options.delay) : undefined;
  };

  const close: TypistAction = async (options) => {
    await options.page.keyboard.up(key);
    return options.delay ? delay(options.delay) : undefined;
  };

  open.closingTag = closeTag;

  return {
    [openTag]: open,
    [closeTag]: close,
  };
}

export interface TypistAction {
  /**
   * An action can be an alias. When an alias is set the aliased string is
   * prepended to the remaining text.
   *
   * Since this increases the remaining text, it's possible to create an
   * infinite loop. Make sure the alias created won't lead to a circular loop
   * where the text is never completed.
   */
  alias?: string;
  closingTag?: string;
  (options: Omit<TypistOptions, 'page'> & { page: Page }): Promise<void>;
}

/**
 * A generator that yields the actions for each action without the need for an
 * array.
 */
function* createActionQueue(text: string, options: TypistOptions) {
  while (text) {
    const value = getAction(text, options);
    text = value.text;

    yield value.action;
  }
}

interface GetActionReturn {
  action: TypistAction;
  text: string;
}

function getAction(text: string, options: TypistOptions): GetActionReturn {
  const value = Object.entries({ ...defaultModifierActions, ...options.actions }).find(([tag]) =>
    text.startsWith(tag),
  );

  if (value) {
    const [tag, action] = value;
    text = text.slice(tag.length);

    // If this modifier has an associated "close" callback and the developer
    // doesn't close it themselves, then we close it for them automatically
    // Effectively if they send in: '{alt}a' then we type: '{alt}a{/alt}'
    if (!options.skipAutoClose && action.closingTag && !text.includes(action.closingTag)) {
      text += action.closingTag;
    }

    if (action.alias) {
      text = action.alias + text;
    }

    return { action, text };
  }

  const character = text[0] ?? '';

  return {
    action: ({ delay, page }) => page.keyboard.type(character, { delay }),
    text: text.slice(1),
  };
}
