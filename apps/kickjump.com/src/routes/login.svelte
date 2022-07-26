<script lang="ts" context="module">
  import { page } from '$app/stores';
  import { Button } from '$components';
  import { auth } from '$lib/auth';
  import { notAuthenticated } from '$lib/route-loaders';

  export const load = notAuthenticated();
</script>

<script lang="ts">
  $: githubAuth = auth.strategyUrl('github', 'login', {
    redirect: $page.url.searchParams.get('redirect') ?? undefined,
  }).searchPath;
</script>

<Button href={githubAuth} variant="outline" leftIcon="github">Login with GitHub</Button>
