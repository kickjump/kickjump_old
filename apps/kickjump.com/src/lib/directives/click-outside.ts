import { isDomNode } from '$lib/utils/dom';

export function clickOutside(node: HTMLElement) {
  const handleClick = (event: MouseEvent) => {
    if (isDomNode(event.target) && !node.contains(event.target)) {
      node.dispatchEvent(
        new CustomEvent<ClickOutsideDetails>('clickoutside', { detail: { target: event.target } }),
      );
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    },
  };
}

interface ClickOutsideDetails {
  target: Node;
}

declare global {
  namespace svelte {
    namespace JSX {
      interface DOMAttributes<T> {
        onclickoutside?: (event: CustomEvent<ClickOutsideDetails>) => void;
      }
    }
  }
}
