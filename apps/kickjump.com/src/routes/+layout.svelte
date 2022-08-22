<script lang="ts">
  import '../app.css';

  import { page } from '$app/stores';
  import { Seo, TRPCProvider } from '$components';
  import MainLayout from '$layout/main.svelte';
  import { setSession } from '$stores/session';

  $: setSession($page.data.session);
</script>

{#key $page.routeId}
  <Seo seo={$page.data.seo} />
{/key}
<TRPCProvider>
  <MainLayout>
    <slot />
  </MainLayout>
</TRPCProvider>
