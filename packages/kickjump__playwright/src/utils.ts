import delay from 'delay';
import type { Page } from 'playwright-core';

/**
 * Determines whether this is an apple machine
 */
export function isApple() {
  return process.platform === 'darwin';
}

interface SelectAllProps {
  delay?: number;
  page: Page;
}

/**
 * Emulates a Ctrl+A SelectAll key combination by dispatching custom keyboard
 * events and using the results of those events to determine whether to call
 * `document.execCommand( 'selectall' );`. This is necessary because
 * `playwright` does not emulate Ctrl+A SelectAll in macOS. Events are
 * dispatched to ensure that any `Event#preventDefault` which would have
 * normally occurred in the application as a result of Ctrl+A is respected.
 *
 * @see https://github.com/GoogleChrome/puppeteer/issues/1313
 * @see https://w3c.github.io/uievents/tools/key-event-viewer.html
 */
export const selectAll = async (props: SelectAllProps) => {
  const { page } = props;

  await page.evaluate(() => {
    const isMac = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

    const dom = document.activeElement;

    if (!dom) {
      return;
    }

    dom.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: isMac ? 'Meta' : 'Control',
        code: isMac ? 'MetaLeft' : 'ControlLeft',
        location: KeyboardEvent.DOM_KEY_LOCATION_LEFT,
        getModifierState: (keyArg: string) => keyArg === (isMac ? 'Meta' : 'Control'),
        ctrlKey: !isMac,
        metaKey: isMac,
        charCode: 0,
        keyCode: isMac ? 93 : 17,
        which: isMac ? 93 : 17,
      } as KeyboardEventInit),
    );

    const preventableEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'a',
      code: 'KeyA',
      location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
      getModifierState: (keyArg: string) => keyArg === (isMac ? 'Meta' : 'Control'),
      ctrlKey: !isMac,
      metaKey: isMac,
      charCode: 0,
      keyCode: 65,
      which: 65,
    } as KeyboardEventInit);

    const wasPrevented = !dom.dispatchEvent(preventableEvent) || preventableEvent.defaultPrevented;

    if (!wasPrevented) {
      document.execCommand('selectall', false);
    }

    dom.dispatchEvent(
      new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: isMac ? 'Meta' : 'Control',
        code: isMac ? 'MetaLeft' : 'ControlLeft',
        location: KeyboardEvent.DOM_KEY_LOCATION_LEFT,
        getModifierState: () => false,
        charCode: 0,
        keyCode: isMac ? 93 : 17,
        which: isMac ? 93 : 17,
      } as KeyboardEventInit),
    );
  });

  if (props.delay) {
    return delay(props.delay);
  }
};
