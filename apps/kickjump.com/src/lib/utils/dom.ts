import is from '@sindresorhus/is';

/**
 * Checks whether the passed value is a valid dom node
 */
export function isDomNode(value: unknown): value is Node {
  return is.object(Node)
    ? value instanceof Node
    : is.object(value) && is.number((value as any).nodeType) && is.string((value as any).nodeName);
}

/**
 * Checks for an html element node like `<p>` or `<div>`.
 */
export function isHtmlElement(value: unknown): value is HTMLElement {
  return isDomNode(value) && value.nodeType === Node.ELEMENT_NODE;
}
