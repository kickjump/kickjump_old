interface PlainObject {
  [key: string]: unknown;
}

export function isElement(value: unknown): value is Element {
  return (
    value != null &&
    typeof value === 'object' &&
    'nodeType' in value &&
    (value as PlainObject).nodeType === Node.ELEMENT_NODE
  );
}

/**
 * Checks for an html element node like `<p>` or `<div>`.
 */
export function isHtmlElement(value: unknown): value is HTMLElement {
  if (!isElement(value)) {
    return false;
  }

  const win = value.ownerDocument.defaultView ?? window;
  return value instanceof win.HTMLElement;
}

const focusableElementList = [
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'embed',
  'iframe',
  'object',
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  '[tabindex]',
  'audio[controls]',
  'video[controls]',
  '*[tabindex]:not([aria-disabled])',
  '*[contenteditable]',
];

const focusableElementSelector = focusableElementList.join(',');

export function getAllFocusable<Element extends HTMLElement>(container: Element) {
  const elements = [container, ...container.querySelectorAll<Element>(focusableElementSelector)];
  const focusable: Element[] = [];

  for (const element of elements) {
    if (isFocusable(element) && window.getComputedStyle(element).display !== 'none') {
      focusable.push(element);
    }
  }

  return focusable;
}

export function getFirstFocusable<T extends HTMLElement>(container: T) {
  const allFocusable = getAllFocusable(container);
  return allFocusable.length > 0 ? allFocusable[0] : null;
}

export function isFocusable(element: HTMLElement) {
  if (!isHtmlElement(element) || isHidden(element) || isDisabled(element)) {
    return false;
  }

  const { localName } = element;
  const focusableTags = ['input', 'select', 'textarea', 'button'];

  if (focusableTags.includes(localName)) {
    return true;
  }

  const others = {
    a: () => element.hasAttribute('href'),
    audio: () => element.hasAttribute('controls'),
    video: () => element.hasAttribute('controls'),
  };

  if (localName in others) {
    return others[localName as keyof typeof others]();
  }

  if (isContentEditable(element)) {
    return true;
  }

  return hasTabIndex(element);
}

export function isTabbable(element?: HTMLElement | null) {
  if (!element) {
    return false;
  }

  return isHtmlElement(element) && isFocusable(element) && !hasNegativeTabIndex(element);
}

export const hasDisplayNone = (element: HTMLElement) =>
  window.getComputedStyle(element).display === 'none';

export const hasTabIndex = (element: HTMLElement) => element.hasAttribute('tabindex');

export const hasNegativeTabIndex = (element: HTMLElement) =>
  hasTabIndex(element) && element.tabIndex === -1;

export function isDisabled(element: HTMLElement) {
  return (
    Boolean(element.getAttribute('disabled')) === true ||
    Boolean(element.getAttribute('aria-disabled')) === true
  );
}

export interface FocusableElement {
  focus: (options?: FocusOptions) => void;
}

export function isInputElement(element: FocusableElement): element is HTMLInputElement {
  return isHtmlElement(element) && element.localName === 'input' && 'select' in element;
}

export function isActiveElement(element: FocusableElement) {
  const doc = isHtmlElement(element) ? getOwnerDocument(element) : document;
  return doc.activeElement === (element as HTMLElement);
}

export function hasFocusWithin(element: HTMLElement) {
  if (!document.activeElement) {
    return false;
  }

  return element.contains(document.activeElement);
}

export function isHidden(element: HTMLElement) {
  if (element.parentElement && isHidden(element.parentElement)) {
    return true;
  }

  return element.hidden;
}

export function isContentEditable(element: HTMLElement) {
  const value = element.getAttribute('contenteditable');
  return value !== 'false' && value != null;
}

export function getOwnerDocument(node?: Element | null): Document {
  return isElement(node) ? node.ownerDocument ?? document : document;
}
