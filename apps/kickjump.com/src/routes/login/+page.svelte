<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$components';
  import { auth } from '$lib/auth';

  $: githubAuth = auth.strategyUrl('github', 'login', {
    redirect: $page.url.searchParams.get('redirect') ?? undefined,
  }).searchPath;
</script>

<Button href={githubAuth} variant="outline" leftIcon="github">Login with GitHub</Button>
