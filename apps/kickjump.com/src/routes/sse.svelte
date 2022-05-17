<script lang="ts">
  import { onMount } from 'svelte';

  function onMessage(event: MessageEvent) {
    console.log('MESSAGE', event.data, event);
  }

  function onOpen(event: Event) {
    console.log('OPEN', event);
  }

  onMount(() => {
    const eventSource = new EventSource('http://localhost:3000/api/sse');
    eventSource.addEventListener('message', onMessage);
    eventSource.addEventListener('open', onOpen);

    return () => {
      eventSource.removeEventListener('message', onMessage);
      eventSource.removeEventListener('open', onOpen);
    };
  });
</script>
