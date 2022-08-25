<script lang="ts">
  import '../app.css';

  import { page } from '$app/stores';
  import { Seo, TRPCProvider } from '$components';
  import MainLayout from '$layout/main.svelte';
  // import { setDehydratedState } from '$stores/dehydrated-state';
  import { setSession } from '$stores/session';

  $: setSession($page.data.session);
  // $: setDehydratedState($page.data.dehydratedState);
</script>

{#key $page.routeId}
  <Seo seo={$page.data.seo} />
{/key}
<TRPCProvider>
  <MainLayout>
    <slot />
  </MainLayout>
</TRPCProvider>
