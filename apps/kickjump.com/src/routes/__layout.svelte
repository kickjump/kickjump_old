<script context="module" lang="ts">
  import '../app.css';

  import { Seo, TRPCProvider } from '$components';
  import MainLayout from '$layout/main.svelte';
</script>

<Seo />
<TRPCProvider>
  <MainLayout>
    <slot />
  </MainLayout>
</TRPCProvider>
