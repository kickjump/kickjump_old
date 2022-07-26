<script lang="ts" context="module">
  import { loader } from '$lib/route-loaders';
  export const load = loader((event) => {
    const { error, status } = event;
    return {
      props: {
        status,
        message: error?.message,
      },
    };
  });
</script>

<script lang="ts">
  export let message: string;
  export let status: string;
</script>

<h1>{status}</h1>
<p>{message}</p>
