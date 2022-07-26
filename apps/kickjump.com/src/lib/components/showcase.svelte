<script context="module" lang="ts">
  import { isElement } from '$utils/dom.js';

  interface OnSomethingDetail {
    foo: string;
    bar: number;
  }

  declare global {
    namespace svelte {
      namespace JSX {
        interface DOMAttributes<T> {
          onsomething?: (event: CustomEvent<OnSomethingDetail>) => void;
        }
      }
    }
  }

  function something(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (isElement(event.target) && !node.contains(event.target)) {
        node.dispatchEvent(
          new CustomEvent<OnSomethingDetail>('something', {
            detail: { foo: '', bar: 0 },
          }),
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
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ yo: { message: string; awesome: boolean } }>();

  function onDoubleClick() {
    dispatch('yo', {
      message: 'double clicked!',
      awesome: true,
    });
  }
</script>

<div
  use:something
  on:dblclick={onDoubleClick}
/>
