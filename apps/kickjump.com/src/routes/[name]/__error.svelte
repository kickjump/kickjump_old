<script lang="ts" context="module">
  import { loader } from '$lib/route-loaders';
  export const load = loader((event) => {
    const { error, status } = event;
    return {
      props: {
        title: `${status}: ${error?.message}`,
      },
    };
  });
</script>

<script lang="ts">
  export let title: string;
</script>

<h1>{title}</h1>
